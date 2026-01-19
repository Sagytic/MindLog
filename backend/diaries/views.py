from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User  
from .models import Diary
from .serializers import DiarySerializer, UserSerializer
from .ai_utils import analyze_diary  

# 1. 일기장 기능 (CRUD + AI + Soft Delete)
class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated] # 로그인한 사람만 사용 가능

    def get_queryset(self):
        # [기존 로직 유지] 내 일기만 + 삭제되지 않은 것만 가져오기
        return Diary.objects.filter(user=self.request.user, is_deleted=False).order_by('-created_at')
    
    def perform_create(self, serializer):
        # [기존 로직 유지] AI 감정 분석 후 저장
        content = serializer.validated_data.get('content')
        ai_result = analyze_diary(content)
        
        serializer.save(
            user=self.request.user,
            emotion=ai_result.get('emotion'),
            advice=ai_result.get('advice')
        )

    def perform_destroy(self, instance):
        # [기존 로직 유지] 진짜 삭제하지 않고 숨김 처리 (Soft Delete)
        instance.soft_delete()

# 2. 회원가입 기능 (새로 추가)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # 누구나 가입 가능
    serializer_class = UserSerializer
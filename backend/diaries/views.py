from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from .models import Diary
from .serializers import DiarySerializer, DiarySimpleSerializer
from .ai_utils import analyze_diary
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination

# [추가] 10개씩 끊어주는 규칙 만들기
class DiaryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]
    # [추가] 기본적으로 위에서 만든 페이지네이션 규칙 적용
    pagination_class = DiaryPagination

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user, is_deleted=False).order_by('-created_at')

    # [수정] list 메서드를 오버라이딩하여 '?all=true' 처리
    def list(self, request, *args, **kwargs):
        # [최적화] 캘린더/통계용 경량화된 데이터 반환 (?mode=calendar)
        if request.query_params.get('mode') == 'calendar':
            self.pagination_class = None
            self.serializer_class = DiarySimpleSerializer
            return super().list(request, *args, **kwargs)

        # 만약 URL에 ?all=true 가 붙어있다면 페이지네이션 없이 다 반환 (검색 등)
        if request.query_params.get('all') == 'true':
            self.pagination_class = None
            return super().list(request, *args, **kwargs)
        
        # 아니면 기본 페이지네이션(10개씩) 적용
        return super().list(request, *args, **kwargs)
    
    # ... (perform_create, perform_update, perform_destroy 등 나머지는 기존 그대로 유지!)
    def perform_create(self, serializer):
        content = serializer.validated_data.get('content')
        ai_result = analyze_diary(content)
        serializer.save(
            user=self.request.user,
            emotion=ai_result.get('emotion'),
            advice=ai_result.get('advice')
        )

    def perform_update(self, serializer):
        instance = serializer.instance
        new_content = serializer.validated_data.get('content')
        if new_content and new_content != instance.content:
            ai_result = analyze_diary(new_content)
            serializer.save(emotion=ai_result.get('emotion'), advice=ai_result.get('advice'))
        else:
            serializer.save()

    def perform_destroy(self, instance):
        instance.soft_delete()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # 누구나 가입 가능
    serializer_class = UserSerializer
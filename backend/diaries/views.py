from rest_framework import viewsets, permissions
from .models import Diary
from .serializers import DiarySerializer
from .ai_utils import analyze_diary # <--- [추가] 방금 만든 함수 임포트

class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiarySerializer

    # [기존] 인증된 사용자만 접근 가능
    permission_classes = [permissions.IsAuthenticated] 
    
    # [수정 후] 누구나 들어올 수 있게 변경 (테스트용)
    # permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # [수정] 로그인 안 한 상태에서는 user 필터링을 못 하니 잠시 주석 처리하거나 변경
        # return Diary.objects.filter(user=self.request.user, is_deleted=False)
        return Diary.objects.filter(user=self.request.user, is_deleted=False)
    
    def perform_create(self, serializer):
        content = serializer.validated_data.get('content')
        ai_result = analyze_diary(content)
        
        serializer.save(
            user=self.request.user,
            emotion=ai_result.get('emotion'),
            advice=ai_result.get('advice')
        )

    def perform_destroy(self, instance):
        instance.soft_delete()
from rest_framework import viewsets, permissions
from .models import Diary
from .serializers import DiarySerializer
from .ai_utils import analyze_diary # <--- [추가] 방금 만든 함수 임포트

class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        # 1. 사용자가 보낸 일기 내용 가져오기
        content = serializer.validated_data.get('content')
        
        # 2. OpenAI에게 분석 요청 (API Call)
        ai_result = analyze_diary(content)
        
        # 3. 결과 받아서 DB에 같이 저장
        # ABAP: MODIFY zdiary FROM ls_data.
        serializer.save(
            user=self.request.user,
            emotion=ai_result.get('emotion'),
            advice=ai_result.get('advice')
        )

    def perform_destroy(self, instance):
        instance.soft_delete()
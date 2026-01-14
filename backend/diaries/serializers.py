from rest_framework import serializers
from .models import Diary

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        # 프론트엔드와 주고받을 필드들을 정의합니다.
        fields = [
            'id', 
            'content', 
            'emotion', 
            'advice', 
            'created_at', 
            'updated_at',
            'is_deleted'
        ]
        
        # [중요] 읽기 전용 필드 설정
        # 사용자가 일기를 쓸 때(POST), 감정/조언/시간은 입력하지 않습니다. (시스템 or AI가 처리)
        # ABAP의 Screen Field 속성을 'Output Only'로 설정하는 것과 같습니다.
        read_only_fields = ['emotion', 'advice', 'created_at', 'updated_at', 'is_deleted']
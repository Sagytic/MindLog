from rest_framework import serializers
from .models import Diary
from django.contrib.auth.models import User

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        # 프론트엔드와 주고받을 필드들을 정의합니다.
        fields = [
            'id', 
            'content', 
            'image',
            'emotion', 
            'advice', 
            'created_at', 
            'updated_at',
            'is_deleted'
        ]

        # 사용자가 일기를 쓸 때(POST), 감정/조언/시간/삭제여부는 입력하지 않습니다. (시스템 or AI가 처리)
        read_only_fields = ['emotion', 'advice', 'created_at', 'updated_at', 'is_deleted']

class DiarySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'created_at', 'emotion']

# 회원가입용 시리얼라이저
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # 비밀번호는 응답에 포함되지 않게 설정

    class Meta:
        model = User
        fields = ('username', 'password') # 필요한 경우 'email' 등 추가 가능

    def create(self, validated_data):
        # create_user를 써야 비밀번호가 해시(암호화)되어 저장됨
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user        
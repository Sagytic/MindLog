from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone # 시간 기록용

class Diary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diaries')
    content = models.TextField(verbose_name="일기 내용")
    
    # upload_to='diary_images/': media/diary_images 폴더에 저장됨
    # blank=True, null=True: 사진 없이 글만 써도 저장 가능
    image = models.ImageField(upload_to='diary_images/', null=True, blank=True, verbose_name="첨부 이미지")

    emotion = models.CharField(max_length=200, null=True, blank=True, verbose_name="감정 상태")
    advice = models.TextField(null=True, blank=True, verbose_name="AI 조언")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="작성일시")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일시")

    # --- [Soft Delete 필드] ---
    is_deleted = models.BooleanField(default=False, verbose_name="삭제여부")
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name="삭제일시")

    class Meta:
        db_table = 'diary'
        ordering = ['-created_at']

    def __str__(self):
        prefix = "[삭제됨] " if self.is_deleted else ""
        return f"{prefix}{self.user.username}님의 일기 - {self.created_at.strftime('%Y-%m-%d')}"

    # --- [편의 기능] ---
    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now() # 기존 로직 유지
        self.save()

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()
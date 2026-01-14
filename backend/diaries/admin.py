from django.contrib import admin
from .models import Diary

@admin.register(Diary)
class DiaryAdmin(admin.ModelAdmin):
    # 목록에 삭제 여부와 삭제 시간도 보여줌
    list_display = ('id', 'user', 'emotion', 'is_deleted', 'created_at', 'deleted_at')
    
    # 우측 필터에 '삭제 여부' 추가 (휴지통 기능처럼 씀)
    list_filter = ('is_deleted', 'created_at', 'emotion')
    
    search_fields = ('content',)
    
    # 관리자 페이지에서 일괄 복구하는 기능 (Action) 추가
    actions = ['restore_diaries']

    @admin.action(description='선택한 일기 복구하기 (삭제 취소)')
    def restore_diaries(self, request, queryset):
        # 선택된 애들을 한방에 복구 (UPDATE diary SET is_deleted = False ...)
        queryset.update(is_deleted=False, deleted_at=None)
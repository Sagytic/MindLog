# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings             # [필수] 설정 가져오기
from django.conf.urls.static import static   # [필수] 정적 파일 연결 함수

from rest_framework_simplejwt.views import (
    TokenObtainPairView, 
    TokenRefreshView,    
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 로그인 관련
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 일기 앱
    path('api/diaries/', include('diaries.urls')),
]

# 개발 모드(DEBUG=True)일 때만 미디어 파일 서빙
# 이 부분이 있어야 http://127.0.0.1:8000/media/파일명.jpg 로 접근 가능
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
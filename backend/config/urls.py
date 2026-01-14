"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# [추가] JWT 관련 뷰 임포트
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # 로그인 (ID/PW 주면 토큰 줌)
    TokenRefreshView,    # 토큰 갱신 (만료되면 새거 줌)
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # [추가] 로그인 관련 URL (티켓 발급소)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/diaries/', include('diaries.urls')),

]

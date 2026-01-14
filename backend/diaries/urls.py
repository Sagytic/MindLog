from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiaryViewSet

# ViewSet에 있는 CRUD 기능을 자동으로 URL로 매핑
router = DefaultRouter()
router.register(r'', DiaryViewSet, basename='diary')

urlpatterns = [
    path('', include(router.urls)),
]
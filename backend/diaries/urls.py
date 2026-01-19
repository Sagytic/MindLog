from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiaryViewSet, RegisterView

router = DefaultRouter()
router.register(r'', DiaryViewSet, basename='diary')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    # The router should be included last because it will catch all remaining routes.
    path('', include(router.urls)),
]
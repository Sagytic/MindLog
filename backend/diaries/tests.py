from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Diary

class PerformanceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        Diary.objects.create(user=self.user, content="Test Diary", emotion="Happy")

    def test_calendar_mode(self):
        response = self.client.get('/api/diaries/?mode=calendar')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
        item = data[0]
        self.assertIn('id', item)
        self.assertIn('created_at', item)
        self.assertIn('emotion', item)
        self.assertNotIn('content', item)
        self.assertNotIn('advice', item)

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Diary

class DiaryOptimizationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a diary entry with content
        self.diary = Diary.objects.create(
            user=self.user,
            content="This is a very long content string that we want to avoid fetching in calendar mode." * 10,
            emotion="happy"
        )

    def test_calendar_mode_optimization(self):
        # 1. Test ?mode=calendar
        response = self.client.get('/api/diaries/?mode=calendar')
        self.assertEqual(response.status_code, 200)

        # Should be a list (no pagination)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)

        item = data[0]
        # Should contain lightweight fields
        self.assertIn('id', item)
        self.assertIn('created_at', item)
        self.assertIn('emotion', item)

        # Should NOT contain heavy fields
        self.assertNotIn('content', item)
        self.assertNotIn('advice', item)
        self.assertNotIn('image', item)

    def test_standard_list_pagination(self):
        # 2. Test standard list (should still be paginated and have full content)
        response = self.client.get('/api/diaries/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn('results', data) # Pagination structure
        self.assertIn('content', data['results'][0])

    def test_all_param(self):
        # 3. Test ?all=true (legacy behavior, arguably we are replacing it for calendar,
        # but the view might still support it for other things or we optimized it away?)
        # The code supports ?all=true -> no pagination, but full serializer.
        response = self.client.get('/api/diaries/?all=true')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIsInstance(data, list)
        self.assertIn('content', data[0])

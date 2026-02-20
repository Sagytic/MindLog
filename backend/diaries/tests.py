from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Diary
from rest_framework import status

class DiaryViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        self.diary = Diary.objects.create(
            user=self.user,
            content="Today was a good day.",
            emotion="Happy",
            advice="Keep it up!"
        )

    def test_list_diaries_default(self):
        """Test default list view returns full data and is paginated"""
        response = self.client.get('/api/diaries/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data) # Pagination structure
        self.assertEqual(len(response.data['results']), 1)
        self.assertIn('content', response.data['results'][0])
        self.assertIn('advice', response.data['results'][0])

    def test_list_diaries_calendar_mode(self):
        """Test mode=calendar returns simplified data and no pagination"""
        response = self.client.get('/api/diaries/?mode=calendar')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should be a list, not a paginated object
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)

        item = response.data[0]
        self.assertIn('id', item)
        self.assertIn('created_at', item)
        self.assertIn('emotion', item)
        self.assertNotIn('content', item)
        self.assertNotIn('advice', item)

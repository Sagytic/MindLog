from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Diary

class DiaryPerformanceTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)

        # Create some diaries
        for i in range(5):
            Diary.objects.create(
                user=self.user,
                content=f'Content {i}',
                emotion=f'Emotion {i}',
                advice=f'Advice {i}'
            )

    def test_calendar_mode_lightweight_response(self):
        """
        Verify that mode=calendar returns a lightweight response
        (only id, created_at, emotion) and excludes large fields.
        """
        response = self.client.get('/api/diaries/?mode=calendar')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 5)

        first_item = data[0]
        self.assertIn('id', first_item)
        self.assertIn('created_at', first_item)
        self.assertIn('emotion', first_item)

        # Ensure heavy fields are NOT present
        self.assertNotIn('content', first_item)
        self.assertNotIn('advice', first_item)
        self.assertNotIn('image', first_item)

    def test_full_response_without_mode(self):
        """
        Verify that normal request returns full details.
        """
        response = self.client.get('/api/diaries/') # paginated
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.json()['results']
        first_item = results[0]

        self.assertIn('content', first_item)
        self.assertIn('advice', first_item)

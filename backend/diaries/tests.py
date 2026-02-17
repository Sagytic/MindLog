from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Diary

class DiaryAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        self.diary = Diary.objects.create(
            user=self.user,
            content="Today was a good day. I felt happy.",
            emotion="Happy",
            advice="Keep it up!"
        )

    def test_get_calendar_mode(self):
        """Test that mode=calendar returns lightweight objects."""
        # Fetch with mode=calendar
        response = self.client.get('/api/diaries/?mode=calendar')

        self.assertEqual(response.status_code, 200)

        # Should be a list (not paginated result)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)

        # Should contain expected fields
        item = response.data[0]
        self.assertIn('id', item)
        self.assertIn('created_at', item)
        self.assertIn('emotion', item)

        # Should NOT contain content (heavy field)
        self.assertNotIn('content', item)
        self.assertNotIn('advice', item)

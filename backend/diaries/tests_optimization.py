from django.test import TestCase
from django.contrib.auth.models import User
from .models import Diary
from rest_framework.test import APIClient

class OptimizationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'testuser_opt'
        self.password = 'testpassword123'
        self.user = User.objects.create_user(username=self.username, password=self.password)

        # Authenticate
        response = self.client.post('/api/token/', {'username': self.username, 'password': self.password})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Create Diary
        self.diary_data = {
            'content': 'Optimized diary content for testing performance.',
            'emotion': 'Happy',
            'advice': 'Keep optimizing!'
        }
        self.diary = Diary.objects.create(
            user=self.user,
            content=self.diary_data['content'],
            emotion=self.diary_data['emotion'],
            advice=self.diary_data['advice']
        )

    def test_calendar_mode_optimization(self):
        print("\n--- Testing Optimized Endpoint (?mode=calendar) ---")
        response = self.client.get('/api/diaries/?mode=calendar')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(isinstance(data, list), "Expected list response for mode=calendar")

        # Check first item
        first_item = data[0]
        expected_keys = {'id', 'created_at', 'emotion'}
        self.assertEqual(set(first_item.keys()), expected_keys, "Response keys do not match expected lightweight keys")
        print("✅ SUCCESS: Response contains ONLY expected lightweight keys.")

    def test_full_details_endpoint(self):
        print("\n--- Testing Full Details Endpoint (GET /api/diaries/{id}/) ---")
        response = self.client.get(f'/api/diaries/{self.diary.id}/')
        self.assertEqual(response.status_code, 200)

        details = response.json()
        self.assertIn('content', details)
        self.assertIn('advice', details)
        print("✅ SUCCESS: Full details fetched successfully.")

    def test_default_pagination(self):
        print("\n--- Testing Default Pagination ---")
        response = self.client.get('/api/diaries/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('results', data, "Expected paginated response (results key)")
        print("✅ SUCCESS: Default behavior preserved.")

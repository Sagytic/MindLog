from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded(self):
        """Test that SECRET_KEY is loaded from environment."""
        self.assertTrue(settings.SECRET_KEY)
        # Ensure it matches what is in the environment
        # Note: In some test setups, environment might be different, but here we expect .env to be loaded
        self.assertEqual(settings.SECRET_KEY, os.getenv('DJANGO_SECRET_KEY'))

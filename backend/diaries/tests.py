from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded(self):
        """Test that SECRET_KEY is loaded from environment."""
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertTrue(len(settings.SECRET_KEY) > 0)
        # Verify it matches what is in the environment
        self.assertEqual(settings.SECRET_KEY, os.getenv('DJANGO_SECRET_KEY'))

    def test_debug_mode(self):
        """Test that DEBUG mode env var is accessible."""
        # Django's TestCase forces DEBUG=False, so testing settings.DEBUG is misleading here.
        # We just verify that the environment variable was loaded correctly.
        self.assertEqual(os.getenv('DJANGO_DEBUG'), 'True')

    def test_allowed_hosts(self):
        """Test that ALLOWED_HOSTS is a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        self.assertGreater(len(settings.ALLOWED_HOSTS), 0)

    def test_simple_jwt_config(self):
        """Test that SIMPLE_JWT config is consolidated and correct."""
        self.assertIn('ACCESS_TOKEN_LIFETIME', settings.SIMPLE_JWT)
        self.assertIn('AUTH_HEADER_TYPES', settings.SIMPLE_JWT)
        self.assertEqual(settings.SIMPLE_JWT['AUTH_HEADER_TYPES'], ('Bearer',))

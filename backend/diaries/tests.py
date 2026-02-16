from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_set(self):
        """Test that SECRET_KEY is set and not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_is_false_by_default(self):
        """
        Test that DEBUG is False by default in test environment.
        Note: Django's TestCase sets DEBUG=False automatically.
        """
        self.assertFalse(settings.DEBUG)

    def test_allowed_hosts(self):
        """Test that ALLOWED_HOSTS is properly configured."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        self.assertIn('testserver', settings.ALLOWED_HOSTS)

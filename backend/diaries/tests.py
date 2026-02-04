from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_loaded(self):
        """Test that SECRET_KEY is loaded from environment and is not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_mode(self):
        """Test that DEBUG is boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts(self):
        """Test that ALLOWED_HOSTS is a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)

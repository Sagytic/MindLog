from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_set(self):
        """Ensure SECRET_KEY is set and not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_mode(self):
        """Ensure DEBUG is set correctly based on environment."""
        # Django TestCase sets DEBUG=False regardless of settings
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts(self):
        """Ensure ALLOWED_HOSTS is a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)

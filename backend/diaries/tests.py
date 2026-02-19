from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded(self):
        """Test that SECRET_KEY is not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_allowed_hosts_config(self):
        """Test that ALLOWED_HOSTS is a list and not empty."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        self.assertTrue(len(settings.ALLOWED_HOSTS) > 0)

    def test_debug_mode_config(self):
        """Test that DEBUG is a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

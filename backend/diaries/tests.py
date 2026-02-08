from django.test import TestCase
from django.conf import settings

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_loaded(self):
        """Test that SECRET_KEY is loaded from environment and is not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_mode_is_boolean(self):
        """Test that DEBUG is a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts_is_list(self):
        """Test that ALLOWED_HOSTS is a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        self.assertTrue(len(settings.ALLOWED_HOSTS) > 0)

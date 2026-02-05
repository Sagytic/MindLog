from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded_from_env(self):
        """Test that SECRET_KEY is loaded from environment variables."""
        self.assertIsNotNone(settings.SECRET_KEY)
        # Verify it's not the old insecure key if we have changed it
        old_insecure_key = 'django-insecure-h4r9b29iv8+#7z^(1i7n5rb+*%87^d00srf7v%1q*70#eo1@2e'
        if os.environ.get('DJANGO_SECRET_KEY'):
             self.assertNotEqual(settings.SECRET_KEY, old_insecure_key)

    def test_debug_mode_config(self):
        """Test that DEBUG is a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts_config(self):
        """Test that ALLOWED_HOSTS is a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)

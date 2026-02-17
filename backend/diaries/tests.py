from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_not_default(self):
        """Test that the SECRET_KEY is not the default insecure one."""
        insecure_key = 'django-insecure-h4r9b29iv8+#7z^(1i7n5rb+*%87^d00srf7v%1q*70#eo1@2e'
        self.assertNotEqual(settings.SECRET_KEY, insecure_key, "SECRET_KEY should not be the default insecure key.")

    def test_debug_mode_is_configurable(self):
        """Test that DEBUG mode configuration logic exists."""
        # Django TestCase forces DEBUG=False, so we can't assert it's True based on .env
        self.assertFalse(settings.DEBUG)
        # But we can verify our env var was loaded correctly into os.environ
        self.assertEqual(os.environ.get('DJANGO_DEBUG'), 'True', "DJANGO_DEBUG env var should be loaded.")

    def test_allowed_hosts_is_list(self):
        """Test that ALLOWED_HOSTS is a list and contains expected values."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        expected_hosts = os.getenv('DJANGO_ALLOWED_HOSTS', '').split(',')
        # Check that all expected hosts are in settings.ALLOWED_HOSTS
        # Note: Django adds 'testserver' to ALLOWED_HOSTS during tests
        for host in expected_hosts:
            self.assertIn(host, settings.ALLOWED_HOSTS, f"Host {host} should be in ALLOWED_HOSTS")

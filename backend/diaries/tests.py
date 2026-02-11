from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_safe(self):
        """Test that SECRET_KEY is loaded from environment and is not the insecure default."""
        env_secret = os.getenv('DJANGO_SECRET_KEY')
        self.assertEqual(settings.SECRET_KEY, env_secret)
        # Verify it's not the old insecure key
        self.assertNotEqual(settings.SECRET_KEY, 'django-insecure-h4r9b29iv8+#7z^(1i7n5rb+*%87^d00srf7v%1q*70#eo1@2e')

    def test_allowed_hosts_configuration(self):
        """Test that ALLOWED_HOSTS is correctly parsed from environment."""
        expected_hosts = os.getenv('DJANGO_ALLOWED_HOSTS').split(',')
        # TestCase adds 'testserver' to ALLOWED_HOSTS, so we check if our expected hosts are present
        for host in expected_hosts:
            self.assertIn(host, settings.ALLOWED_HOSTS)
        self.assertIn('localhost', settings.ALLOWED_HOSTS)

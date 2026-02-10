from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded(self):
        """Test that SECRET_KEY is loaded from environment variable."""
        self.assertEqual(settings.SECRET_KEY, os.getenv('DJANGO_SECRET_KEY'))

    def test_allowed_hosts(self):
        """Test that ALLOWED_HOSTS includes values from environment variable."""
        expected_hosts = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
        for host in expected_hosts:
            self.assertIn(host, settings.ALLOWED_HOSTS)

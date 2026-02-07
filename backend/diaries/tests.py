from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded_from_env(self):
        """Verify SECRET_KEY is loaded from environment variables."""
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertEqual(settings.SECRET_KEY, os.environ.get('DJANGO_SECRET_KEY'))

    def test_allowed_hosts_loaded_from_env(self):
        """Verify ALLOWED_HOSTS is loaded from environment variables."""
        env_hosts = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')
        for host in env_hosts:
            self.assertIn(host, settings.ALLOWED_HOSTS)

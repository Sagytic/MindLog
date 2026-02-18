from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_from_env(self):
        """Ensure SECRET_KEY is loaded from environment."""
        self.assertTrue(os.getenv('DJANGO_SECRET_KEY'))
        self.assertEqual(settings.SECRET_KEY, os.getenv('DJANGO_SECRET_KEY'))

    def test_allowed_hosts_from_env(self):
        """Ensure ALLOWED_HOSTS is loaded from environment."""
        env_hosts_str = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
        env_hosts = env_hosts_str.split(',')
        # Django test runner adds 'testserver' to ALLOWED_HOSTS, so we check subset
        for host in env_hosts:
            self.assertIn(host, settings.ALLOWED_HOSTS)

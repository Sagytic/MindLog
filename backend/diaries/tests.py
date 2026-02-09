from django.test import TestCase
from django.conf import settings
import os

# Create your tests here.
class SettingsSecurityTest(TestCase):
    def test_secret_key_loaded_from_env(self):
        """
        Verify that SECRET_KEY is loaded from the environment variable.
        """
        # In this test environment, we expect it to match the .env value we set.
        env_secret_key = os.getenv('DJANGO_SECRET_KEY')
        self.assertIsNotNone(env_secret_key, "DJANGO_SECRET_KEY not set in env")
        self.assertEqual(settings.SECRET_KEY, env_secret_key)

        # Ensure it's NOT a hardcoded insecure default if we had one
        # (Though we removed the default, this checks we didn't accidentally hardcode it back)
        # Here we just check it is not empty.
        self.assertTrue(len(settings.SECRET_KEY) > 0)

    def test_allowed_hosts_configured(self):
        """
        Verify that ALLOWED_HOSTS is loaded from the environment variable.
        """
        env_hosts = os.getenv('DJANGO_ALLOWED_HOSTS', '').split(',')
        # Django adds 'testserver' to ALLOWED_HOSTS during tests
        actual_hosts = [h for h in settings.ALLOWED_HOSTS if h != 'testserver']
        self.assertEqual(actual_hosts, env_hosts)

from django.test import TestCase
from django.conf import settings

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_set(self):
        """SECRET_KEY should be set and not empty."""
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertTrue(settings.SECRET_KEY)

    def test_debug_mode_config(self):
        """DEBUG should be a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts_config(self):
        """ALLOWED_HOSTS should be a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        # Ensure that local hosts are allowed in testing
        # When running tests, Django's test runner might override ALLOWED_HOSTS or use 'testserver'
        self.assertTrue(len(settings.ALLOWED_HOSTS) > 0)

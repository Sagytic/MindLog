from django.test import TestCase
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_set(self):
        """SECRET_KEY should be set and not empty."""
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_mode_type(self):
        """DEBUG should be a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

    def test_allowed_hosts_is_list(self):
        """ALLOWED_HOSTS should be a list."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)
        self.assertTrue(len(settings.ALLOWED_HOSTS) > 0)

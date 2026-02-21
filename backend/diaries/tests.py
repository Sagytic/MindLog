from django.test import TestCase
from django.conf import settings
import os

class SettingsSecurityTest(TestCase):
    def test_secret_key_is_loaded(self):
        """Verify SECRET_KEY is loaded and not empty."""
        self.assertTrue(settings.SECRET_KEY)

    def test_debug_is_boolean(self):
        """Verify DEBUG is a boolean."""
        self.assertIsInstance(settings.DEBUG, bool)

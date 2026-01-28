from django.test import TestCase
from django.conf import settings
import os

class SecuritySettingsTest(TestCase):
    def test_secret_key_is_secure(self):
        """
        Verify that SECRET_KEY is not the insecure default.
        """
        # The insecure key that was previously hardcoded
        insecure_key = 'django-insecure-h4r9b29iv8+#7z^(1i7n5rb+*%87^d00srf7v%1q*70#eo1@2e'

        # We ensure the current key is NOT this insecure key
        self.assertNotEqual(settings.SECRET_KEY, insecure_key)

        # Ensure it is not empty
        self.assertTrue(settings.SECRET_KEY)

    def test_debug_mode_type(self):
        """
        Ensure DEBUG is a boolean.
        """
        self.assertIsInstance(settings.DEBUG, bool)

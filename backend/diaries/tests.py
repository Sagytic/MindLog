from django.test import TestCase
from django.conf import settings

# Create your tests here.
class SettingsSecurityTest(TestCase):
    def test_secret_key_is_loaded(self):
        """Test that SECRET_KEY is not empty."""
        self.assertTrue(settings.SECRET_KEY)
        self.assertNotEqual(settings.SECRET_KEY, '')

    def test_debug_is_boolean(self):
        """Test that DEBUG is a boolean value."""
        self.assertIsInstance(settings.DEBUG, bool)

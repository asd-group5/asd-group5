from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import CustomUserObject

class UserAPITests(APITestCase):

    def setUp(self):
        # Create a user for login/logout tests
        self.user_data = {
            "email": "test@example.com",
            "password": "password123",
        }
        self.user = CustomUserObject.objects.create_user(**self.user_data)

    def test_login(self):
        url = reverse('login')
        data = {
            "email": self.user_data['email'],
            "password": "password123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_logout(self):
        url = reverse('logout')  
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, {'refresh': 'mock_refresh_token'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)



    def test_user_deletion_in_admin(self):
        url = reverse('user', args=[self.user.id])
        self.client.force_login(self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)  # Expecting a redirect
        self.assertFalse(CustomUserObject.objects.filter(id=self.user.id).exists())  # Verify user deleted

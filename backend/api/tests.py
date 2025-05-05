from django.test import TestCase

# Create your tests here.
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from http.cookies import SimpleCookie
from rest_framework import status
from django.urls import reverse


class RegistrationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword123"
        }

    def test_user_registration_successful(self):
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "testuser")

        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

        access_cookie = response.cookies["access_token"]
        refresh_cookie = response.cookies["refresh_token"]

        self.assertTrue(access_cookie["httponly"])
        self.assertTrue(refresh_cookie["httponly"])

    def test_registration_with_existing_username(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_registration_with_invalid_data(self):
        bad_data = {
            "username": "",
            "email": "not-an-email",
            "password": "123"
        }
        response = self.client.post(self.register_url, bad_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        self.assertIn("email", response.data)

class TokenCookiesTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword123"
        }
    def test_jwt_tokens_set_as_httponly_cookies(self):
            response = self.client.post(self.register_url, self.user_data, format='json')

            self.assertEqual(response.status_code, 201)

            self.assertIn("access_token", response.cookies)
            self.assertIn("refresh_token", response.cookies)

            access_cookie: SimpleCookie = response.cookies["access_token"]
            refresh_cookie: SimpleCookie = response.cookies["refresh_token"]

            self.assertTrue(access_cookie["httponly"])
            self.assertTrue(refresh_cookie["httponly"])

            self.assertNotIn("access_token", response.data)
            self.assertNotIn("refresh_token", response.data)
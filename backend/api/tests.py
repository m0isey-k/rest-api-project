from django.test import TestCase, Client

# Create your tests here.
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from http.cookies import SimpleCookie
from api.models import CollectionItem
from rest_framework import status
from unittest.mock import patch
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

class LoginTokenCookieTests(APITestCase):
    def setUp(self):
        self.login_url = reverse('get_token')
        self.credentials = {
            "username": "loginuser",
            "password": "strongpassword123"
        }

        User.objects.create_user(
            username=self.credentials["username"],
            password=self.credentials["password"],
            email="login@example.com"
        )

class LoginTests(APITestCase):
    def setUp(self):
        self.login_url = reverse("get_token")
        self.credentials = {
            "username": "testuser",
            "password": "securepassword123"
        }
        User.objects.create_user(
            username=self.credentials["username"],
            password=self.credentials["password"],
            email="test@example.com"
        )

    def test_login_with_valid_credentials(self):
        response = self.client.post(self.login_url, self.credentials, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    def test_login_with_wrong_password(self):
        wrong_creds = {
            "username": self.credentials["username"],
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, wrong_creds, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertNotIn("access_token", response.cookies)
        self.assertNotIn("refresh_token", response.cookies)

    def test_login_with_nonexistent_user(self):
        response = self.client.post(self.login_url, {
            "username": "nouser",
            "password": "whatever"
        }, format="json")
        self.assertEqual(response.status_code, 401)

    def test_login_with_missing_fields(self):
        response = self.client.post(self.login_url, {
            "username": "testuser"  
        }, format="json")
        self.assertEqual(response.status_code, 400)

class SearchViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.search_url = reverse("search")
        self.user = User.objects.create_user(username="user", password="password")
        
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.cookies["access_token"] = access_token

    @patch("api.views.get_books")
    @patch("api.views.get_movies")
    def test_search_combines_and_sorts_results(self, mock_get_movies, mock_get_books):
        mock_get_books.return_value = [
            {"title": "Alpha", "rating": 3, "type": "book"},
            {"title": "Beta", "rating": 5, "type": "book"}
        ]
        mock_get_movies.return_value = [
            {"title": "Movie A", "rating": 4, "type": "movie"}
        ]

        response = self.client.get(self.search_url, {"query": "test"})

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)

        ratings = [item["rating"] for item in data]
        self.assertEqual(ratings, sorted(ratings, reverse=True))

        mock_get_books.assert_called_once_with("test")
        mock_get_movies.assert_called_once_with("test")

class CreateCollectionItemTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.url = reverse('create_item')
        self.item_data = {
            "item_id": "book123",
            "title": "Test Book",
            "thumbnail": "http://example.com/thumb.jpg",
            "rating": 4.5,
            "type": "book",
            "collection": "favorites"
        }

        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.cookies['access_token'] = access_token

    def test_create_collection_item(self):
        response = self.client.post(self.url, self.item_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(CollectionItem.objects.count(), 1)
        item = CollectionItem.objects.first()
        self.assertEqual(item.title, self.item_data["title"])
        self.assertEqual(item.user, self.user)

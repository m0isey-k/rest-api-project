from dotenv import load_dotenv
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics

from api.models import CollectionItem
from .serializers import CollectionItemSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

import os
import requests
import random

load_dotenv()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data["id"])

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response.set_cookie(
                key="access_token",
                value=access_token,
                path="/",
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=True,
                httponly=True,
                samesite="Lax",
                )
        response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                path="/",
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=True,
                httponly=True,
                samesite="Lax",
                )
        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]

        response.set_cookie(
                key="access_token",
                value=access_token,
                path="/",
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=True,
                httponly=True,
                samesite="Lax",
                )
        response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                path="/",
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=True,
                httponly=True,
                samesite="Lax",
                )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _):
        try:
            res = Response()
            res.delete_cookie('access_token')
            res.delete_cookie('refresh_token')
            res.data = {'success':True}

            return res
        except Exception as e:
            print(e)
            return Response({'success':False})



class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, _):
        return Response({'is_authenticated': True})


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        term = request.GET.get("query")
        res = [] 
        res.extend(get_books(term))
        res.extend(get_movies(term))
        res.sort(key=lambda k: k['rating'], reverse=True)

        return Response(res)


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _):
        res = []
        res.extend(get_home_books())
        res.extend(get_home_movies())
        res.sort(key=lambda k: k['rating'], reverse=True)

        return Response(res)



def get_home_books():
    genres = ['science-fiction', 'fantasy', 'mystery', 'thriller', 'romance', 'business', 'history']
    books_url = f"https://www.googleapis.com/books/v1/volumes?q=subject:{random.choice(genres)}&orderBy=relevance&maxResults=40"
    response = requests.get(books_url).json()
    data = []
    for item in response['items']:
        info = item['volumeInfo']
        thumbnail = info.get("imageLinks", {}).get("thumbnail", "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg")
        authors = info.get("authors", [])
        data.append({
            'id':  item.get('id', ''),
            'title': info.get('title', ''),
            'thumbnail': thumbnail, 
            'authors': authors,
            'rating': info.get('averageRating', 0),
            'type': 'book',
            })
    return data 


def get_home_movies():
    headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {os.getenv('BEARER_TOKEN')}"
            }
    all_results = []
    for i in range(1,3):
        url = f"https://api.themoviedb.org/3/movie/popular?page={i}"
        response = requests.get(url, headers=headers).json()
        all_results.extend(response['results'])
    data = []
    for item in all_results:
        data.append({ 
                     'id':  item.get('id', ''),
                     'title': item.get('title', ''),
                     'thumbnail': f"https://image.tmdb.org/t/p/original/{item['poster_path']}" if item['poster_path'] else "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
                     'rating': item.get('vote_average', 0) / 2,
                     'type': 'movie',
                     })
    return data  



def get_books(term):   
    query = '+'.join(term.split())
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=40"
    response = requests.get(url).json()
    data = []
    for item in response['items']:
        info = item['volumeInfo']
        thumbnail = info.get("imageLinks", {}).get("thumbnail", "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg")
        authors = info.get("authors", [])

        data.append({
            'id':  item.get('id', ''),
            'title': info.get('title', ''),
            'thumbnail': thumbnail, 
            'authors': authors,
            'rating': info.get('averageRating', 0),
            'type': 'book',
            })
    return data


def get_movies(term):
    query = '+'.join(term.split())
    headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {os.getenv('BEARER_TOKEN')}"
            }
    all_results = []
    for i in range(1,3):
        url = f"https://api.themoviedb.org/3/search/movie?query={query}&include_adult=false&language=en-US&page={i}"
        response = requests.get(url, headers=headers).json()
        all_results.extend(response['results'])
    data = []
    for item in all_results:
        data.append({ 
                     'id':  item.get('id', ''),
                     'title': item.get('title', ''),
                     'thumbnail': f"https://image.tmdb.org/t/p/original/{item['poster_path']}" if item['poster_path'] else "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
                     'rating': item.get('vote_average', 0) / 2,
                     'type': 'movie',
                     })
    return data  


class MovieDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id = request.GET.get("id")
        url = f"https://api.themoviedb.org/3/movie/{id}?language=en-US"
        headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {os.getenv('BEARER_TOKEN')}"
                }

        response = requests.get(url, headers=headers).json()

        items = getItemById(id)
        collections = [item.collection for item in items or []]

        data = {
                'id':  response.get('id', ''),
                'title': response.get('title', ''),
                'description': response.get('overview', ''),
                'categories': [genre["name"] for genre in response["genres"]],
                'thumbnail': f"https://image.tmdb.org/t/p/original/{response['poster_path']}" if response['poster_path'] else "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
                'rating': response.get('vote_average', 0) / 2,
                'runtime': response.get('runtime', ''),
                'collections': collections,
                'type': 'movie'
                }

        return Response(data)


class BookDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id = request.GET.get("id")
        url = f"https://www.googleapis.com/books/v1/volumes/{id}"
        response = requests.get(url).json()
        info = response['volumeInfo']

        items = getItemById(id)
        collections = [item.collection for item in items or []]

        decription = info.get("decription", "")
        decription = decription.replace('<br>', '').replace('<p>', '').replace('</p>', '')

        data = {
                'id': id,
                'title': info.get('title', ''),
                'authors': info.get('authors', []),
                'description': decription, 
                'categories': info.get("categories", []),
                'thumbnail': info.get("imageLinks", {}).get("medium", "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"),
                'rating': response.get('averageRating', 0) / 2,
                'pageCount': info.get('pageCount', 0),
                'type': 'book',
                'collections': collections,
                }

        return Response(data) 


class CreateCollectionItem(generics.CreateAPIView):
    serializer_class = CollectionItemSerializer 
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DeleteCollectionItem(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        item_id = request.data.get("item_id")
        collection = request.data.get("collection")
        try:
            CollectionItem.objects.get(user=request.user, item_id=item_id, collection=collection).delete()
            return Response({'detail': 'Item deleted successfully'})
        except CollectionItem.DoesNotExist:
            return Response({'detail': 'Item not found'})


def getItemById(item_id):
    try:
        return CollectionItem.objects.filter(item_id=item_id)
    except CollectionItem.DoesNotExist:
        return None

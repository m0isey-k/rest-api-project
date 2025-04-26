from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests


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
        res = get_books(term)

        return Response(res)
    

def get_books(term):   
    query = '+'.join(term.split())
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=40"
    response = requests.get(url).json()
    data = []
    for item in response['items']:
        info = item['volumeInfo']
        thumbnail = info.get("imageLinks", {}).get("thumbnail", "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg")
        authors = info.get("authors", "Unkown")

        data.append({
            'id':  item['id'],
            'title': info['title'],
            'thumbnail': thumbnail, 
            'authors': authors,
        })

    return data


class BookDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id = request.GET.get("id")
        url = f"https://www.googleapis.com/books/v1/volumes/{id}"
        response = requests.get(url).json()
        info = response['volumeInfo']

        thumbnail = info.get("imageLinks", {}).get("small", "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg")

        decription = info['description']
        decription = decription.replace('<br>', '').replace('<p>', '').replace('</p>', '')

        data = {
                'id': id,
                'title': info['title'],
                'authors': info['authors'],
                'description': decription, 
                'categories': info['categories'],
                'thumbnail': thumbnail,
                'pageCount': info['pageCount'],
                'publishedDate': info['publishedDate'],
        }

        return Response(data) 


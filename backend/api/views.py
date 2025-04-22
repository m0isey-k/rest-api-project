from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        response.set_cookie(
            key="access_token",
            value=access_token,
            path="/",
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=True,
            httponly=True,
            samesite="Lax",
        )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            res = Response()
            res.data = {'success':True}
            res.delete_cookie('access_token')

            return res
        except Exception as e:
            print(e)
            return Response({'success':False})



class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'is_authenticated': True})

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CollectionItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CollectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionItem
        exclude = ['user']


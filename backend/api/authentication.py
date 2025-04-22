from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')
        
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except AuthenticationFailed:
                pass

        if refresh_token:
            try:
                access_token = str(RefreshToken(refresh_token).access_token)
                validated_token = self.get_validated_token(access_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except (AuthenticationFailed, TokenError):
                pass
        return None

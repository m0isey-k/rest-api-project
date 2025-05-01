from django.contrib import admin
from django.urls import path, include, re_path
from api.views import BookDetailsView, CollectionView, CreateUserView, CustomTokenObtainPairView, DeleteCollectionItem, LogoutView, IsAuthenticatedView, MovieDetailsView, HomeView, SearchView, CreateCollectionItem
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Kolekcja API",
      default_version='v1',
      description="API do zarządzania kolekcją książek, filmów i gier",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="kontakt@twojadomena.pl"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/logout/", LogoutView.as_view(), name="logout"),
    path("api/user/status/", IsAuthenticatedView.as_view(), name="is_authenticated"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/home/", HomeView.as_view(), name="home"),
    path("api/search/", SearchView.as_view(), name="search"),
    path("api/book-details/", BookDetailsView.as_view(), name="book_details"),
    path("api/movie-details/", MovieDetailsView.as_view(), name="movie_details"),
    path("api/create-item/", CreateCollectionItem.as_view(), name="create_item"),
    path("api/delete-item/", DeleteCollectionItem.as_view(), name="delete_item"),
    path("api/get-collection/", CollectionView.as_view(), name="get_collection"),
    path("api-auth/", include("rest_framework.urls")),
]

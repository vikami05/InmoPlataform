from django.urls import path
from . import views
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import crear_consulta

urlpatterns = [
    # 🏡 Endpoints de propiedades
    path('properties/', views.properties_list, name='properties-list'),
    path('properties/<int:pk>/', views.property_detail, name='property-detail'),

    # 👤 Registro y login
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),

    # 💖 Favoritos
    path('favorites/', views.list_favorites, name='list_favorites'),
    path('favorites/<int:property_id>/toggle/', views.toggle_favorite, name='toggle_favorite'),

    # 🔑 JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✉️ Consultas (sin repetir el prefijo "api/")
    path('consultas/', crear_consulta, name='crear_consulta'),
]

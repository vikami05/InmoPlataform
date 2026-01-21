from django.urls import path
from . import views
from .views import RegisterView, crear_consulta

urlpatterns = [
    # 🏡 Propiedades
    path('properties/', views.properties_list, name='properties-list'),
    path('properties/<int:pk>/', views.property_detail, name='property-detail'),

    # 👤 Autenticación
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),

    # 💖 Favoritos
    path('add_favorite/<int:property_id>/', views.add_favorite, name='add_favorite'),  # ✅ Igual al test
    path('favorites/', views.list_favorites, name='list_favorites'),  # GET lista

    # ✉️ Consultas
    path('consultas/', crear_consulta, name='crear_consulta'),

    # 🔹 Nueva ruta del mini chat
    path('chat/', views.chat_with_agent, name='chat_with_agent'),
]

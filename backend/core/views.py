from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import unicodedata
import random

# 🔹 Importaciones nuevas para chatbot
import openai
from django.conf import settings

# 🔹 Configurar la clave de OpenAI
openai.api_key = settings.OPENAI_API_KEY

# 🔹 Datos simulados
AGENTES = ["María López", "Juan Pérez", "Lucía Fernández"]
PROPIEDADES = [
    "Casa moderna en Palermo",
    "Casa Rústica",
    "Casa con patio en Caballito",
    "Loft moderno en Belgrano",
    "Casa estilo clásico en San Isidro",
]
SALUDOS = ["hola", "buenos días", "buenas tardes", "buenas noches", "hi", "hello"]

@api_view(["POST"])
def chat_with_agent(request):
    user_msg = request.data.get("message", "").lower()
    response_text = "Lo siento, no entendí tu consulta."

    # 🔹 Saludos
    if any(saludo in user_msg for saludo in SALUDOS):
        response_text = "¡Hola! Soy el asistente de InmoPlataform. ¿En qué puedo ayudarte?"
        return Response({"reply": response_text})

    # 🔹 Mención de un agente
    for agente in AGENTES:
        if agente.lower() in user_msg:
            response_text = f"{agente} está disponible para responderte."
            return Response({"reply": response_text})

    # 🔹 Mención de una propiedad específica
    for prop in PROPIEDADES:
        if prop.lower() in user_msg:
            # Asignamos un agente al azar
            agente_asignado = random.choice(AGENTES)
            response_text = (
                f"Esta propiedad ({prop}) es una excelente opción!\n"
                f"Te recomiendo contactar a {agente_asignado} para más info."
            )
            return Response({"reply": response_text})

    # 🔹 Mensaje genérico que habla de propiedad
    if "propiedad" in user_msg:
        agente_asignado = random.choice(AGENTES)
        response_text = f"Perfecto! Te recomiendo contactar a {agente_asignado} para ayudarte con las propiedades."
        return Response({"reply": response_text})

    # 🔹 Respuesta por defecto
    return Response({"reply": response_text})


SALUDOS = ["hola", "buenos días", "buenas tardes", "buenas noches", "hi", "hello"]

@api_view(["POST"])
def chat_with_agent(request):
    user_msg = request.data.get("message", "").lower()
    response_text = "Lo siento, no entendí tu consulta."

    # 🔹 Saludos
    for saludo in SALUDOS:
        if saludo in user_msg:
            response_text = "¡Hola! Soy el asistente de InmoPlataform. ¿En qué puedo ayudarte?"
            break

    # 🔹 Revisar agentes
    if response_text.startswith("Lo siento"):
        for agente in AGENTES:
            if agente.lower() in user_msg:
                response_text = f"{agente} está disponible para responderte."
                break

    # 🔹 Revisar propiedades
    if response_text.startswith("Lo siento"):
        for prop in PROPIEDADES:
            if prop.lower() in user_msg:
                response_text = f"Esta propiedad ({prop}) es una excelente opción! Contáctanos para más info."
                break

    return Response({"reply": response_text})





from .models import Property, Favorite
from .serializers import (
    PropertySerializer,
    RegisterSerializer,
    FavoriteSerializer,
    ConsultaSerializer,
)

# -----------------------------------
# Propiedades
# -----------------------------------
@api_view(['GET'])
def properties_list(request):
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def property_detail(request, pk):
    property_obj = get_object_or_404(Property, pk=pk)
    serializer = PropertySerializer(property_obj)
    return Response(serializer.data)


# -----------------------------------
# Registro de usuario
# -----------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "success": True,
            "access_token": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)


# -----------------------------------
# Login
# -----------------------------------
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = User.objects.filter(email=email).first()
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({
            "success": True,
            "access_token": str(refresh.access_token)
        })
    return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------
# Logout
# -----------------------------------
@api_view(['POST'])
def logout_view(request):
    return Response({"success": True, "message": "Sesión cerrada correctamente"})


# -----------------------------------
# Perfil del usuario
# -----------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    try:
        profile = user.userprofile
    except Exception:
        from .models import UserProfile
        profile = UserProfile.objects.create(user=user, nombre=user.username, apellido="")

    profile_data = {
        "photo": getattr(profile, "photo", None),
        "phone": getattr(profile, "phone", None),
        "address": getattr(profile, "address", None),
    }

    return Response({
        "id": user.id,
        "name": f"{profile.nombre} {profile.apellido}",
        "email": user.email,
        "profile": profile_data
    })


# -----------------------------------
# Favoritos
# -----------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request, property_id):
    """Alterna una propiedad en favoritos (agrega o quita)."""
    property_obj = get_object_or_404(Property, id=property_id)
    user = request.user

    existing = Favorite.objects.filter(user=user, property=property_obj).first()
    if existing:
        existing.delete()
        return Response(
            {"action": "removed", "property_id": property_id},
            status=status.HTTP_200_OK
        )
    else:
        favorite = Favorite.objects.create(user=user, property=property_obj)
        serializer = FavoriteSerializer(favorite, context={'request': request})
        return Response(
            {"action": "added", "favorite": serializer.data},
            status=status.HTTP_201_CREATED
        )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favorites(request):
    """Lista las propiedades favoritas del usuario"""
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
    return Response(serializer.data)


# -----------------------------------
# Consultas
# -----------------------------------
@api_view(['POST'])
def crear_consulta(request):
    serializer = ConsultaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "✅ Consulta registrada correctamente", "consulta": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

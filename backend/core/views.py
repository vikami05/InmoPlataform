from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  # 👈 Import necesario
from rest_framework_simplejwt.tokens import RefreshToken

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
    """Listar todas las propiedades"""
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def property_detail(request, pk):
    """Detalle de una propiedad"""
    property_obj = get_object_or_404(Property, pk=pk)
    serializer = PropertySerializer(property_obj)
    return Response(serializer.data)


# -----------------------------------
# Registro de usuario + login automático
# -----------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generar JWT
        refresh = RefreshToken.for_user(user)

        # Respuesta JSON + cookie
        response = Response({
            "success": True,
            "access_token": str(refresh.access_token)
        }, status=201)

        # ⚙️ Cookie ajustada para Render (permite frontend-backend en distintos dominios)
        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,      # mantener False mientras probás en Render
            samesite="None"    # 👈 necesario para cross-site cookies
        )
        return response


# -----------------------------------
# Login
# -----------------------------------
@api_view(['POST'])
def login_view(request):
    """Login por email: devuelve token en JSON y cookie"""
    email = request.data.get('email')
    password = request.data.get('password')

    user = User.objects.filter(email=email).first()
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        response = JsonResponse({
            "success": True,
            "access_token": str(refresh.access_token)
        })
        # ⚙️ Cookie ajustada para Render (permite frontend-backend en distintos dominios)
        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,      # mantener False mientras probás en Render
            samesite="None"    # 👈 necesario para cross-site cookies
        )
        return response

    return JsonResponse({"error": "Credenciales inválidas"}, status=400)


# -----------------------------------
# Logout
# -----------------------------------
@api_view(['POST'])
def logout_view(request):
    """Logout: elimina cookie HttpOnly"""
    response = JsonResponse({"success": True})
    response.delete_cookie("access_token")
    return response


# -----------------------------------
# Perfil del usuario
# -----------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Devuelve info del usuario logueado con perfil"""
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
def toggle_favorite(request, property_id):
    """Agrega o quita una propiedad de los favoritos del usuario (toggle)"""
    property_obj = get_object_or_404(Property, id=property_id)
    favorite = Favorite.objects.filter(user=request.user, property=property_obj).first()

    property_data = PropertySerializer(property_obj, context={'request': request}).data

    if favorite:
        favorite.delete()
        return Response({
            "status": "removed",
            "message": "✅ Favorito eliminado.",
            "property": property_data
        }, status=status.HTTP_200_OK)
    else:
        Favorite.objects.create(user=request.user, property=property_obj)
        return Response({
            "status": "added",
            "message": "✅ Propiedad agregada a favoritos.",
            "property": property_data
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favorites(request):
    """Lista las propiedades favoritas del usuario"""
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------------
# Consultas de agentes (Contactar Agente)
# -----------------------------------
@csrf_exempt  # 👈 Este debe ir primero para evitar error CSRF
@api_view(['POST'])
def crear_consulta(request):
    """
    Guarda una nueva consulta enviada desde el formulario Contactar Agente
    """
    print("📩 Datos recibidos:", request.data)  # debug opcional
    serializer = ConsultaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("✅ Consulta guardada correctamente")  # debug opcional
        return Response(
            {"message": "✅ Consulta registrada correctamente", "consulta": serializer.data},
            status=status.HTTP_201_CREATED
        )
    print("❌ Errores del serializer:", serializer.errors)  # debug opcional
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

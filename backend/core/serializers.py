from rest_framework import serializers
from .models import Property, UserProfile, Favorite
from django.contrib.auth.models import User
import re  # para validar letras
from .models import Property, UserProfile, Favorite, Consulta


# 🏡 Serializador de propiedades
class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'


# 🧾 Serializador de registro de usuario
class RegisterSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(write_only=True)
    apellido = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'nombre', 'apellido']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        """Validar que el email no esté ya registrado."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate_nombre(self, value):
        """Validar que el nombre contenga solo letras."""
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$', value):
            raise serializers.ValidationError("El nombre solo puede contener letras.")
        return value

    def validate_apellido(self, value):
        """Validar que el apellido contenga solo letras."""
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$', value):
            raise serializers.ValidationError("El apellido solo puede contener letras.")
        return value

    def validate(self, data):
        """Verificar que las contraseñas coincidan."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        """Crea usuario y perfil relacionado."""
        nombre = validated_data.pop('nombre')
        apellido = validated_data.pop('apellido')
        validated_data.pop('confirm_password')

        # Crear usuario
        user = User.objects.create_user(**validated_data)

        # Crear perfil asociado
        UserProfile.objects.create(user=user, nombre=nombre, apellido=apellido)
        return user


# 👤 Serializador de perfil de usuario
class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def get_profile(self, obj):
        """Devuelve el perfil asociado al usuario."""
        try:
            profile = obj.userprofile
            return {
                "nombre": profile.nombre,
                "apellido": profile.apellido,
                "photo": getattr(profile, "photo", None),
                "phone": getattr(profile, "phone", None),
                "address": getattr(profile, "address", None),
            }
        except UserProfile.DoesNotExist:
            return None


# ⭐ Serializador de favoritos
class FavoriteSerializer(serializers.ModelSerializer):
    # Importante: pasamos el PropertySerializer con el contexto del request
    property = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = ['id', 'property']

    def get_property(self, obj):
        # Pasamos el request al PropertySerializer para que image_url funcione
        request = self.context.get('request')
        return PropertySerializer(obj.property, context={'request': request}).data
    

 # 💬 Serializador de consultas (formulario "Contactar agente")
class ConsultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consulta
        fields = [
            'id',
            'nombre',
            'email',
            'mensaje',
            'propiedad',
            'agente',
            'fecha_envio',
            'estado'
        ]
        read_only_fields = ['fecha_envio', 'estado']
  
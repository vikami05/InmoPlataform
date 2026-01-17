from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings


# 🔹 Propiedades
class Property(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    location = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    rooms = models.IntegerField()
    image = models.CharField(max_length=200)  # usamos ruta o nombre de imagen

    def __str__(self):
        return self.title


# 🔹 Perfil de usuario (datos extendidos)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


# 🔹 Favoritos
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="favorited_by")

    class Meta:
        unique_together = ('user', 'property')  # evita duplicados

    def __str__(self):
        return f"{self.user.username} ❤️ {self.property.title}"


# 🔹 Consultas (formulario "Contactar agente")
class Consulta(models.Model):
    # Datos del visitante/interesado
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    mensaje = models.TextField()

    # Relaciones
    propiedad = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='consultas')
    agente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='consultas_recibidas')

    # Control interno
    fecha_envio = models.DateTimeField(default=timezone.now)
    estado = models.CharField(
        max_length=20,
        choices=[('pendiente', 'Pendiente'), ('respondido', 'Respondido')],
        default='pendiente'
    )

    def __str__(self):
        return f"Consulta de {self.nombre} sobre {self.propiedad.title}"

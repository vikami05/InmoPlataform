# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings                # 👈 Importa la configuración
from django.conf.urls.static import static      # 👈 Importa la función para servir archivos media

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # 👈 Tu API principal
]

# 👇 Esto sirve las imágenes (solo en modo DEBUG)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

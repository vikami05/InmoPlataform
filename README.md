🏠 InmoPlataform – Plataforma Inmobiliaria con ChatBot

Desarrollé una web de gestión inmobiliaria donde los visitantes pueden explorar propiedades y los clientes registrados pueden guardar favoritas, contactar agentes y gestionar su perfil.

🚀 Funcionalidades Principales
👥 Roles

🧑‍💼 Visitante (sin cuenta)

Navegar la página principal y ver propiedades.

Filtrar por ubicación, precio o tipo.

Ver detalles completos de cada propiedad.

Contactar a agentes mediante un formulario.

Registrarse e iniciar sesión.

👩‍💻 Cliente registrado

Acceso a todas las funciones anteriores.

Guardar propiedades como favoritas.

Ver y gestionar su lista de favoritos.

Gestionar información básica de su perfil.


🧩 Arquitectura y Tecnologías
🔹 Backend

Django + Django REST Framework (DRF)

Endpoints REST para propiedades, favoritos y consultas.

Autenticación JWT con rest_framework_simplejwt.

Base de datos SQLite (modo desarrollo).

Tablas: Usuarios, Propiedades, Favoritos, Consultas.

ChatBot Integrado (OpenAI API)

Endpoint REST /api/chat/ para recibir y responder mensajes.

Responde sobre agentes y propiedades registrados.

Ejemplo de integración simple con IA.

🔹 Frontend

React + Material UI

Aplicación SPA (Single Page Application) con rutas.

Interfaz moderna y fácil de usar.

Mini chat flotante visible en toda la aplicación.

Manejo de estado con Hooks (useState, useEffect).

from pathlib import Path
from datetime import timedelta

# ------------------------------
# BASE
# ------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-@l5ndi*exm4_4zy)1&)3n!z=2ceu+(px+5thk(yazzm*m-iy%%'
DEBUG = False  # 🚨 producción: siempre False
ALLOWED_HOSTS = ["inmoplataform-backend.onrender.com"]

# ------------------------------
# APPS
# ------------------------------
INSTALLED_APPS = [
    # 🔹 Django default
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 🔹 externas
    "corsheaders",
    'rest_framework',
    'rest_framework.authtoken',

    # 🔹 app local
    'core',
]

# ------------------------------
# MIDDLEWARE
# ------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # siempre arriba de CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ------------------------------
# DATABASE
# ------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',  # 🚨 para producción real: usar PostgreSQL
    }
}

# ------------------------------
# VALIDACIÓN CONTRASEÑAS
# ------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# ------------------------------
# INTERNACIONALIZACIÓN
# ------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------------
# STATIC FILES (producción)
# ------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'  # collectstatic lo llenará aquí
# Opcional: para servir media files si los usas
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ------------------------------
# CORS
# ------------------------------
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://inmoplataform-frontend.onrender.com",  # solo HTTPS en producción
]
CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "accept",
    "origin",
    "x-csrftoken",
    "x-requested-with",
]
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

# ------------------------------
# REST FRAMEWORK + JWT
# ------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'core.authentication.JWTAuthenticationFromCookie',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # ⚠️ para pruebas login/registro
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ------------------------------
# CSRF
# ------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://inmoplataform-frontend.onrender.com",
]

# ------------------------------
# OTROS AJUSTES DE SEGURIDAD
# ------------------------------
SESSION_COOKIE_SECURE = True   # cookies solo por HTTPS
CSRF_COOKIE_SECURE = True      # CSRF solo por HTTPS
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = True      # redirige HTTP → HTTPS
X_FRAME_OPTIONS = "DENY"

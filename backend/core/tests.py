from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Property, Favorite

class BackendTests(TestCase):

    def setUp(self):
        # Cliente de pruebas
        self.client = Client()

        # Datos de usuario de prueba
        self.user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "1234Test",
            "nombre": "Test",
            "apellido": "User"
        }

        # Crear algunas propiedades de prueba
        self.prop1 = Property.objects.create(
            title="Casa 1",
            location="Ciudad 1",
            type="Casa",
            rooms=3,
            price=100000,
        )
        self.prop2 = Property.objects.create(
            title="Casa 2",
            location="Ciudad 2",
            type="Departamento",
            rooms=2,
            price=80000,
        )

    # -------------------------
    # Registro
    # -------------------------
    def test_registration(self):
        """Registro de usuario"""
        response = self.client.post("/api/register/", {
            "username": self.user_data["username"],
            "email": self.user_data["email"],
            "password": self.user_data["password"],
            "confirm_password": self.user_data["password"],
            "nombre": self.user_data["nombre"],
            "apellido": self.user_data["apellido"]
        }, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email=self.user_data["email"]).exists())
        print("EFE✅ Registro OK")

    # -------------------------
    # Login y token
    # -------------------------
    def test_login_cookie(self):
        """Login y verificar token en JSON"""
        # Crear usuario de prueba
        User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )

        response = self.client.post("/api/login/", {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, content_type="application/json")

        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        print("EFE✅ Login OK")

    # -------------------------
    # Endpoint /api/me/
    # -------------------------
    def test_me_endpoint(self):
        """Verificar endpoint /api/me/"""
        # Crear usuario y login
        User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )

        login_response = self.client.post("/api/login/", {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, content_type="application/json")

        token = login_response.json().get("access_token")
        self.assertIsNotNone(token)

        # Usar token en headers
        response = self.client.get("/api/me/", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], self.user_data["email"])
        print("EFE✅ /api/me/ OK")

    # -------------------------
    # Favoritos
    # -------------------------
    def test_add_and_list_favorites(self):
        """Agregar y listar favoritos"""
        # Crear usuario y login
        User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )

        login_response = self.client.post("/api/login/", {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, content_type="application/json")

        token = login_response.json().get("access_token")
        self.assertIsNotNone(token)

        # Agregar propiedades a favoritos
        response_add1 = self.client.post(f"/api/add_favorite/{self.prop1.id}/",
                                         HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(response_add1.status_code, 201)

        response_add2 = self.client.post(f"/api/add_favorite/{self.prop2.id}/",
                                         HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(response_add2.status_code, 201)

        # Listar favoritos
        response_list = self.client.get("/api/favorites/", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(response_list.status_code, 200)
        self.assertEqual(len(response_list.json()), 2)
        print("EFE✅ Favoritos OK")

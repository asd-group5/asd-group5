from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Address
from .serializers import AddressSerializer


class AddressViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.client.force_authenticate(user=self.user)

        self.address1 = Address.objects.create(
            user=self.user,
            name="Home",
            street_address="15 Broadway",
            city="Ultimo",
            state="NSW",
            postal_code="2007",
            country="Australia",
            is_default=True,
        )
        self.address2 = Address.objects.create(
            user=self.user,
            name="Work",
            street_address="1 Work Street",
            city="Sydney",
            state="NSW",
            postal_code="2000",
            country="Australia",
        )

    def test_address_list_view(self):
        url = reverse("address-list")
        response = self.client.get(url)
        addresses = Address.objects.filter(user=self.user)
        serializer = AddressSerializer(addresses, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_address_create_view(self):
        url = reverse("address-list")
        data = {
            "name": "New Address",
            "street_address": "15 Broadway",
            "city": "Ultimo",
            "state": "NSW",
            "postal_code": "2007",
            "country": "Australia",
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Address.objects.count(), 3)
        self.assertEqual(Address.objects.latest("id").street_address, "15 Broadway")

    def test_address_detail_view(self):
        url = reverse("address-detail", kwargs={"pk": self.address1.pk})
        response = self.client.get(url)
        serializer = AddressSerializer(self.address1)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_address_update_view(self):
        url = reverse("address-detail", kwargs={"pk": self.address1.pk})
        data = {
            "name": "Updated Home",
            "street_address": "15 Broadway",
            "city": "Ultimo",
            "state": "NSW",
            "postal_code": "2007",
            "country": "Australia",
        }
        response = self.client.put(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.address1.refresh_from_db()
        self.assertEqual(self.address1.name, "Updated Home")

    def test_address_delete_view(self):
        url = reverse("address-detail", kwargs={"pk": self.address2.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Address.objects.count(), 1)

    def test_address_set_default_view(self):
        url = reverse("address-set-default", kwargs={"pk": self.address2.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.address1.refresh_from_db()
        self.address2.refresh_from_db()
        self.assertFalse(self.address1.is_default)
        self.assertTrue(self.address2.is_default)

    def test_address_validate_view(self):
        url = reverse("address-validate")
        valid_data = {
            "name": "Valid Address",
            "street_address": "15 Broadway",
            "city": "Ultimo",
            "state": "NSW",
            "postal_code": "2007",
            "country": "Australia",
        }
        response = self.client.post(url, valid_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Address is valid")

        invalid_data = {
            "name": "",  # Empty name should be invalid
            "street_address": "15 Broadway",
            "city": "Ultimo",
            "state": "NSW",
            "postal_code": "2007",
            "country": "Australia",
        }
        response = self.client.post(url, invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_address_search_view(self):
        url = reverse("address-search") + "?q=Broadway"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["street_address"], "15 Broadway")

        url = reverse("address-search") + "?q=Nonexistent"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        url = reverse("address-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

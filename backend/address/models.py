from django.conf import settings
from django.db import models


class Address(models.Model):
    ADDRESS_TYPE_CHOICES = [("HOME", "Home"), ("OFFICE", "Office"), ("OTHER", "Other")]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses"
    )
    name = models.CharField(max_length=100)  # recipient name
    phone_number = models.CharField(max_length=20)  # recipient contact number

    # address information
    street_address = models.CharField(max_length=255)  # street address
    detail_address = models.CharField(
        max_length=100
    )  # detail address (unit/apt number)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="South Korea")

    # address management
    address_type = models.CharField(
        max_length=10, choices=ADDRESS_TYPE_CHOICES, default="HOME"
    )
    is_default = models.BooleanField(default=False)

    # delivery related
    delivery_instructions = models.TextField(
        blank=True, null=True, help_text="Enter delivery instructions"
    )

    # timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_default", "-updated_at"]
        verbose_name = "Delivery Address"
        verbose_name_plural = "Delivery Addresses"

    def __str__(self):
        return f"{self.name}'s address ({self.get_address_type_display()})"

    def save(self, *args, **kwargs):
        # If new default address is set, unset other default addresses
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(
                is_default=False
            )
        super().save(*args, **kwargs)

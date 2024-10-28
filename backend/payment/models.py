from datetime import datetime

from address.models import Address
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class PaymentMethod(models.Model):
    CARD_TYPE_CHOICES = [
        ("CREDIT", "Credit Card"),
        ("DEBIT", "Debit Card"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_methods",
    )
    name = models.CharField(max_length=100)
    card_type = models.CharField(
        max_length=10, choices=CARD_TYPE_CHOICES, default="CREDIT"
    )
    card_number = models.CharField(max_length=16)
    expiry_date = models.CharField(max_length=5)  # MM/YY format
    cvv = models.CharField(max_length=4)
    card_holder_name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Validate expiry date
        try:
            expiry = datetime.strptime(self.expiry_date, "%m/%y")
        except ValueError:
            raise ValidationError(_("Invalid expiry date format. Use MM/YY format."))

        if expiry < datetime.now():
            raise ValidationError(_("The card expiry date cannot be in the past."))

        # Basic card number validation
        if not self.card_number.isdigit():
            raise ValidationError(_("Card number must contain only digits."))

        if len(self.card_number) not in [15, 16]:
            raise ValidationError(_("Card number must be 15 or 16 digits long."))

    def save(self, *args, **kwargs):
        # If new default payment method is set, unset other default methods
        if self.is_default:
            PaymentMethod.objects.filter(user=self.user, is_default=True).update(
                is_default=False
            )
        super().save(*args, **kwargs)

    def __str__(self):
        masked_number = "*" * 12 + self.card_number[-4:]
        return f"{self.name} - {masked_number}"

    class Meta:
        ordering = ["-is_default", "-updated_at"]


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
        ("CANCELLED", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments"
    )
    order_id = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.ForeignKey(
        PaymentMethod, on_delete=models.SET_NULL, null=True
    )
    billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default="PENDING"
    )
    transaction_id = models.CharField(
        max_length=100, unique=True, null=True, blank=True
    )
    failure_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.order_id} - {self.get_status_display()}"

    class Meta:
        ordering = ["-created_at"]

    def process_payment(self):
        """
        Simulate payment processing for the assignment
        """
        import random
        from time import sleep

        self.status = "PROCESSING"
        self.save()

        # Simulate processing time
        sleep(1)

        # Simulate success/failure (90% success rate)
        if random.random() < 0.9:
            self.status = "COMPLETED"
            self.transaction_id = f"TRANS_{datetime.now().strftime('%Y%m%d')}_{random.randint(1000, 9999)}"
        else:
            self.status = "FAILED"
            self.failure_reason = "Insufficient funds"

        self.save()
        return self.status == "COMPLETED"

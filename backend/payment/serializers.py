from address.models import Address
from rest_framework import serializers

from .models import Payment, PaymentMethod


class PaymentMethodSerializer(serializers.ModelSerializer):
    card_number_masked = serializers.SerializerMethodField()

    class Meta:
        model = PaymentMethod
        fields = [
            "id",
            "name",
            "card_type",
            "card_number",
            "card_number_masked",
            "expiry_date",
            "cvv",
            "card_holder_name",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "card_number": {"write_only": True},
            "cvv": {"write_only": True},
        }

    def get_card_number_masked(self, obj):
        return "*" * 12 + obj.card_number[-4:]

    def create(self, validated_data):
        # If this is the user's first payment method, make it default
        user = self.context["request"].user
        if not user.payment_methods.exists():
            validated_data["is_default"] = True
        return super().create(validated_data)


class PaymentMethodListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing payment methods"""

    card_number_masked = serializers.SerializerMethodField()

    class Meta:
        model = PaymentMethod
        fields = [
            "id",
            "name",
            "card_type",
            "card_number_masked",
            "expiry_date",
            "is_default",
        ]

    def get_card_number_masked(self, obj):
        return "*" * 12 + obj.card_number[-4:]


class PaymentSerializer(serializers.ModelSerializer):
    payment_method = PaymentMethodListSerializer(read_only=True)
    payment_method_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=PaymentMethod.objects.all(), source="payment_method"
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    billing_address = serializers.PrimaryKeyRelatedField(
        required=False,  # billing_address를 optional로 설정
        queryset=Address.objects.all(),
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "order_id",
            "amount",
            "payment_method",
            "payment_method_id",
            "billing_address",
            "status",
            "status_display",
            "transaction_id",
            "failure_reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_id",
            "status",
            "transaction_id",
            "failure_reason",
            "created_at",
            "updated_at",
        ]

    def validate_payment_method_id(self, value):
        """Ensure the payment method belongs to the user"""
        if value.user != self.context["request"].user:
            raise serializers.ValidationError("Invalid payment method selected.")
        return value

    def validate_billing_address(self, value):
        """Ensure the billing address belongs to the user"""
        if value and value.user != self.context["request"].user:
            raise serializers.ValidationError("Invalid billing address selected.")
        return value

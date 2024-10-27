from rest_framework import serializers

from .models import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "name",
            "phone_number",
            "street_address",
            "detail_address",
            "city",
            "state",
            "postal_code",
            "country",
            "address_type",
            "is_default",
            "delivery_instructions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        # If this is the user's first address, make it default
        user = self.context["request"].user
        if not user.addresses.exists():
            validated_data["is_default"] = True
        return super().create(validated_data)

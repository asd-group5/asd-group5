from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Address
from .serializers import AddressSerializer


class AddressListView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # If this is the first address, set it as default
        if not Address.objects.filter(user=self.request.user).exists():
            serializer.save(user=self.request.user, is_default=True)
        else:
            serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Handle is_default flag during update
        if serializer.validated_data.get("is_default", False):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save()


class AddressSetDefaultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            address = Address.objects.get(pk=pk, user=request.user)
            # Using update() to avoid triggering multiple save() calls
            Address.objects.filter(user=request.user).update(is_default=False)
            address.is_default = True
            address.save()
            return Response({"message": "Default address set successfully"})
        except Address.DoesNotExist:
            return Response(
                {"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND
            )


class AddressValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            # Add additional validation if needed for phone number format
            phone_number = serializer.validated_data.get("phone_number", "")
            if not phone_number.isdigit() or len(phone_number) < 10:
                return Response(
                    {"phone_number": ["Invalid phone number format"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response({"message": "Address is valid"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressSearchView(generics.ListAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Address.objects.filter(user=self.request.user)

        # Search by multiple fields
        query = self.request.query_params.get("q", "")
        if query:
            queryset = queryset.filter(
                models.Q(name__icontains=query)
                | models.Q(street_address__icontains=query)
                | models.Q(detail_address__icontains=query)
                | models.Q(city__icontains=query)
            )

        # Filter by address type
        address_type = self.request.query_params.get("type", "")
        if address_type:
            queryset = queryset.filter(address_type=address_type.upper())

        return queryset

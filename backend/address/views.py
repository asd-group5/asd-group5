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
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressSetDefaultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            address = Address.objects.get(pk=pk, user=request.user)
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
            return Response({"message": "Address is valid"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressSearchView(generics.ListAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("q", "")
        return Address.objects.filter(user=self.request.user, name__icontains=query)

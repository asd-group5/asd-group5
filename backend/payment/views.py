import uuid
from datetime import datetime

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Payment, PaymentMethod
from .serializers import (
    PaymentMethodListSerializer,
    PaymentMethodSerializer,
    PaymentSerializer,
)


class PaymentMethodListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = PaymentMethodSerializer

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)


class PaymentMethodAddView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            print("Request data:", request.data)  # 요청 데이터 출력
            data = request.data
            payment_method = PaymentMethod.objects.create(
                user=request.user,
                name=data.get("name"),
                card_type=data.get("card_type", "CREDIT"),
                card_number=data.get("cardNumber"),
                expiry_date=data.get("expiryDate"),
                cvv=data.get("cvv"),
                is_default=data.get("is_default", False),
            )
            return Response(
                {
                    "id": payment_method.id,
                    "message": "Payment method added successfully",
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            print("Error adding payment method:", str(e))  # 에러 메시지 출력
            return Response(
                {"error": f"Failed to add payment method: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)


class PaymentMethodSetDefaultView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk):
        try:
            payment_method = PaymentMethod.objects.get(pk=pk, user=request.user)
            PaymentMethod.objects.filter(user=request.user).update(is_default=False)
            payment_method.is_default = True
            payment_method.save()
            return Response({"message": "Default payment method set successfully"})
        except PaymentMethod.DoesNotExist:
            return Response(
                {"error": "Payment method not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PaymentProcessView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            # request context 추가
            serializer = PaymentSerializer(
                data=request.data, context={"request": request}
            )

            if serializer.is_valid():
                # Generate unique order ID
                order_id = (
                    f"ORD_{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}"
                )

                # Create payment
                payment = serializer.save(
                    user=request.user, order_id=order_id, status="PENDING"
                )

                # Process the payment
                success = payment.process_payment()

                if success:
                    return Response(
                        {
                            "id": payment.id,
                            "order_id": payment.order_id,
                            "status": payment.status,
                            "transaction_id": payment.transaction_id,
                            "message": "Payment processed successfully",
                        }
                    )
                else:
                    return Response(
                        {
                            "error": payment.failure_reason
                            or "Payment processing failed"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Error processing payment:", str(e))
            return Response(
                {"error": f"Payment processing failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = Payment.objects.filter(user=self.request.user)

        # Filter by status
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status__iexact=status_filter)

        # Filter by date range
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        # Filter by amount range
        min_amount = self.request.query_params.get("min_amount")
        max_amount = self.request.query_params.get("max_amount")
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)

        return queryset.order_by("-created_at")


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentValidateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "Payment data is valid"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

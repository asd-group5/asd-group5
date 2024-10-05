import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Payment, PaymentMethod


class PaymentMethodListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        print(request.user)
        payment_methods = PaymentMethod.objects.filter(user=request.user).values(
            "id", "name", "card_number", "expiry_date", "is_default"
        )
        return Response(list(payment_methods))


class PaymentMethodAddView(APIView):
    def post(self, request):
        print(request.user)
        data = json.loads(request.body)
        payment_method = PaymentMethod.objects.create(
            user=request.user,
            name=data["name"],
            card_number=data["cardNumber"],
            expiry_date=data["expiryDate"],
            cvv=data["cvv"],
            is_default=data.get("is_default", False),
        )
        return JsonResponse(
            {"id": payment_method.id, "message": "Payment method added successfully"}
        )


class PaymentProcessView(APIView):
    def post(self, request):
        print(request.user)
        data = json.loads(request.body)
        payment_method = get_object_or_404(
            PaymentMethod, id=data["paymentMethodId"], user=request.user
        )
        payment = Payment.objects.create(
            user=request.user,
            amount=data["amount"],
            payment_method=payment_method,
            status="completed",
        )
        return JsonResponse(
            {
                "id": payment.id,
                "status": payment.status,
                "message": "Payment processed successfully",
            }
        )


class PaymentHistoryView(APIView):
    def get(self, request):
        payments = Payment.objects.filter(user=request.user).values(
            "id", "amount", "status", "created_at"
        )
        return JsonResponse(list(payments), safe=False)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ProcessPaymentView(APIView):
    def post(self, request):
        # 결제 처리 로직
        return Response({'message': 'Payment processed successfully'}, status=status.HTTP_200_OK)


class SavePaymentMethodView(APIView):
    def post(self, request):
        # 결제 방법 저장 로직
        return Response({'message': 'Payment method saved successfully'}, status=status.HTTP_201_CREATED)

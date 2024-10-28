from .models import Order, OrderItem
from custom.models import MenuItem

from django.core import serializers

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class OrderProcess(APIView):
    def post(self, request):
        req_data = request.data
        data = Order.objects.create(
            user=request.user,
            total_price=req_data.get("total"),
            delivery_method=req_data.get("delivery"),
            delivery_date=req_data.get("date"),
            instructions=req_data.get("instruction")
        )

        return Response(data.id, status=status.HTTP_200_OK)

class PopulateOrder(APIView):
    def post(self, request, orderID):
        params = request.GET.getlist('menuID')

        order = Order.objects.get(pk=orderID)

        aList = [OrderItem(order=order, menu_item=MenuItem.objects.get(pk=x)) for x in params]
        objs = OrderItem.objects.bulk_create(aList)
        
        return Response(orderID, status=status.HTTP_200_OK)

class ViewOrders(APIView):
    def get(self, request):
        user = request.user
        orders_list = Order.objects.filter(user=user).all()
        orders_list_json = serializers.serialize('json', orders_list)
        return Response(orders_list_json, status=status.HTTP_200_OK)



<<<<<<< Updated upstream
from django.shortcuts import render

# Create your views here.
=======
from django.views import View
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.http import JsonResponse


class PaymentProcessView(View):
    def post(self, request, *args, **kwargs):
        pass


class PaymentMethodListView(ListView):
    def get(self, request, *args, **kwargs):
        pass


class PaymentMethodAddView(CreateView):
    def post(self, request, *args, **kwargs):
        pass


class PaymentMethodEditView(UpdateView):
    def put(self, request, pk, *args, **kwargs):
        pass


class PaymentMethodDeleteView(DeleteView):
    def delete(self, request, pk, *args, **kwargs):
        pass


class PaymentHistoryView(ListView):
    def get(self, request, *args, **kwargs):
        pass


class PaymentDetailsView(View):
    def get(self, request, payment_id, *args, **kwargs):
        pass


class JSONResponseMixin:
    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(self.get_data(context), **response_kwargs)

    def get_data(self, context):
        return context


class PaymentMethodListAPIView(JSONResponseMixin, PaymentMethodListView):
    def render_to_response(self, context):
        return self.render_to_json_response(context)
>>>>>>> Stashed changes

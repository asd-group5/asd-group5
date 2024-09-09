from django.views import View
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.http import JsonResponse


class AddressListView(ListView):
    def get(self, request, *args, **kwargs):
        pass


class AddressAddView(CreateView):
    def post(self, request, *args, **kwargs):
        pass


class AddressUpdateView(UpdateView):
    def put(self, request, pk, *args, **kwargs):
        pass


class AddressDeleteView(DeleteView):
    def delete(self, request, pk, *args, **kwargs):
        pass


class AddressSetDefaultView(View):
    def post(self, request, pk, *args, **kwargs):
        pass


class AddressValidateView(View):
    def post(self, request, *args, **kwargs):
        pass


class AddressSearchView(View):
    def get(self, request, *args, **kwargs):
        pass


class JSONResponseMixin:
    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(self.get_data(context), **response_kwargs)

    def get_data(self, context):
        return context


class AddressListAPIView(JSONResponseMixin, AddressListView):
    def render_to_response(self, context):
        return self.render_to_json_response(context)

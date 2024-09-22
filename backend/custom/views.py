from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import Option


def index(request):
    return HttpResponse("Hello, world. You're at the custom index.")

def options(request):
    options_list = Option.objects.all()
    options_list_json = serializers.serialize('json', options_list)
    return HttpResponse(options_list_json)

def getOptions(request):
    params = request.GET.getlist('menuID')
    options_list = Option.objects.filter(menuItem__in=params).all()
    options_list_json = serializers.serialize('json', options_list)
    return HttpResponse(options_list_json)
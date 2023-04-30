from django.http import JsonResponse
from django.shortcuts import render
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from .models import Song


# Create your views here.

def home(request):
    data = Song.objects.all()
    return render(request, 'home.html', {'data': data})


def podcast(request):
    data = Song.objects.all()
    return render(request, 'podcast.html', {'data': data})

@csrf_exempt
def getSongData(request):
    pk = request.POST['pk']
    data = Song.objects.filter(pk=pk)
    data = serializers.serialize('json', data)
    return JsonResponse(data, safe=False)

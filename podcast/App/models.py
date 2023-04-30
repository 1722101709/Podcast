from django.db import models


# Create your models here.

class Song(models.Model):
    image = models.ImageField(upload_to='images/')
    song = models.CharField(max_length=100)
    movie = models.CharField(max_length=100)
    music = models.FileField(upload_to='songs/')
    lyrics = models.TextField(max_length=100000)

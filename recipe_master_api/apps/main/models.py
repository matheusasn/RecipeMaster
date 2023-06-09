from django.conf import settings
from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        abstract = True

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    measure = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    quantity_type = models.CharField(max_length=100)
    measure_type = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    yield_amount = models.CharField(max_length=100)
    preparation_time = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient)
    preparation_method = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Menu(models.Model):
    name = models.CharField(max_length=100)
    yield_amount = models.CharField(max_length=100)
    measure = models.CharField(max_length=100)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient)
    costs = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name
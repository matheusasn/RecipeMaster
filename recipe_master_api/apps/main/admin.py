from django.contrib import admin
from .models import Ingredient, Recipe, Menu

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'measure', 'price', 'quantity', 'quantity_type', 'measure_type', 'description')

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'yield_amount', 'preparation_time', 'weight', 'description')
    filter_horizontal = ('ingredients',)

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'yield_amount', 'measure', 'description', 'costs')
    filter_horizontal = ('ingredients',)
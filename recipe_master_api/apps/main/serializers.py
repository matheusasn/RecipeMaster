from rest_framework import serializers
from .models import Ingredient, Recipe, Menu


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'

    def get_ingredients(self, obj):
        ingredient_serializer = IngredientSerializer(obj.ingredients.all(), many=True)
        return ingredient_serializer.data


class MenuSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Menu
        fields = '__all__'

    def get_ingredients(self, obj):
        ingredient_serializer = IngredientSerializer(obj.ingredients.all(), many=True)
        return ingredient_serializer.data
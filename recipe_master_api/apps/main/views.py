from rest_framework import viewsets
from .models import Recipe, Menu, Ingredient
from .serializers import RecipeSerializer, MenuSerializer, IngredientSerializer
from apps.users.models import User


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


    def get_queryset(self):
        user = self.request.auth.payload.get("user_id")
        return Ingredient.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.auth.payload.get("user_id")
        serializer.save(user=User.objects.get(id=user))


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


    def get_queryset(self):
        user = self.request.auth.payload.get("user_id")
        return Recipe.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.auth.payload.get("user_id")
        serializer.save(user=User.objects.get(id=user))


class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer


    def get_queryset(self):
        user = self.request.auth.payload.get("user_id")
        return Menu.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.auth.payload.get("user_id")
        serializer.save(user=User.objects.get(id=user))
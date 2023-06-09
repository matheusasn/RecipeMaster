from django.urls import path, include
from .views import IngredientViewSet, RecipeViewSet, MenuViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'menus', MenuViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
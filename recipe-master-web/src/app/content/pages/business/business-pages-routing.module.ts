import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CPProfileComponent } from "./profile/cp-profile.component";
import { AuthGuard } from "../../../core/auth/auth.guard";
import { PerfilEnum } from "../../../core/models/security/perfil.enum";

const _pathRecipes: string = './recipe/recipes/recipes.module#RecipesModule';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                // loadChildren: _pathRecipes,
                redirectTo: 'receitas',
            },
            {
                path: 'perfil',
                component: CPProfileComponent,
                canActivate: [ AuthGuard ]
            },

            {
                path: 'ingrediente', loadChildren: './ingredient/ingredient/ingredient.module#IngredientModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'ingrediente/:id', loadChildren: './ingredient/ingredient/ingredient.module#IngredientModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'ingredientes', loadChildren: './ingredient/ingredients/ingredients.module#IngredientsModule',
                canActivate: [ AuthGuard ]
            },

		    {
			    path: 'ingrediente-form', loadChildren: './ingredient/ingredient-form/ingredient-form.module#IngredientFormModule',
			    canActivate: [ AuthGuard ]
		    },

		    {
			    path: 'ingrediente-form/:id', loadChildren: './ingredient/ingredient-form/ingredient-form.module#IngredientFormModule',
			    canActivate: [ AuthGuard ]
		    },

            {
                path: 'receita', loadChildren: './recipe/recipe/recipe.module#RecipeModule',
                canActivate: [ AuthGuard ]
            },
            {
                path: 'receita/:id', loadChildren: './recipe/recipe/recipe.module#RecipeModule',
                canActivate: [ AuthGuard ]
            },
            {
                path: 'receitas', loadChildren: _pathRecipes,
                canActivate: [ AuthGuard ]
            },
						{
							path: 'receitas-publicas', loadChildren: './public-recipes/public-recipes.module#PublicRecipesModule',
							canActivate: [ AuthGuard ]
						},
            {
                path: 'cardapio', loadChildren: './menu/menu/menu.module#MenuModule',
                canActivate: [ AuthGuard ],
                data: {
                    access: [PerfilEnum.USER_BASIC, PerfilEnum.USER_PRO, PerfilEnum.USER_PRO_NUTRI, PerfilEnum.ADMIN]
                }
            },
            {
                path: 'cardapio/:id', loadChildren: './menu/menu/menu.module#MenuModule',
                canActivate: [ AuthGuard ],
                data: {
                    access: [PerfilEnum.USER_BASIC, PerfilEnum.USER_PRO, PerfilEnum.USER_PRO_NUTRI, PerfilEnum.ADMIN],
                    enableAlreadyCreated: true
                }
            },
            {
                path: 'cardapios', loadChildren: './menu/menus/menus.module#MenusModule',
                canActivate: [ AuthGuard ]
            },


            {
                path: 'suporte', loadChildren: './support/support.module#SupportModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'plans', loadChildren: './plano-assinatura/plano-assinatura.module#PlanoAssinaturaModule',
                canActivate: [ AuthGuard ]
            },

            // {
            //     path: 'plans/coupon', loadChildren: './plano-assinatura/plano-assinatura.module#PlanoAssinaturaModule',
            //     canActivate: [ AuthGuard ]
            // },

            {
                path: 'purchaseLists', loadChildren: './purchase-list/purchase-lists/purchase-lists.module#PurchaseListsModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'purchaseList', loadChildren: './purchase-list/purchase-list/purchase-list.module#PurchaseListModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'purchaseList/:id', loadChildren: './purchase-list/purchase-list/purchase-list.module#PurchaseListModule',
                canActivate: [ AuthGuard ]
            },

            {
                path: 'payments', loadChildren: './payment/payment.module#PaymentModule',
                canActivate: [ AuthGuard ]
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessPagesRoutingModule { }

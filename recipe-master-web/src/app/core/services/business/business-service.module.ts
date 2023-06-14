import { NgModule } from "@angular/core";

import { IngredientService } from './ingredient.service';
import { RegionService } from './region.service';
import { UnitService } from './unit.service';
import { RecipeService } from "./recipe.service";
import { MenuService } from "./menu.service";
import { CommonCalcService } from "./common-calc.service";
import { SupportService } from "./support.service";
import { PagSeguroService } from "./pagseguro-service";
import { NutritionInfoService } from "./nutritioninfo.service";
import { PlanService } from "./plan.service";
import { TypeformService } from "./typeform.service";

@NgModule({
  imports: [
  ],
  providers: [
    IngredientService,
    UnitService,
    RegionService,
    RecipeService,
    MenuService,
    CommonCalcService,
    SupportService,
    PagSeguroService,
    NutritionInfoService,
    PlanService,
    TypeformService
  ]
})
export class BusinessServiceModule { }

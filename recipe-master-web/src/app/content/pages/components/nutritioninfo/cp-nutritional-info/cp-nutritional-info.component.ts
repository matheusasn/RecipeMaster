import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Recipe } from '../../../../../core/models/business/recipe';
import { Unit, GRAMA_UNIT, KILO_UNIT } from '../../../../../core/models/business/unit';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import * as _ from 'lodash';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { RolePermission, PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { PagSeguroService } from '../../../../../core/services/business/pagseguro-service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { UserService } from '../../../../../core/auth/user.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpNutritionalInfoLabelComponent } from '../cp-nutritional-info-label/cp-nutritional-info-label.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { AllergenComponent } from '../allergen/allergen.component';
import { RecipeLabelAllergen } from '../../../../../core/models/business/RecipeLabelAllergen';
import { LabelIngredientFormComponent } from '../label-ingredient-form/label-ingredient-form.component';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';
import { DialogRecipeNutritionalInstructionComponent } from '../../../tutorials/recipe/dialog-recipe-nutritional-instruction/dialog-recipe-nutritional-instruction.component';

@Component({
  selector: 'cp-nutritional-info',
  templateUrl: './cp-nutritional-info.component.html',
  styleUrls: ['./cp-nutritional-info.component.scss']
})
export class CpNutritionalInfoComponent extends CpBaseComponent implements OnInit, OnChanges {

  @Input() recipe: Recipe;
  @Input() units: Unit[];
  @Input() formGroup: FormGroup;
	@Input() recipes: Recipe[] = [];
	@Output() onShouldSave = new EventEmitter();
  @ViewChild('pdf') pdf: any;
  hasPermission:boolean;
  perfil: PerfilEnum = PerfilEnum.USER_PRO_NUTRI;
  isCollapsed:boolean = true;
  PerfilEnum = PerfilEnum;
  loading:boolean = true;
	recipeLabelRef: MatDialogRef<CpNutritionalInfoLabelComponent>;
	allergenRef: MatDialogRef<AllergenComponent>;
	labelIngredientFormRef: MatDialogRef<LabelIngredientFormComponent>;
  cifrao: string;
	lang: string;


  constructor(protected _cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private planService: PlanService,
		private _router: Router,
		private pagSeguroService: PagSeguroService,
		private userService: UserService,
		private _dialogRecipeLabel: MatDialog,
		private _dialogAllergen: MatDialog,
		private _dialogLabelIngredientForm: MatDialog,
    private _localstorage: CpLocalStorageService,
		private _translationService: TranslationService
		) {
    super(_loading, _cdr);

    this.hasPermission = this.planService.hasPermission(RolePermission.NUTRITION_INFO_ENABLED, false);

    if(this.hasPermission) {
			this.isCollapsed = false;
    }

    this.cifrao = this._localstorage.getCurrency();
	  this._translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});
  }

  ngOnInit() {
    this.formGroup && this.formGroup.patchValue({
        label: {
          portion: (this.recipe && this.recipe.label && this.recipe.label.portion)?this.recipe.label.portion:100
        }
    });

  }

	automaticSave() {
		this.onShouldSave.emit('');
	}

  toogleCollapse() {
      this.isCollapsed = !this.isCollapsed;
  }

  ngOnChanges(changes: SimpleChanges) {
    if( !_.isNil(changes.recipe) ) {

      let recipe:Recipe = changes.recipe.currentValue;

      this.recipe = recipe;

      if(_.isNil(this.formGroup.value.label.weight)) {

        this.formGroup && this.formGroup.patchValue({
          label: {
            weight: this.getPesoFromRecipe()
          }
        });

      }

    }

  }

  private getPesoFromRecipe() {

    if(this.recipe.unityQuantity) {

      if(this.recipe && this.recipe.unityQuantity && this.recipe.unit && this.recipe.unit.id == GRAMA_UNIT) {
        return this.recipe.unityQuantity;
      }
      else if(this.recipe && this.recipe.unityQuantity &&  this.recipe.unit && this.recipe.unit.id == KILO_UNIT) {
        return this.recipe.unityQuantity * 1000;
      }

    }
    else {

      if(this.recipe && this.recipe.portions && this.recipe.unit && this.recipe.unit.id == GRAMA_UNIT) {
        return this.recipe.portions;
      }
      else if(this.recipe && this.recipe.portions &&  this.recipe.unit && this.recipe.unit.id == KILO_UNIT) {
        return this.recipe.portions * 1000;
      }

    }

    return null;

  }

	openLabelIngredientForm() {
		this.labelIngredientFormRef = this._dialogLabelIngredientForm.open(LabelIngredientFormComponent, {
			panelClass: 'cpPanelOverflow',
			data: {
				ingredients: this.formGroup.value.label.ingredients
			}
		})

		this.labelIngredientFormRef.afterClosed().subscribe(data => {
			if (data) {
				const { name, ingredients } = data;
				const label = this.recipe.label;
				if (_.isNil(label.ingredients)) {
					label.ingredients = []
				}
				label.ingredients = ingredients;
				if (name) {
					label.ingredients.push({ name });
				}
				this.recipe.label = label;
				this.formGroup && this.formGroup.patchValue({
					label: label
				});

				this.onChangeComponent();
				this.automaticSave();
			}
		})
	}

	openAllergens() {
		this.allergenRef = this._dialogAllergen.open(AllergenComponent, {
			data: {
				recipeLabel: this.recipe.label
			},
			panelClass: 'cpPanelOverflow'
		})

		this.allergenRef.afterClosed().subscribe((data: RecipeLabelAllergen[]) => {
			this.recipe.label.allergens = data;
			this.formGroup && this.formGroup.patchValue({
        label: this.recipe.label
    	});
			this.onChangeComponent();
			this.automaticSave();
		})
	}

	openRecipeLabel(e) {
		this.recipeLabelRef = this._dialogRecipeLabel.open(CpNutritionalInfoLabelComponent, {
			data: {
				recipe: this.recipe,
				portion: this.formGroup.value.label.portion,
				weight: this.formGroup.value.label.weight
			},
			panelClass: 'cpPanelOverflow'
		});

		this.recipeLabelRef.afterClosed().subscribe( (recipeLabelData) => {
			if (!recipeLabelData) {
				return;
			}

			this.recipe.label = recipeLabelData

			this.formGroup && this.formGroup.patchValue({
        label: recipeLabelData
    	});

			this.onChangeComponent();

			this.automaticSave();

		});
	}

  async gerarRotulo() {
		this._loading.show();
    this.pdf.createLabel();
		this._loading.hide();
  }

  doPagSeguro() {

    this._loading.show();

    this.pagSeguroService.checkout(this.perfil).subscribe((r)=>{
      this._loading.hide();
      this.planService.checkoutBox(r.message, this.perfil);
    },
    err => {
      console.warn(err.message);
      this._loading.hide();
    });

  }

	innerButtonClick(event: Event) {
    event.stopPropagation();
    this.openDialog('recipeNutritionalInstruction')
  }

  doPlanPage() {
    this._router.navigate([CpRoutes.PLAN_SIGN]);
  }

	openDialog(type: string): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		const optionsDialog = {
			recipeNutritionalInstruction: DialogRecipeNutritionalInstructionComponent
		}

		const dialogComponent = optionsDialog[type];
		this._dialogAllergen.open(dialogComponent, dialogConfig);
	}

}

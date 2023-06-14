import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Recipe } from '../../../../../../../core/models/business/recipe';
import { RecipeCategory } from '../../../../../../../core/models/business/recipecategory';
import { Unit } from '../../../../../../../core/models/business/unit';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogRecipeYieldsComponent } from '../../../../../tutorials/recipe/dialog-recipe-yields/dialog-recipe-yields.component';
import { DialogRecipeTotalWeightComponent } from '../../../../../tutorials/recipe/dialog-recipe-total-weight/dialog-recipe-total-weight.component';


@Component({
  selector: 'recipemaster-recipe-info-v1',
  templateUrl: './recipe-info-v1.component.html',
  styleUrls: ['./recipe-info-v1.component.scss']
})
export class RecipeInfoV1Component implements OnInit  {

  @Input() form:FormGroup;
  formInfoGeral:FormGroup;
  @Input() categories: RecipeCategory[] = [];
  @Input() units: Unit[] = [];
  @Input() recipe:Recipe;
  @Output() onChange:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onPhotoChange:EventEmitter<any> = new EventEmitter<any>();

	@Input() incomeUnits: Unit[] = [];
	@Input() recipeWeightUnits: Unit[] = [];

  constructor(private fb:FormBuilder, private dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
  }

	photoChange(base64Content: any) {
  	    this.onPhotoChange.emit(base64Content);
	}

	compareSelect(value1: any, value2: any): boolean {
		return value1 && value2 ? value1.id === value2.id : value1 === value2;
	}

  buildForm() {

    //@TODO - fazer o cálculo transformando de V2 para V1 (vide form V2)

    let unityQuantity:number|null = this.recipe?this.recipe.unityQuantity:null;
    let unit:Unit|null = this.recipe?this.recipe.unit:null;

    if(this.recipe && this.recipe.portions) {
      unityQuantity = this.recipe.portions;
    }

    this.formInfoGeral = this.fb.group({
      name: [this.recipe ? this.recipe.name : null, []],
      description: [this.recipe ? this.recipe.description : null, []],
      recipeCategory: [this.recipe ? this.recipe.recipeCategory : null, []],
      preparationTime: [this.recipe ? this.recipe.preparationTime : null, []],
      photoUrl: [this.recipe ? this.recipe.photoUrl : null, []],
      unityQuantity: [unityQuantity ? unityQuantity : null, []],
      unit: [unit ? unit : null, []],
			recipeWeight: [this.recipe ? this.recipe.recipeWeight : null, []],
			recipeWeightUnit: [this.recipe ? this.recipe.recipeWeightUnit : null, []],
      // v2
      portions: [null, []], // "rendimento"
      totalWeight: [null, []],
      portionName: [null, []],
      portionWeight: [null, []]
    });

    this.form.addControl('geral', this.formInfoGeral);

    this.formInfoGeral.controls.recipeCategory.valueChanges.subscribe( (change) => {

      this.onChange.emit(this.formInfoGeral);

    });

    this.formInfoGeral.valueChanges.subscribe( (change) => {

      this.onChange.emit(this.formInfoGeral);

			// this.onChangeCostValue();
			// this.onChangeCostUnitValue();

			// this.generateChartData();

    });

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
			recipeYields: DialogRecipeYieldsComponent,
			recipeTotal: DialogRecipeTotalWeightComponent
		}

		const dialogComponent = optionsDialog[type];
		this.dialog.open(dialogComponent, dialogConfig);
	}

}

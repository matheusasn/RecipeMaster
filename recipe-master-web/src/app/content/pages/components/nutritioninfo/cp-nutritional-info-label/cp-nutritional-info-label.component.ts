import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { Recipe } from '../../../../../core/models/business/recipe';
import { Ordered } from '../../../../../core/interfaces/orderedInterface';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Allergen, AllergenType } from '../../../../../core/models/business/allergen';
import { TranslateService } from '@ngx-translate/core';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { FormGroup } from '@angular/forms';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';
import { APIClientService } from '../../../../../core/services/common/api-client.service';
import { exportPDF } from '@progress/kendo-drawing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { ModalLoadingComponent } from '../../common/modal-loading/modal-loading.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'cp-nutritional-info-label',
  templateUrl: './cp-nutritional-info-label.component.html',
  styleUrls: ['./cp-nutritional-info-label.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class CpNutritionalInfoLabelComponent implements OnInit, OnChanges {

  @Input() recipe: Recipe;
  @Input() weight: any;
  @Input() portion: any;
  @Input() measure: any;
  @Input() lactose: any;
  @Input() gluten: any;
  @ViewChild('pdf') pdf: PDFExportComponent;
  @Input() previewClass: string = "";
  @Input() layout: String = 'vertical';
  @Input() showIngredients:boolean = true;
	@Input() recipes: Recipe[];
	@Input() formGroup: FormGroup;

	lang: string;
  ordered: Array<Ordered> = [];

	modalLoadingRef: MatDialogRef<ModalLoadingComponent>;

  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) private data: any,
		@Optional() private _dialogRef: MatDialogRef<CpNutritionalInfoLabelComponent>,
		private translate: TranslateService,
		private _recipeService: RecipeService,
		private translationService:TranslationService,
		private _apiService: APIClientService,
		private _localStorage: CpLocalStorageService,
		private deviceDetectorService: DeviceDetectorService,
		private _dialogLoading: MatDialog,
		){
			if (data) {
				this.recipe = data.recipe;
				this.weight = data.weight;
				this.portion = data.portion;
				this.previewClass = 'preview';
				this.layout = 'vertical-edit';
				this._dialogRef.beforeClosed().subscribe(() => {
					this.close();
				})
			}
			this.translationService.getSelectedLanguage().subscribe(lang => {
				this.lang = lang;
			});
	}

  ngOnInit(){
		if (this.formGroup) {
			this.formGroup.controls.ingredients.valueChanges.subscribe(async(change) => {
				const currentRecipesIds = this.recipes.map(recipe => recipe.id);

				for (const recipeIngredient of change) {
					if (recipeIngredient.ingredient.recipeCopiedId && !currentRecipesIds.includes(recipeIngredient.ingredient.recipeCopiedId)) {
						const { data } = await this._recipeService.getById(recipeIngredient.ingredient.recipeCopiedId).toPromise();
						this.recipes.push(data);
					}
				}

				this.orderIngredients();

				document.getElementById('ingredients').click()
			})

			this.formGroup.controls.label['controls'].ingredients.valueChanges.subscribe((change) => {
				this.orderIngredients();
			})
		}

  }

	get isAndroid() {
		// @ts-ignore
		return typeof Android !== 'undefined'
	}

  ngOnChanges(){
  }

	get haveAdditionalSugar() {
		if (this.lang === 'en') {
			const sugarWords = ['sugar', 'honey', 'syrups', 'molasses', 'sweeteners', 'fructose', 'beverages', 'cookie', 'ice cream', 'candies', 'snacks', 'juice', 'cereals', 'sauce', 'pie', 'cake', 'desserts', 'pastry', 'pastries', 'cream', 'puddings', 'sauce', 'jams', 'toppings'];
			let ingredients = []
			if (this.formGroup && this.formGroup.value) {
				ingredients = this.formGroup.value.ingredients;
			} else {
				ingredients = this.recipe.ingredients;
			}
			const ingredientsThatHaveAdditionalSugar = ingredients.filter(i => {
				const spplitedName = i.ingredient.name.toLowerCase().split(' ')
				const found = sugarWords.some(r=> spplitedName.includes(r))
				return found
			})

			return ingredientsThatHaveAdditionalSugar.length > 0
		}
		return false;
	}

	get horizontalLabelData() {
		if (this.recipe && this.recipe.label) {
			const label = this.recipe.label;
			const labels = [
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L4', value: label.kcal, label: 'kcal', unity: 'kcal' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L8', value: label.transFat, label: 'transFat', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L5', value: label.carbohydrates, label: 'carbohydrates', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L9', value: label.fibers, label: 'fibers', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L6', value: label.protein, label: 'protein', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L10', value: label.sodium, label: 'sodium', unity: 'mg' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.L7', value: label.totalFat, label: 'totalFat', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.MONOUNSATURED', value: label.monounsatured, label: 'monounsatured', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.POLYUNSATURED', value: label.polyunsatured, label: 'polyunsatured', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.CHOLESTEROL', value: label.cholesterol, label: 'cholesterol', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.CALCIUM', value: label.calcium, label: 'calcium', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.MAGNESIUM', value: label.magnesium, label: 'magnesium', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.MANGANESE', value: label.manganese, label: 'manganese', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.PHOSPHORUS', value: label.phosphorus, label: 'phosphorus', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.IRON', value: label.iron, label: 'iron', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.POTASSIUM', value: label.potassium, label: 'potassium', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.COPPER', value: label.copper, label: 'copper', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.ZINC', value: label.zinc, label: 'zinc', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.A_VITAMIN_RETINOL', value: label.retinol, label: 'retinol', unity: 'mcg' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.A_VITAMIN_RAE', value: label.vitaminARAE, label: 'vitaminARAE', unity: 'mcg' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.D_VITAMIN', value: label.vitaminD, label: 'vitaminD', unity: 'mcg' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.THIAMINE', value: label.thiamine, label: 'thiamine', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.RIBOFLAVINE', value: label.riboflavin, label: 'riboflavin', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.PYRIDOXINE', value: label.pyridoxine, label: 'pyridoxine', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.NIACIN', value: label.niacin, label: 'niacin', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.B6_VITAMIN', value: label.vitaminB6, label: 'vitaminB6', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.B12_VITAMIN', value: label.vitaminB12, label: 'vitaminB12', unity: 'mcg' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.C_VITAMIN', value: label.vitaminC, label: 'vitaminC', unity: 'g' },
				{ description: 'RECIPE.TABS.INFORMACOES_NUTRICIONAIS.TABLE.LIPIDS', value: label.lipids, label: 'lipids', unity: 'g' },
			]

			const activeLabels = labels.filter(l => l.value);

			const arr = Array.from({ length: activeLabels.length }, () => []);

			for (let index = 0; index < activeLabels.length; index++) {
				const element = activeLabels[index];

				arr.some(item => {
					if (item.length < 2) {
						item.push(element);
						return true;
					}
				})
			}

			return arr
		}
		return []
	}

	getAllergensText() {
		if (this.recipe && this.recipe.label && this.recipe.label.allergens.length > 0) {
			let containsTranslatedText = ''
			let mayContainTranslatedText = ''
			this.translate.get('RECIPE.TABS.INFORMACOES_NUTRICIONAIS.ALLERGEN.CONTAINS').subscribe(
				data => {containsTranslatedText = data}
			);
			this.translate.get('RECIPE.TABS.INFORMACOES_NUTRICIONAIS.ALLERGEN.MAY_CONTAIN').subscribe(
				data => {mayContainTranslatedText = data}
			);
			const contains = this.recipe.label.allergens
				.filter(allergen => allergen.allergenType === AllergenType.CONTAINS)
				.map(allergen => this.getAllergenNameAndDescription(allergen.allergen))
			const mayContain = this.recipe.label.allergens
				.filter(allergen => allergen.allergenType === AllergenType.MAY_CONTAIN)
				.map(allergen => this.getAllergenNameAndDescription(allergen.allergen))

			const containsText = contains.length > 0 ? `${containsTranslatedText}: ${contains}` : null
			const mayContainText = mayContain.length > 0 ? `${mayContainTranslatedText}: ${mayContain}` : null
			if (containsText && mayContainText) {
				return `${containsText} ${mayContainText}`;
			}
			if (containsText) {
				return `${containsText}`;
			}
			if (mayContainText) {
				return `${mayContainText}`;
			}
		}
	}

	private getAllergenNameAndDescription(allergen: Allergen) {
		let name = allergen.name
		let description = allergen.description
		if (description) {
			return `${name} ${description}`
		}
		return `${name}`
	}

  private orderIngredients(){
     if (this.showIngredients) {
       let ingredients = this.recipe.ingredients;
       this.ordered = [];

       ingredients.forEach(i => {
					if (i.unit.abbreviation == 'Kg' && i.amount) {
					this.ordered.push({name: i.ingredient.name, amount: i.amount*1000});
					}	else if (i.amount) {

						if (i.ingredient.recipeCopiedId) {
							const recipe = _.find(this.recipes, { id: i.ingredient.recipeCopiedId })
							const primaryIngredients = []
							recipe.ingredients.forEach(ingredient => {
								if (_.isNil(ingredient.ingredient.recipeCopiedId)) {
									primaryIngredients.push(ingredient.ingredient.name);
								}
							})
							const name = `${i.ingredient.name} (${primaryIngredients.join(', ')})`
							this.ordered.push({ name, amount: i.amount })
					 } else {
						 this.ordered.push({name: i.ingredient.name, amount: i.amount});
					 }
					}
       });

       this.ordered.sort((a,b) => a.amount > b.amount ? -1: 1);

			 const labelIngredients = _.sortBy(this.recipe.label ? this.recipe.label.ingredients : [], 'name');
			 labelIngredients.forEach(i => this.ordered.push({ name: i.name }))

     }
   }

	close() {
		this._dialogRef.close(this.recipe.label);
	}

  public async createLabel() {
    let filename = `${this.recipe['geral']['name']}-Rotulo.pdf`;
    this.pdf.scale = 0.75;

		if (+window.innerWidth <= 768) {
			this.pdf.forceProxy = true

			this.pdf.proxyURL = this._apiService.getUrl('/business/pdf/proxy')
		}

		const iOSDevice = this._localStorage.isIOS();

		// @ts-ignore
		const isAndroid = typeof Android !== 'undefined';

		let text = '';
		let pdfGeneratedText = ''

		this.translate.get('GENERATING_LABEL').subscribe(
			data => {text = data}
		);

		this.translate.get('PDF_GENERATED').subscribe(
			data => {pdfGeneratedText = data}
		);

		this.modalLoadingRef = this._dialogLoading.open(ModalLoadingComponent, {
			data: {
				text
			},
		});

		let op: SweetAlertOptions = {
			title: pdfGeneratedText,
			type: 'success',
			showCloseButton: true,
			showConfirmButton: false,
			timer: 1000,
		};

		setTimeout(() => swal(op), 3100)

		if (isAndroid || iOSDevice) {
			const group = await this.pdf.export();
			const base64Pdf = await exportPDF(group);

			if (isAndroid) {
				// @ts-ignore
				Android.downloadPdfWithNameAndZoom(base64Pdf,3.0,filename);
			} else if (iOSDevice) {
				// @ts-ignore
				window.webkit.messageHandlers.ios.postMessage({ base64: base64Pdf, fileName: filename, zoom: 1.0 });
			}

		} else {
			this.pdf.saveAs(filename);
		}
  }

}

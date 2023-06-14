import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ENDPOINTS } from '../../../../../core/constants/endpoints';
import { APIClientService } from '../../../../../core/services/common/api-client.service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Allergen, AllergenType } from '../../../../../core/models/business/allergen';
import { RecipeLabel } from '../../../../../core/models/business/recipe-label';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';

@Component({
  selector: 'm-allergen',
  templateUrl: './allergen.component.html',
  styleUrls: ['./allergen.component.scss']
})
export class AllergenComponent extends CpBaseComponent implements OnInit {

	allergens: Allergen[] = [];
	formGroup: FormGroup;
	recipeLabel: RecipeLabel;
	containsCollapsed: boolean = true;
	mayContainCollapsed: boolean = true;
	lang: string;

  constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		@Optional() private _dialogRef: MatDialogRef<AllergenComponent>,
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _apiClient: APIClientService,
		private formBuilder: FormBuilder,
		private translationService: TranslationService
	) {
		super(_loading, _cdr);
		this.formGroup = this.formBuilder.group({
      containsAllergensArray: new FormArray([]),
      mayContainAllergensArray: new FormArray([]),
    });
		this.recipeLabel = data.recipeLabel;

		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});

		_dialogRef.beforeClosed().subscribe(() => this.doClose());
	}

  ngOnInit() {
		this._apiClient.get(`${ENDPOINTS.BUSINESS.ALLERGENS}`).subscribe(response => {
			this.allergens = response.data;
			this.addCheckboxes();
		})
  }

	getDescription(allergen: Allergen) {
		if (this.lang === 'en') {
			return allergen.enDescription;
		} else if (this.lang === 'es') {
			return allergen.esDescription;
		}
		return allergen.description;
	}

	getName(allergen: Allergen) {
		if (this.lang === 'en') {
			return allergen.enName;
		} else if (this.lang === 'es') {
			return allergen.esName;
		}
		return allergen.name;
	}

	get containsAllergensFormArray() {
    return this.formGroup.controls.containsAllergensArray as FormArray;
  }

	get mayContainAllergensFormArray() {
    return this.formGroup.controls.mayContainAllergensArray as FormArray;
  }

  private addCheckboxes() {
		this.allergens.forEach(() => {
			this.containsAllergensFormArray.push(new FormControl(false));
			this.mayContainAllergensFormArray.push(new FormControl(false));
		})

    this.allergens.forEach((allergen: Allergen, index) => {
			const filtered = this.recipeLabel.allergens.filter(recipeLabelAllergen => recipeLabelAllergen.allergen.id === allergen.id);
			filtered.forEach(item => {
				if (item.allergenType === AllergenType.CONTAINS) {
					this.containsAllergensFormArray.controls[index] = new FormControl(true);
				} else {
					this.mayContainAllergensFormArray.controls[index] = new FormControl(true);
				}
			})
		});
  }

	doClose() {
    const containsAllergens = this.formGroup.controls.containsAllergensArray['controls']
      .map((item, i) => item.value ? {
				allergen: this.allergens[i],
				allergenType: AllergenType.CONTAINS,
				// recipeLabel: this.recipeLabel
			} : null)
      .filter(v => v !== null);

			const mayContainAllergens = this.formGroup.controls.mayContainAllergensArray['controls']
      .map((item, i) => item.value ? {
				allergen: this.allergens[i],
				allergenType: AllergenType.MAY_CONTAIN,
				// recipeLabel: this.recipeLabel
			} : null)
      .filter(v => v !== null);

		this._dialogRef.close([...containsAllergens, ...mayContainAllergens]);
  }

}

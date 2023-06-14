import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { NutritionInfo } from '../../../../../core/models/business/nutritioninfo';
import { NutritionInfoOrigin } from '../../../../../core/models/business/dto/nutritioninfo-filter';
import { NutritionInfoService } from '../../../../../core/services/business/nutritioninfo.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';

export function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}

@Component({
  selector: 'm-nutritioninfo-edit',
  templateUrl: './nutritioninfo-edit.component.html',
  styleUrls: ['./nutritioninfo-edit.component.scss']
})
export class NutritioninfoEditComponent implements OnInit {

  formGroup: FormGroup;
  @Output() onSave:EventEmitter<NutritionInfo> = new EventEmitter<NutritionInfo>();
  @Output() onCancel:EventEmitter<any> = new EventEmitter<any>();
  @Input() item: NutritionInfo;

	lang: string;

  constructor(private _formBuilder: FormBuilder,
		private nutritionInfoService: NutritionInfoService,
		private toaster: ToastrService,
		private translationService: TranslationService) { }

  ngOnInit() {
		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});
    this.buildForm();
  }

  doCreate() {

    if(this.formGroup.invalid) {

      if(this.formGroup.controls.grams.errors && this.formGroup.controls.grams.errors.min) {
        this.toaster.error("Quantidade deve ser maior ou igual a 0 (zero)");
      }
      else {
        this.toaster.error("Preencha os campos obrigatórios");
      }

      return;

    }

    let ni:NutritionInfo = this.formGroup.value;

		const format = (number: number) => {
			return +(String(number).replace(',','.'));
		}

    ni.origin = NutritionInfoOrigin.USER;
    ni.description = this.formGroup.value.description;
		ni.enDescription = this.formGroup.value.description;
		ni.esDescription = this.formGroup.value.description;
    ni.grams = format(this.formGroup.value.grams)
    ni.kcal = format(this.formGroup.value.kcal);
    ni.carbohydrates = format(this.formGroup.value.carbohydrates);
    ni.protein = format(this.formGroup.value.protein);
    ni.totalFat = format(this.formGroup.value.totalFat);
    ni.saturatedFat = format(this.formGroup.value.saturatedFat);
    ni.transFat = format(this.formGroup.value.transFat);
    ni.fibers = format(this.formGroup.value.fibers);
    ni.sodium = format(this.formGroup.value.sodium);
		ni.cholesterol = format(this.formGroup.value.cholesterol);
		ni.monounsatured = format(this.formGroup.value.monounsatured);
		ni.polyunsatured = format(this.formGroup.value.polyunsatured);
		ni.calcium = format(this.formGroup.value.calcium);
		ni.magnesium = format(this.formGroup.value.magnesium);
		ni.manganese = format(this.formGroup.value.manganese);
		ni.phosphorus = format(this.formGroup.value.phosphorus);
		ni.iron = format(this.formGroup.value.iron);
		ni.potassium = format(this.formGroup.value.potassium);
		ni.copper = format(this.formGroup.value.copper);
		ni.zinc = format(this.formGroup.value.zinc);
		ni.retinol = format(this.formGroup.value.retinol);
		ni.vitaminARAE = format(this.formGroup.value.vitaminARAE);
		ni.vitaminD = format(this.formGroup.value.vitaminD);
		ni.thiamine = format(this.formGroup.value.thiamine);
		ni.riboflavin = format(this.formGroup.value.riboflavin);
		ni.pyridoxine = format(this.formGroup.value.pyridoxine);
		ni.niacin = format(this.formGroup.value.niacin);
		ni.vitaminB6 = format(this.formGroup.value.vitaminB6);
		ni.vitaminB12 = format(this.formGroup.value.vitaminB12);
		ni.vitaminC = format(this.formGroup.value.vitaminC);
		ni.lipids = format(this.formGroup.value.lipids);

		if (this.lang === 'en') {
			ni.totalSugars = format(this.formGroup.value.totalSugar);
		}

    if(this.item && this.item.user) {
      ni.user = this.item.user;
    }

    if(this.item.id) {
      ni.id = this.item.id;
    }

    this.nutritionInfoService.insert(ni).subscribe( (response) => {
      this.toaster.success("Informação Nutricional atualizada com sucesso!");
      this.onSave.emit(response.data);
    }, (err) => {
      console.warn(err);
      this.toaster.error("Não foi possível atualizar o regsitro.");
    } );

  }

  doCancel() {
    this.onCancel.emit();
  }

  private buildForm() {

    this.formGroup = this._formBuilder.group({
      description: [this.item?this.item.description:'', [Validators.required, Validators.minLength(2), Validators.nullValidator, noWhitespaceValidator]],
      grams: [this.item?this.item.grams:null, [Validators.required, Validators.min(0)]],
      kcal: [this.item?this.item.kcal:null, []],
      carbohydrates: [this.item?this.item.carbohydrates:null, []],
      protein: [this.item?this.item.protein:null, []],
      totalFat: [this.item?this.item.totalFat:null, []],
      saturatedFat: [this.item?this.item.saturatedFat:null, []],
      transFat: [this.item?this.item.transFat:null, []],
      fibers: [this.item?this.item.fibers:null, []],
      sodium: [this.item?this.item.sodium:null, []],
			cholesterol: [this.item?this.item.cholesterol:null, []],
			monounsatured: [this.item?this.item.monounsatured:null, []],
			polyunsatured: [this.item?this.item.polyunsatured:null, []],
			calcium: [this.item?this.item.calcium:null, []],
			magnesium: [this.item?this.item.magnesium:null, []],
			manganese: [this.item?this.item.manganese:null, []],
			phosphorus: [this.item?this.item.phosphorus:null, []],
			iron: [this.item?this.item.iron:null, []],
			potassium: [this.item?this.item.potassium:null, []],
			copper: [this.item?this.item.copper:null, []],
			zinc: [this.item?this.item.zinc:null, []],
			retinol: [this.item?this.item.retinol:null, []],
			vitaminARAE: [this.item?this.item.vitaminARAE:null, []],
			vitaminD: [this.item?this.item.vitaminD:null, []],
			thiamine: [this.item?this.item.thiamine:null, []],
			riboflavin: [this.item?this.item.riboflavin:null, []],
			pyridoxine: [this.item?this.item.pyridoxine:null, []],
			niacin: [this.item?this.item.niacin:null, []],
			vitaminB6: [this.item?this.item.vitaminB6:null, []],
			vitaminB12: [this.item?this.item.vitaminB12:null, []],
			vitaminC: [this.item?this.item.vitaminC:null, []],
			lipids: [this.item?this.item.lipids:null, []],
    });

  }

}

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RecipeLabelIngredient } from '../../../../../core/models/business/RecipeLabelIngredient';
import * as _ from 'lodash';

@Component({
  selector: 'm-label-ingredient-form',
  templateUrl: './label-ingredient-form.component.html',
  styleUrls: ['./label-ingredient-form.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LabelIngredientFormComponent implements OnInit {

	form: FormGroup;
	ingredients: RecipeLabelIngredient[];
	editingIngredients: boolean[] = [];
	shouldRunCancel: boolean = true;

  constructor(
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<LabelIngredientFormComponent>,
		@Inject(MAT_DIALOG_DATA) private data: any
		) { }

  ngOnInit() {
		this.ingredients = _.sortBy(this.data.ingredients, 'name');
		this.createForm();
		this.ingredients.forEach((ingredient, index) => this.editingIngredients[index] = false);

		this._dialogRef.beforeClosed().subscribe(() => this.cancel());
  }

	createForm() {
		this.form = this._formBuilder.group({
			name: ['', [Validators.required]],
			ingredients: this._formBuilder.array(this.ingredients.map(ingredient => this._formBuilder.group(ingredient)))
		})
	}

	toggleEdit(index: number) {
		this.editingIngredients[index] = !this.editingIngredients[index]
	}

	get ingredientsArray() {
		return this.form.controls.ingredients as FormArray
	}

	remove(index: number) {
		this.ingredientsArray.removeAt(index);
	}

	cancel() {
		if (this.shouldRunCancel) {
			this._dialogRef.close({
				ingredients: this.form.value.ingredients
			});
		}
	}

	save() {
		this.shouldRunCancel = false;
		this._dialogRef.close({
			name: this.form.value.name || null,
			ingredients: this.form.value.ingredients
		})
	}

}

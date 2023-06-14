import { Component, OnInit, Input, Inject } from '@angular/core';
import { Recipe } from '../../../../core/models/business/recipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RecipeService } from '../../../../core/services/business/recipe.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { RecipeShareDTO } from '../../../../core/models/business/dto/recipe-share-dto';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';

@Component({
  selector: 'm-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

  recipe: Recipe;
  formGroup: FormGroup;
  submited:boolean = false;
  error:string;
  lastSharedMail:string;
  loading:boolean = false;
  constructor(private recipeService: RecipeService, @Inject(MAT_DIALOG_DATA) private data: any, private _formBuilder: FormBuilder,
  private _dialog: MatDialogRef<ShareModalComponent>, private _toast: ToastrService) {
    this.recipe = data.recipe;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {

    this.formGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  doReset() {
    this.submited = false;
    this.error = null;
    this.buildForm();
  }

  doShare() {

    if(!this.formGroup.valid) {
      this._toast.warning("Email de usuário é obrigatório!");
      return;
    }

    let dto:RecipeShareDTO = {
      recipeid: this.recipe.id,
      email: this.formGroup.value.email
    };

    this.loading = true;

    this.recipeService.share(dto).subscribe( (response:ApiResponse) => {
      this.submited = true;
      this.lastSharedMail = dto.email;

      if(response.errors.length > 0) {
        this.error = response.errors[0];
      }

      this.loading = false;

    }, (err) => {
      this.submited = true;
      this.error = err.message;
      this.loading = false;
    });

  }

  cancel() {
    this._dialog.close({
      recipeIngredient: null
    });
  }

}

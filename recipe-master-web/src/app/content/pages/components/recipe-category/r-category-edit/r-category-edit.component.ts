import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../../core/models/user';
import { ToastrService } from 'ngx-toastr';
import { RecipeCategory } from '../../../../../core/models/business/recipecategory';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { Recipe } from '../../../../../core/models/business/recipe';
import { TranslateService } from '@ngx-translate/core';
import { CategoriesComponent } from '../../../tutorials/my-recipes/categories/categories.component';

@Component({
  selector: 'm-r-category-edit',
  templateUrl: './r-category-edit.component.html',
  styleUrls: ['./r-category-edit.component.scss']
})
export class RecipeCategoryEditComponent implements OnInit {

    category:RecipeCategory;
    categories:RecipeCategory[];
    user: User;
    form: FormGroup;
    recipe: Recipe;

    constructor(private dialogRef: MatDialogRef<RecipeCategoryEditComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private fb:FormBuilder, private toaster: ToastrService, private recipeService: RecipeService, private translate: TranslateService, private dialog: MatDialog) {
        this.category = data.category;
        this.user = data.user;
        this.categories = _.filter(data.categories, (c:RecipeCategory) => {
            return !_.isNil(c.userId) || !_.isNil(c.recipeId);
        });

    }

    ngOnInit() {
        this.buildForm();
    }

    async doSubmit() {

        this.form.patchValue({
            abbreviation: this.form.value.name
        })

        if(this.form.invalid) {
            this.toaster.error("Preencha todos os campos.");
            return;
        }

        let category:RecipeCategory = this.form.value;

        // if(this.category && _.isNil(this.category.userId)) {
        //     delete(category.id); // não deve atualizar categoria do sistema
        // }

        if(category.id) {

            // atualizar
            let response;
            if (category.userId) {
                response = await this.recipeService.updateCategory(category).toPromise();
            } else {
                this.form.value.copiedId = category.id;
                delete(this.form.value.id);
                response = await this.recipeService.createCategory(this.form.value).toPromise();
            }

            this.toaster.success("Categoria da receita atualizada com sucesso.");

            this.dialogRef.close({
                event: 'update',
                category: category
            });

        }
        else {

            // criar

            let response = await this.recipeService.createCategory(category).toPromise();

            this.toaster.success("Categoria de receita criada com sucesso.");

            category.id = response.data.id;
            category.userId = response.data.user.id;

            this.dialogRef.close({
                event: 'create',
                category: category
            });

        }

    }

    doCancel() {
        // this.onCancel.emit();
        this.dialogRef.close({
            event: 'cancel'
        });
    }

    private buildForm() {

        this.form = this.fb.group({
            id: [this.category&&this.category.id?this.category.id:null, []],
						userId: [this.category&&this.category.userId?this.category.userId:null, []],
            name: [this.category&&this.category.name?this.translate.instant(this.category.name):null, [Validators.required, Validators.minLength(2)]],
            user: [this.user, [Validators.required]],
        });

    }

		openCategorieTutorialDialog(): void {
			const dialogConfig: MatDialogConfig = {
				maxWidth: '90vw',
				width: '587px',
				maxHeight: '95vh',
				hasBackdrop: true,
				closeOnNavigation: true,
				panelClass: 'tutorial-dialog-container'
			};

			this.dialog.open(CategoriesComponent, dialogConfig);
		}

}

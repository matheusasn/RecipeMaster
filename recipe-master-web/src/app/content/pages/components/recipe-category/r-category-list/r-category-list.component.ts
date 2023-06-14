import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import swal, { SweetAlertOptions } from 'sweetalert2';
import * as _ from 'lodash';
import { User } from '../../../../../core/models/user';
import { ApiResponse } from '../../../../../core/models/api-response';
import { ToastrService } from 'ngx-toastr';
import { RecipeCategory } from '../../../../../core/models/business/recipecategory';
import { RecipeCategoryEditComponent } from '../r-category-edit/r-category-edit.component';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { Recipe } from '../../../../../core/models/business/recipe';


@Component({
  selector: 'm-r-category-list',
  templateUrl: './r-category-list.component.html',
  styleUrls: ['./r-category-list.component.scss']
})
export class RecipeCategoryListComponent implements OnInit {

    category:RecipeCategory;
    categories:RecipeCategory[];
    userCategories:RecipeCategory[];
    user:User;
    recipe: Recipe;

    constructor(private dialogRef: MatDialogRef<RecipeCategoryListComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private dialog: MatDialog, private toaster: ToastrService, private recipeService: RecipeService) {
        this.category = data.category;
        this.categories = data.categories;
        this.user = data.user;
        this.userCategories = _.filter(data.categories, (c:RecipeCategory) => {
            return !_.isNil(c.userId) || !_.isNil(c.recipeId);
        });

    }

    ngOnInit() {
    }

    doEditar(item:RecipeCategory) {

        let createCategoryModal = this.dialog.open(RecipeCategoryEditComponent, {
            data: {
              category: item,
              categories: this.categories,
              user: this.user
            },
            panelClass: 'custom-modalbox'
        });

        createCategoryModal.afterClosed().subscribe( (response:any) => {

            if(!response) {
                return;
            }

            if(response.event == 'create') {

                this.categories.push(response.category);
                return;
            }

            let c:RecipeCategory = _.find(this.categories, {id: item.id});

            Object.assign(c, response.category);

            // this.onChange.emit(this.categories);

        });

    }

    doClose() {
        this.dialogRef.close({
            categories: this.categories
        });
    }

    async doExcluir(item:RecipeCategory) {

        const op: SweetAlertOptions = {
                title: '',
                text: 'Excluir esta categoria?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f4516c',
                cancelButtonColor: '#d2d2d2',
                confirmButtonText: "Excluir",
                cancelButtonText: "Voltar"
        };

        swal(op).then((result) => {

            if (result.value) {

                this.recipeService.deleteCategory(this.user.id, item.id).subscribe( (response:ApiResponse) => {
                    this.toaster.success("Categoria removida com sucesso.");

                    // remover do this.categories e
                    // this.onDelete.emit(this.categories);

                });

            }

        });

    }

}

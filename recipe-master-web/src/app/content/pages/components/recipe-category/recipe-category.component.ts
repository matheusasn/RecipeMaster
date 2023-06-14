import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Recipe } from "../../../../core/models/business/recipe";
import { RecipeCategory } from "../../../../core/models/business/recipecategory";
import { User } from "../../../../core/models/user";
import { RecipeService } from "../../../../core/services/business/recipe.service";
import { CpLoadingService } from "../../../../core/services/common/cp-loading.service";
import { CpLocalStorageService } from "../../../../core/services/common/cp-localstorage.service";
import { CpBaseComponent } from "../../common/cp-base/cp-base.component";
import { RecipeCategoryEditComponent } from "./r-category-edit/r-category-edit.component";
import { RecipeCategoryListComponent } from "./r-category-list/r-category-list.component";
import * as _ from 'lodash';
import { CategoriesComponent } from "../../tutorials/my-recipes/categories/categories.component";

export interface RecipeCategorySelectOptions {
    basic?:boolean;
    canCreate?:boolean;
    canUpdate?:boolean;
    inputName?: string;
    exclude:number[];
    showLabel?:boolean;
    type?:string;
}

@Component({
    selector: 'm-r-category-select',
    templateUrl: './recipe-category-select.component.html',
    styleUrls: ['./recipe-category-select.component.scss']
  })
export class RecipeCategorySelectComponent extends CpBaseComponent implements OnInit, OnChanges {

    @Input() options: RecipeCategorySelectOptions = {
        basic: false,
        canCreate: true,
        canUpdate: true,
        inputName: 'recipeCategory',
        exclude: [],
        showLabel: true
    };
    @Input() form:FormGroup;
    @Input() disabled:boolean;
    @Input() categories:any[];
    lastCategory:RecipeCategory;
    user:User;
    canCreate:boolean;
    canUpdate:boolean;
    inputName:string;
    showLabel:boolean;

    constructor(_cdr: ChangeDetectorRef, _loading: CpLoadingService, private dialog: MatDialog, private _localStorage: CpLocalStorageService, private recipeService: RecipeService) {
        super(_loading, _cdr);
        this.user = this._localStorage.getLoggedUser();
    }

    ngOnInit() {
        this.canCreate = (this.options && this.options.canCreate===false)?false:true;
        this.canUpdate = (this.options && this.options.canUpdate===false)?false:true;
        this.inputName = (this.options && this.options.inputName)?this.options.inputName:'recipeCategory';
        this.showLabel = (this.options && this.options.showLabel===false)?false:true;

        this.recipeService.onCreateCategoryEvent().subscribe( (categories:RecipeCategory[]) => {

            if(_.isNil(this.options) || !_.isNil(this.options) && this.options.basic === false) {
                this.categories = categories;
            }

        } );

        //this.filterUnits();

        this.lastCategory = this.form.get(this.inputName).value;
    }

    ngOnChanges(changes: SimpleChanges) {

        try {

            if(changes.categories && changes.categories.firstChange == false ) {

                //this.filterUnits();

            }

        }
        catch(e) {
            console.warn(e.message);
        }
    }

    onChange(ev:any) {

        let item:any = this.form.get(this.inputName).value;

        switch(Number.parseInt(item)) {
            case -2:
                this.openList();
              break;
            case -1:
                this.openCreate();
              break;
            default:
                this.lastCategory = this.form.get(this.inputName)!=null?Object.assign(this.form.get(this.inputName).value):null;
        }

    }

    private openCreate() {

        let createCategoryModal = this.dialog.open(RecipeCategoryEditComponent, {
            data: {
              category: null,
              categories: this.categories,
              user: this.user,
              type: this.options.type
            },
            panelClass: 'custom-modalbox'
        });

        createCategoryModal.afterClosed().subscribe( (response:any) => {

            if(!response) {

                this.form.patchValue( {
                    recipeCategory: this.lastCategory
                });

                this.onChangeComponent();

                return;
            }

            if(response.event == 'create') {
                this.categories.push(response.category);

                this.form.get(this.inputName).setValue(response.category);

                this.lastCategory = response.category;

                this.recipeService.onCreateCategoryEvent().emit(this.categories);

                this.onChangeComponent();

                return;

            }

            this.form.patchValue( {
                recipeCategory: this.lastCategory
            });

            this.onChangeComponent();

        });

    }

    private openList() {

        let listCategoryModal = this.dialog.open(RecipeCategoryListComponent, {
            data: {
              category: this.lastCategory,
              categories: this.categories,
              user: this.user
            },
            panelClass: 'custom-modalbox'
        });

        listCategoryModal.afterClosed().subscribe( (response:any) => {

            if(response && response.categories) {
                this.categories = response.categories;
            }

            // if(this.purchasePrice) {
            //     this.form.patchValue({
            //         purchasePrice: {
            //             unit: this.lastUnit
            //         }
            //     });
            // }
            //else {
                this.form.patchValue( {
                    recipeCategory: this.lastCategory
                } );
            //}

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
				categories: CategoriesComponent
			}

			const dialogComponent = optionsDialog[type];
			this.dialog.open(dialogComponent, dialogConfig);
		}

}

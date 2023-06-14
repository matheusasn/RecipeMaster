import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { ApiResponse } from '../../../../../../core/models/api-response';
import { RecipeCategory } from '../../../../../../core/models/business/recipecategory';
import { User } from '../../../../../../core/models/user';
import { RecipeService } from '../../../../../../core/services/business/recipe.service';
import { RecipeCategoryEditComponent } from '../../../../components/recipe-category/r-category-edit/r-category-edit.component';
import * as _ from 'lodash';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'm-recipes-categories-tags',
  templateUrl: './recipes-categories-tags.component.html',
  styleUrls: ['./recipes-categories-tags.component.scss']
})
export class RecipesCategoriesTagsComponent implements OnInit {

	@Output() choosedCategory  = new EventEmitter();
	@Output() getCategoria  = new EventEmitter();
	@Output() listUpdated  = new EventEmitter();

	@Input() categories;
	@Input() user: User;
	@Input() recipeListSize: number;
	@Input() canCreate: boolean = true;

	catEscolhido = -1;
	timeoutHandler;
	isScrollingCategories = false;

	@ViewChild('nav', {read: DragScrollComponent}) ds: DragScrollComponent;


  constructor(
		private toaster: ToastrService,
		private dialog: MatDialog,
		private _service: RecipeService,
	) { }

  ngOnInit() {
		this.choosedCategory.subscribe((value) => {
			this.catEscolhido = value;
		})
  }

	get screenWidth() {
		return +window.innerWidth
	}

	public handleDragStart(autoStop) {
		this.isScrollingCategories = true
		if (autoStop) {
			setTimeout(() => this.isScrollingCategories = false, 300)
		}
	}

	public handleDragEnd() {
		setTimeout(() => this.isScrollingCategories = false, 300)
	}

  public mouseup(id) {
		setTimeout(() => {
			if (!this.isScrollingCategories) {
				if (this.timeoutHandler && +window.innerWidth > 768) {
					this.choosedCategory.emit(id);
					this.getCategoria.emit();
					clearTimeout(this.timeoutHandler);
					this.timeoutHandler = null;
				}
			}
		}, 100)
  }

	public touchend(id) {
		setTimeout(() => {
			if (!this.isScrollingCategories) {
				if (this.timeoutHandler && +window.innerWidth < 768) {
					this.choosedCategory.emit(id);
					this.getCategoria.emit();
					clearTimeout(this.timeoutHandler);
					this.timeoutHandler = null;
				}
			}
		}, 200)
	}

	public touchstart(id) {
		setTimeout(() => {
			if (!this.isScrollingCategories) {
				if (+window.innerWidth < 768) {
					this.timeoutHandler = setTimeout(() => {
						this.timeoutHandler = null;
						document.getElementById(`menu${id}`).click();
					}, 500);
				}
			}
		}, 200)
	}

  public mousedown(id) {
		setTimeout(() => {
			if (!this.isScrollingCategories) {
				if (+window.innerWidth > 768) {
					this.timeoutHandler = setTimeout(() => {
						document.getElementById(`menu${id}`).click();
						this.timeoutHandler = null;
					}, 500);
				}
			}
		}, 100)
  }

	public openCreateCategory(category) {
		let createCategoryModal = this.dialog.open(RecipeCategoryEditComponent, {
				data: {
					category,
					categories: this.categories,
					user: this.user,
				},
				panelClass: 'custom-modalbox'
		});

		createCategoryModal.afterClosed().subscribe( (response:any) => {
			if (response) {
				if (response.event == 'create') {
					this.categories.push(response.category);
				} else {
					let c = _.find(this.categories, { id: category.id });
					Object.assign(c, response.category);
				}
			}
			this.listUpdated.emit(this.categories);
		});
	}

	defaultSelected() {
		this.choosedCategory.emit(-1);
		this.getCategoria.emit();
	}

	async deleteCategory(item:RecipeCategory) {
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
				this._service.deleteCategory(this.user.id, item.id).subscribe( (response:ApiResponse) => {
					this.categories = this.categories.filter(c => c.id !== item.id);
					this.toaster.success("Categoria removida com sucesso.");
					this.listUpdated.emit(this.categories);
				});
			}
		});

	}

}

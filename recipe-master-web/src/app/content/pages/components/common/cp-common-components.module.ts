import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from "@angular/common";
import { CpIngredientHistoryItemComponent } from "../cp-ingredient-history-item/cp-ingredient-history-item.component";
import { CpMenuRecipeItemComponent } from "../cp-menu-recipe-item/cp-menu-recipe-item.component";
import { CpNutritionalInfoItemComponent } from "../cp-nutritional-info-item/cp-nutritional-info-item.component";
import { CpNutritionalInfoListComponent } from "../cp-nutritional-info-list/cp-nutritional-info-list.component";
import { CpRecipeIngredientsItemComponent } from "../cp-recipe-ingredients-item/cp-recipe-ingredients-item.component";
import { UnitinfoModule } from "../unitinfo/unitinfo.module";
import { CpLoadingComponent } from "./loading/cp-loading.component";
import { CpIngredientSearchComponent } from "../cp-ingredient-search/cp-ingredient-search.component";
import {
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatTooltipModule,
	MatCheckboxModule,
	MatTabsModule,
	MatButtonModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { FileUploadModule } from "ng2-file-upload";
import { NgxFileDropModule } from "ngx-file-drop";
import { RecipeImageCropComponent } from "../recipe-image-crop/recipe-image-crop.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { AngularCropperjsModule } from "angular-cropperjs";
import { CpCustomCardComponent } from "./custom-card/cp-custom-card.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { LayoutModule } from "../../../layout/layout.module";
import { CpInternDragDropComponent } from "./custom-card/cp-intern-drag-drop/cp-intern-drag-drop.component";
import { RecipeReportModule } from "../../../../core/report/recipe/recipereport.module";
import { ConfirmationService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatMenuModule } from "@angular/material/menu";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ShareModalComponent } from "../share-modal/share-modal.component";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { RouterModule } from "@angular/router";
import { ProfileInfoPipe } from "../../../../pipes/profile-info.pipe";
import { NotificationModalComponent } from "../notification-modal/notification-modal.component";
import { TutorialCardComponent } from "../tutorial-card/tutorial-card.component";
import { TutorialIframeComponent } from "../tutorial-iframe/tutorial-iframe.component";
import { TutorialIframePopupComponent } from "../tutorial-iframe-popup/tutorial-iframe-popup.component";
import { MigrationStatusComponent } from "../migration-status/migration-status.component";
import { PhotoUploadModule } from "../photo-upload/photo-upload.module";
import { PdfModule } from "../pdf/pdf.module";
import {
	CpIngredientCurrentPriceComponent,
	DialogUpdateIngredientDialog,
	DialogHistoryIngredientDialog,
} from "../cp-ingredient-current-price/cp-ingredient-current-price.component";
import { CpIngredientLabelComponent } from "../cp-ingredient-label/cp-ingredient-label.component";
import { SharedPipesModule } from "../../../../pipes/shared-pipes.module";
import { RecipeCategorySelectComponent } from "../recipe-category/recipe-category.component";
import { RecipeCategoryListComponent } from "../recipe-category/r-category-list/r-category-list.component";
import { RecipeCategoryEditComponent } from "../recipe-category/r-category-edit/r-category-edit.component";
import { DialogDefaultComponent } from "./dialog-default/dialog-default.component";
import { CpPreventDoubleClick } from "./prevent-double-click/prevent-double-click.component";
import { TabDirective } from "./tab/tab.component";
import { ModalLoadingComponent } from "./modal-loading/modal-loading.component";
import { ModalFixedCostsComponent } from "../recipe-costs/modal-fixed-costs/modal-fixed-costs.component";
import { ModalVariableCostsComponent } from "../recipe-costs/modal-variable-costs/modal-variable-costs.component";
import { ModalCostsEditComponent } from "../recipe-costs/modal-costs-edit/modal-costs-edit.component";
import { ModalFixedCostsFormComponent } from '../recipe-costs/modal-fixed-costs-form/modal-fixed-costs-form.component'
import { TutorialsModule } from "../../tutorials/tutorials.module";
import { CategoriesComponent } from "../../tutorials/my-recipes/categories/categories.component";

@NgModule({
	declarations: [
		TabDirective,
		CpPreventDoubleClick,
		CpLoadingComponent,
		CpIngredientSearchComponent,
		RecipeImageCropComponent,
		CpCustomCardComponent,
		CpInternDragDropComponent,
		ShareModalComponent,
		ProfileInfoPipe,
		NotificationModalComponent,
		TutorialCardComponent,
		TutorialIframeComponent,
		TutorialIframePopupComponent,
		MigrationStatusComponent,
		CpIngredientCurrentPriceComponent,
		CpIngredientLabelComponent,
		DialogUpdateIngredientDialog,
		DialogHistoryIngredientDialog,
		CpNutritionalInfoItemComponent,
		CpNutritionalInfoListComponent,
		CpIngredientHistoryItemComponent,
		CpMenuRecipeItemComponent,
		CpRecipeIngredientsItemComponent,
		RecipeCategorySelectComponent,
		RecipeCategoryListComponent,
		RecipeCategoryEditComponent,
		DialogDefaultComponent,
		ModalFixedCostsComponent,
		ModalVariableCostsComponent,
		ModalCostsEditComponent,
		ModalFixedCostsFormComponent,
	],
	imports: [
		NgxSpinnerModule,
		CommonModule,
		LayoutModule,
		MatIconModule,
		MatListModule,
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule.forChild(),
		FileUploadModule,
		NgxFileDropModule,
		ImageCropperModule,
		AngularCropperjsModule,
		DragDropModule,
		MatTooltipModule,
		RecipeReportModule,
		CheckboxModule,
		DialogModule,
		ButtonModule,
		InfiniteScrollModule,
		MatMenuModule,
		SweetAlert2Module.forRoot(),
		MatCheckboxModule,
		PDFExportModule,
		RouterModule,
		PhotoUploadModule,
		PdfModule,
		UnitinfoModule,
		CurrencyMaskModule,
		SharedPipesModule,
		MatTabsModule,
		MatButtonModule,
		TutorialsModule
	],
	exports: [
		TabDirective,
		CpPreventDoubleClick,
		CpLoadingComponent,
		CpIngredientSearchComponent,
		RecipeImageCropComponent,
		CpCustomCardComponent,
		CpInternDragDropComponent,
		ShareModalComponent,
		ProfileInfoPipe,
		NotificationModalComponent,
		TutorialCardComponent,
		TutorialIframeComponent,
		TutorialIframePopupComponent,
		MigrationStatusComponent,
		CpIngredientCurrentPriceComponent,
		CpIngredientLabelComponent,
		DialogUpdateIngredientDialog,
		DialogHistoryIngredientDialog,
		CpNutritionalInfoItemComponent,
		CpNutritionalInfoListComponent,
		CpIngredientHistoryItemComponent,
		CpMenuRecipeItemComponent,
		CpRecipeIngredientsItemComponent,
		SharedPipesModule,
		RecipeCategorySelectComponent,
		RecipeCategoryListComponent,
		RecipeCategoryEditComponent,
		DialogDefaultComponent
	],
	providers: [ConfirmationService],
	entryComponents: [
		RecipeImageCropComponent,
		ShareModalComponent,
		NotificationModalComponent,
		TutorialIframeComponent,
		TutorialIframePopupComponent,
		MigrationStatusComponent,
		DialogUpdateIngredientDialog,
		DialogHistoryIngredientDialog,
		RecipeCategorySelectComponent,
		RecipeCategoryListComponent,
		RecipeCategoryEditComponent,
		ModalFixedCostsComponent,
		ModalVariableCostsComponent,
		ModalCostsEditComponent,
		ModalFixedCostsFormComponent,
		CategoriesComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CPCommonComponentsModule {}

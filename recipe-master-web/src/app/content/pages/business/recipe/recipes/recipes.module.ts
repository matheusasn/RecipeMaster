import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent } from './recipes.component';
import { Routes, RouterModule } from '@angular/router';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';
import { LayoutModule } from '../../../../layout/layout.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatListModule, MatCardModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule, MatMenuModule, MatButtonModule } from '@angular/material';
import { CPCommonComponentsModule } from '../../../components/common/cp-common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdsenseModule } from 'ng2-adsense';
import { PdfModule } from '../../../components/pdf/pdf.module';
import { PhotoUploadModule } from '../../../components/photo-upload/photo-upload.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { RecipesCategoriesTagsModule } from './recipes-categories-tags/recipes-categories-tags.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { TutorialsModule } from '../../../tutorials/tutorials.module';
import { ReadyRecipesComponent } from '../../../tutorials/my-recipes/ready-recipes/ready-recipes.component';
import { DialogRecipeComponent } from '../../../tutorials/recipe/dialog-recipe/dialog-recipe.component';
import { DialogMyRecipesDatasheetComponent } from '../../../tutorials/my-recipes/dialog-my-recipes-datasheet/dialog-my-recipes-datasheet.component';
import { DialogMyRecipesRecipeInsideRecipeComponent } from '../../../tutorials/my-recipes/dialog-my-recipes-recipe-inside-recipe/dialog-my-recipes-recipe-inside-recipe.component';

const routes: Routes = [
	{
		path: '',
		component: RecipesComponent
	}
];

@NgModule({
	imports: [
		MatMenuModule,
		MatRadioModule,
		MatChipsModule,
		NgbModule,
		FormsModule,
		CommonModule,
		MetronicCoreModule,
		LayoutModule,
		PartialsModule,
		AngularEditorModule,
		MatListModule,
		MatCardModule,
		MatDividerModule,
		MatIconModule,
		NgbPaginationModule,
		PdfModule,
		CPCommonComponentsModule,
		PhotoUploadModule,
		RouterModule.forChild(routes),
		TranslateModule.forChild(),
		MatProgressSpinnerModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-7000897604640151',
			adSlot: 4439575095,
		}),
		DragScrollModule,
		RecipesCategoriesTagsModule,
		MatButtonModule,
		TutorialsModule
	],
	declarations: [
		RecipesComponent,
	],
	exports: [
		RecipesComponent
	],
	bootstrap: [
		RecipesComponent
	],
	entryComponents: [
		ReadyRecipesComponent,
		DialogMyRecipesDatasheetComponent,
		DialogMyRecipesRecipeInsideRecipeComponent
	]
})
export class RecipesModule { }

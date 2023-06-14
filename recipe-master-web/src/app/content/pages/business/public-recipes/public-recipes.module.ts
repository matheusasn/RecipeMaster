import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatListModule, MatCardModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule, MatMenuModule, MatCheckboxModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdsenseModule } from 'ng2-adsense';
import { DragScrollModule } from 'ngx-drag-scroll';
import { PublicRecipesComponent } from './public-recipes.component';
import { MetronicCoreModule } from '../../../../core/metronic/metronic-core.module';
import { LayoutModule } from '../../../layout/layout.module';
import { PartialsModule } from '../../../partials/partials.module';
import { RecipesCategoriesTagsComponent } from '../recipe/recipes/recipes-categories-tags/recipes-categories-tags.component';
import { CPCommonComponentsModule } from '../../components/common/cp-common-components.module';
import { CpCustomDragScrollModule } from '../../components/cp-custom-drag-scroll/cp-custom-drag-scroll.module';
import { PublicRecipesCarouselComponent } from './public-recipes-carousel/public-recipes-carousel.component';
import { RecipesCategoriesTagsModule } from '../recipe/recipes/recipes-categories-tags/recipes-categories-tags.module';

const routes: Routes = [
  {
    path: '',
    component: PublicRecipesComponent
  }
];

@NgModule({
  imports: [
			MatMenuModule,
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
			CPCommonComponentsModule,
			MatCheckboxModule,
			RouterModule.forChild(routes),
			TranslateModule.forChild(),
			MatProgressSpinnerModule,
			AdsenseModule.forRoot({
				adClient: 'ca-pub-7000897604640151',
				adSlot: 4439575095,
			}),
			DragScrollModule,
			CpCustomDragScrollModule,
			RecipesCategoriesTagsModule
		],
		declarations: [
			PublicRecipesComponent,
			PublicRecipesCarouselComponent
  	],
		exports: [
			PublicRecipesComponent,
		],
   	bootstrap: [
	  	PublicRecipesComponent,
  	],
   	entryComponents: [
   ]
})
export class PublicRecipesModule { }

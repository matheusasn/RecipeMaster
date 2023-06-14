import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule, MatMenuModule } from "@angular/material";
import { TranslateModule } from "@ngx-translate/core";
import { DragScrollModule } from "ngx-drag-scroll";
import { RecipesCategoriesTagsComponent } from "./recipes-categories-tags.component";

@NgModule({
	imports: [
		CommonModule,
		MatMenuModule,
		MatIconModule,
		DragScrollModule,
		TranslateModule
	],
	declarations: [
		RecipesCategoriesTagsComponent
	],
	exports: [
		RecipesCategoriesTagsComponent
	]
})
export class RecipesCategoriesTagsModule {

}

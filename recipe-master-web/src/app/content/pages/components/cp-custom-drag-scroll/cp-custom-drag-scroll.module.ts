import { NgModule } from "@angular/core";
import { CpCustomDragScrollItemDirective } from "./cp-custom-drag-scroll-item";
import { CpCustomDragScrollComponent } from "./cp-custom-drag-scroll.component";

@NgModule({
	exports: [
		CpCustomDragScrollComponent,
		CpCustomDragScrollItemDirective
	],
	declarations: [
		CpCustomDragScrollComponent,
		CpCustomDragScrollItemDirective
	]
})
export class CpCustomDragScrollModule {  }

import { CPCommonComponentsModule } from './../../../components/common/cp-common-components.module';
import { NgModule }                                                                                               from "@angular/core";
import { MetronicCoreModule }                                                                                     from "../../../../../core/metronic/metronic-core.module";
import { PartialsModule }                                                                                         from "../../../../partials/partials.module";
import { AngularEditorModule }                                                                                    from "@kolkov/angular-editor";
import { MatIconModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatOptionModule, MatSelectModule } from "@angular/material";
import { LayoutModule }                                                                                           from "../../../../layout/layout.module";
import { Routes, RouterModule }                                                                                   from "@angular/router";
import { CommonModule }                                                                                           from "@angular/common";
import { CommonServiceModule }                                                                                    from "../../../../../core/services/common/common-service.module";
import { ReactiveFormsModule }                                                                                    from "@angular/forms";
import { TranslateModule }                                                                                        from "@ngx-translate/core";
import { IngredientFormComponent }                                                                                from './ingredient-form.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const routes: Routes = [
	{
		path: '',
		component: IngredientFormComponent
	},

];

@NgModule({
	imports: [
		CommonModule,
		MetronicCoreModule,
		LayoutModule,
		PartialsModule,
		AngularEditorModule,
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatIconModule,
		MatOptionModule,
		MatSelectModule,
		ReactiveFormsModule,
		CommonServiceModule,
		ReactiveFormsModule,
		CPCommonComponentsModule,
		CurrencyMaskModule,
		TranslateModule.forChild(),
		RouterModule.forChild(routes)
	],
	declarations: [
		IngredientFormComponent
	]
})
export class IngredientFormModule { }

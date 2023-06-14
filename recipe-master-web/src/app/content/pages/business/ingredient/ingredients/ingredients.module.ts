import { NgModule } from "@angular/core";
import { IngredientModule } from '../ingredient/ingredient.module';
import { IngredientsComponent } from "./ingredients.component";
import { CommonModule } from "@angular/common";
import { MetronicCoreModule } from "../../../../../core/metronic/metronic-core.module";
import { LayoutModule } from "../../../../layout/layout.module";
import { PartialsModule } from "../../../../partials/partials.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { MatListModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule } from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { CPCommonComponentsModule } from "../../../components/common/cp-common-components.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgbPagination, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from '@angular/material';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { FormsModule } from "@angular/forms";
import { PdfModule } from "../../../components/pdf/pdf.module";
import { DialogIngredientsComponent } from "../../../tutorials/ingredients/dialog-ingredients/dialog-ingredients.component";
import { DialogIngredientsUsedComponent } from "../../../tutorials/ingredients/dialog-ingredients-used/dialog-ingredients-used.component";

const routes: Routes = [
    {
        path: '',
        component: IngredientsComponent
    }
];

@NgModule({
    imports: [
        CurrencyMaskModule,
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
				MatButtonModule,
        NgbPaginationModule,
        MatTabsModule,
        CPCommonComponentsModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        PdfModule,
        IngredientModule
    ],
    declarations: [
        IngredientsComponent
    ],
		entryComponents: [
			DialogIngredientsComponent,
			DialogIngredientsUsedComponent
		]
})
export class IngredientsModule { }

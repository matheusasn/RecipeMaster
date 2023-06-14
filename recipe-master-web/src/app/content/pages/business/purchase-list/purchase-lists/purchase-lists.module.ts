import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';
import { LayoutModule } from '../../../../layout/layout.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatListModule, MatCardModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { CPCommonComponentsModule } from '../../../components/common/cp-common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdsenseModule } from 'ng2-adsense';

import { PurchaseListsComponent } from './purchase-lists.component';
import { AuthGuard } from '../../../../../core/auth/auth.guard';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { UnitinfoModule } from '../../../components/unitinfo/unitinfo.module';

const routes: Routes = [
    {
        path: '',
        component: PurchaseListsComponent, 
        canActivate: [ AuthGuard ],
        data: {
          access: [PerfilEnum.USER_BETA]
        }
    }
];

@NgModule({
    imports: [
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
      RouterModule.forChild(routes),
      TranslateModule.forChild(),
      MatProgressSpinnerModule,
      AdsenseModule.forRoot({
          adClient: 'ca-pub-7000897604640151',
          adSlot: 4439575095,
      }),
      UnitinfoModule
    ],
    declarations: [
      PurchaseListsComponent
    ],
    exports: [
        PurchaseListsComponent
    ],
     bootstrap: [
        PurchaseListsComponent
     ],
     entryComponents: [
     ]
  })
export class PurchaseListsModule { }
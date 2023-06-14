import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageDiscountComponent } from './page-discount/page-discount.component';
import { PagePixComponent } from './page-pix/page-pix.component';
import { PlanoAssinaturaComponent } from "./plano-assinatura.component";
import { CouponComponent } from "./coupon/coupon.component";
import { AuthGuard } from "../../../../core/auth/auth.guard";
import { TranslateService } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '', children: [

            // {
            //     path: '',
            //     redirectTo: 'plans'
            // },
            {
                path: '',
                component: PlanoAssinaturaComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'coupon',
                component: CouponComponent,
                canActivate: [ AuthGuard ]
            },
		    {
			    path: 'pix',
			    component: PagePixComponent,
			    canActivate: [ AuthGuard ]
		    },
		    {
			    path: 'discount',
			    component: PageDiscountComponent,
			    canActivate: [ AuthGuard ]
		    }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanoAssinaturaRoutingModule { }

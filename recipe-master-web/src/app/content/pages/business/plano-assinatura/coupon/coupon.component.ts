import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { PagSeguroService } from '../../../../../core/services/business/pagseguro-service';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';

@Component({
  selector: 'm-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent extends CpBaseComponent implements OnInit {

  perfil: PerfilEnum;
  PerfilEnum = PerfilEnum;
  loading:boolean = true;
  isPaypal:boolean = false;
  plans:any;

  constructor(_cdr: ChangeDetectorRef, _loading: CpLoadingService, private router: Router, private planService: PlanService, private toaster:ToastrService) {
    super(_loading, _cdr);

    this.planService.isPaypal().subscribe( (response) => {

        this.isPaypal = response;
        this.loading = false;

        this.definePlans();

        try {
            this._cdr.detectChanges();
        }
        catch(e) {
            console.warn(e.message);
        }

    }, err => {
        this.loading = false;

        this.definePlans();

        try {
            this._cdr.detectChanges();
        }
        catch(e) {
            console.warn(e.message);
        }

    } );

  }

  ngOnInit() {
  }

  definePlans() {

    if(this.isPaypal) {
        this.plans = environment.plans.paypal;
    }
    else {
        this.plans = environment.plans.pagseguro;
    }

    try {
      let promotionalPlan:any = this.plans.pro_nutri_promocional;

      if(moment().isAfter(moment(promotionalPlan.expirationAt))) {
        this.toaster.info("Cupom de desconto expirado. Fique atento a novas promoções!");
        this.router.navigate([CpRoutes.RECIPES]);
      }

    }
    catch(e) {
      console.warn(e);
    }

  }

}

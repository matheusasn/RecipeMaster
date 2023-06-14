import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { environment } from '../../../../../../environments/environment';
import { UserService } from '../../../../../core/auth/user.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { User } from '../../../../../core/models/user';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';

@Component({
	selector: 'm-page-discount',
	templateUrl: './page-discount.component.html',
	styleUrls: ['./page-discount.component.scss']
})
export class PageDiscountComponent extends CpBaseComponent implements OnInit {

	perfil: PerfilEnum;
	PerfilEnum = PerfilEnum;
	loading: boolean = true;
	isPaypal: boolean = false;
	plans: any;
	fbDiscount: boolean = true;
	user: User;

	constructor(_cdr: ChangeDetectorRef,
    _loading: CpLoadingService,
		private planService: PlanService,
			private _localStorage: CpLocalStorageService,
			private userService: UserService) {
		super(_loading, _cdr);

    this.planService.isPaypal().subscribe((response) => {
			this.isPaypal = response;
			this.loading = false;
			const storageUser = this._localStorage.getLoggedUser();
			this.userService.findById(storageUser.id).subscribe((response:ApiResponse) => {
				this.user = response.data;
				this.definePlans();
				this.onChangeComponent();
			})
		}, err => {
			this.loading = false;
			this.definePlans();
		});
	}

	ngOnInit() {
		this.loading = false;
	}

	definePlans() {
    if (this.isPaypal) {
			this.plans = environment.plans.paypal;
		} else {
			this.plans = environment.plans.mercadopago;
		}
	}

}

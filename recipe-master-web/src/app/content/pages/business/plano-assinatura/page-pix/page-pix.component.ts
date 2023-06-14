import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../../../environments/environment';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { User } from '../../../../../core/models/user';

@Component({
	selector: 'm-page-pix',
	templateUrl: './page-pix.component.html',
	styleUrls: ['./page-pix.component.scss']
})
export class PagePixComponent implements OnInit {

	perfil: PerfilEnum;
	PerfilEnum = PerfilEnum;
	loading: boolean = true;
	isPaypal: boolean = false;
	plans: any;
	fbDiscount: boolean = true;
	user: User;
	hasDiscount: boolean = false;

	constructor(private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
			this.hasDiscount = params['discount']
		})
	}

	ngOnInit() {
		this.loading = false;
		this.definePlans();
	}

	definePlans() {
		this.plans = environment.plans.mercadopago;
	}

}

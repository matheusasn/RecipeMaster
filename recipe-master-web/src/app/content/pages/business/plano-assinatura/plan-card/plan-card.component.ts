import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import * as _ from 'lodash';
import { User } from '../../../../../core/models/user';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';

@Component({
  selector: 'm-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit {

  PerfilEnum = PerfilEnum;

  @Input() plan:PlanOption;
  @Input() discountPlan:PlanOption;
  @Input() perfil:PerfilEnum;
  @Input() image:string = 'assets/app/media/img/plano-assinatura/img2.png';
  @Input() isPaypal:boolean = false;
  @Input() title:string;
  @Input() highlight:boolean = false;
  @Input() buttonLabel:string;
  @Input() description:string;
  @Input() imagePrice:string;
  @Input() isPix: boolean;
  @Input() hasDiscount: boolean;
	@Input() user: User;
	@Input() isBigger: boolean;
	@Input() pixQrCodeImage:string;
	@Input() pixQrCodeDiscountImage:string;

	mobilePaymentCurrency: string = null;

  constructor(private _localStorage: CpLocalStorageService) {
	}

  ngOnInit() {
		if (this.isAndroid) {
			// @ts-ignore
			const plans = JSON.parse(Android.getAllPlans())
			const currency = plans
				.find(plan => plan.productId === 'cp001').price;

			if (currency) {
				this.mobilePaymentCurrency = currency.match(/[^\d,]/g).join('').trim();
				console.log('Price no Android', currency);
				console.log('Currency no Android', this.mobilePaymentCurrency);
			}
		} else if (this.isIOS) {
			const appleData = this._localStorage.getAppleData();

			const parsed = JSON.parse(appleData);

			const { availableProducts } = parsed;

			const currency = availableProducts
				.filter(plan => plan.productId.includes('com.app.recipemasterapp'))[0].price;

			if (currency) {
				this.mobilePaymentCurrency = currency
					.replace('.', ',')
					.match(/[^\d,]/g).join('').trim();
				console.log('Price no iOS', currency);
				console.log('Currency no iOS', this.mobilePaymentCurrency);
			}
		}

	}

	get isMobile() {
		return this.isIOS || this.isAndroid
	}

	get isIOS() {
		return this._localStorage.isIOS();
	}

	get isAndroid() {
		// @ts-ignore
		return typeof(Android) != "undefined";
	}

	get showDifferenceMessage() {
		if (this.user) {
			const userPerfil = this.user.plan.perfil;
			if (userPerfil === PerfilEnum.USER_PRO) {
				if (this.perfil === PerfilEnum.USER_PRO_NUTRI) {
					return true;
				}
			}

			if (userPerfil === PerfilEnum.USER_BASIC) {
				if (this.perfil === PerfilEnum.USER_PRO || this.perfil === PerfilEnum.USER_PRO_NUTRI) {
					return true;
				}
			}
		}
		return false
	}

	getAmount(value) {
		return String(value).split('.')[0]
	}

	getCents(value) {
		let cents = (String(value).split('.')[1])
		if (!cents) return '00';
		cents = _.padEnd(cents, 2, '0');
		return cents;
	}

	addOneYear(date) {
		var d = new Date(date);
		d.setFullYear(d.getFullYear() + 1)
		return d
	}

}

export interface PlanOption {
  description: string;
  currency: string;
  values: {
      monthly: number;
      annually: number;
      annually_50off?: number;
  },
  expirationAt?: string;
	googlePlayId?: string;
	appleStoreId?: string;
}

@Component({
  template: '<iframe *ngIf="url" [src]="url"></iframe>',
  styleUrls: ['./plan-card.component.scss']
})
export class ModalMercadoPagoComponent {

  url:SafeUrl;

  constructor( @Inject(MAT_DIALOG_DATA) private data:{url:string}, private sanitizer:DomSanitizer ) {

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);

  }

}

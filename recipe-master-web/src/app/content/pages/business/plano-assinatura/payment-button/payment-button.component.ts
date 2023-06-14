import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Perfil, PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { environment } from '../../../../../../environments/environment';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { PaymentAPI } from '../../../../../core/models/business/payment-api';
import { Plan, PaypalStatus } from '../../../../../core/models/business/plan';
import { ApiResponse } from '../../../../../core/models/api-response';
import { PlanOption } from '../plan-card/plan-card.component';
import { MercadopagoService, PreferenceItemDTO } from '../../../../../core/services/business/mercadopago.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/auth/user.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messages } from '../../../../../core/constants/messages';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SpinnerButtonOptions } from '../../../../partials/content/general/spinner-button/button-options.interface';

declare var paypal;

@Component({
  selector: 'm-payment-button',
  templateUrl: './payment-button.component.html',
  styleUrls: ['./payment-button.component.scss']
})
export class PaymentButtonComponent implements OnInit {

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false,
		mode: "indeterminate"
	};

    @Input() perfil: PerfilEnum;
    @Input() label: string;
    @Input() customClass: string = 'btn';
    @Input() isPaypal:boolean = false;
    @Input() coupon:boolean = false;
    @Input() plan: PlanOption;
    @Input() discountPlan: PlanOption;
		@Input() user: User;
		@Input() mobilePaymentCurrency: string;

    @ViewChild('paypal') paypalBtn: ElementRef;

		isCurrentPlan: boolean = false;
		showUpgradeButton: boolean = false;
		hideButton: boolean = false;

    constructor(
			private mpService: MercadopagoService,
			private planService: PlanService,
			private _cpLocalStorageService:CpLocalStorageService,
			private _toast: ToastrService,
			private _router: Router,
			private userService: UserService,
			private deviceDetectorService: DeviceDetectorService) {
			}

    ngOnInit() {
			const userData = this.user;
			if (userData && userData.plan) {
				const userPerfil = userData.plan.perfil
				if (userPerfil === this.perfil) {
					// show current plan
					this.isCurrentPlan = true;
				} else {
					if (userPerfil === PerfilEnum.USER_BASIC) {
						if (this.perfil === PerfilEnum.USER_PRO || this.perfil === PerfilEnum.USER_PRO_NUTRI) {
							this.showUpgradeButton = true;
						}
					}

					if (userPerfil === PerfilEnum.USER_PRO) {
						if (this.perfil === PerfilEnum.USER_BASIC) {
							this.hideButton = true;
						} else if (this.perfil === PerfilEnum.USER_PRO_NUTRI) {
							this.showUpgradeButton = true;
						}
					}

					if (userPerfil === PerfilEnum.USER_PRO_NUTRI) {
						if (this.perfil === PerfilEnum.USER_BASIC || this.perfil === PerfilEnum.USER_PRO) {
							this.hideButton = true;
						}
					}
				}
			}
    }

    ngAfterViewInit() {
        if(this.isPaypal) {
            if(this.coupon===true) {
                this.plan = environment.plans.paypal.pro_nutri_promocional;
            }
            else {
							if (this.discountPlan) {
								if(this.perfil == PerfilEnum.USER_BASIC) {
									this.plan = environment.plans.paypal.basic_40off;
								}
								else if(this.perfil == PerfilEnum.USER_PRO) {
										this.plan = environment.plans.paypal.pro_40off;
								}
								else if(this.perfil == PerfilEnum.USER_PRO_NUTRI) {
										this.plan = environment.plans.paypal.pro_nutri_40off;
								}
							} else {
								if(this.perfil == PerfilEnum.USER_BASIC) {
										this.plan = environment.plans.paypal.basic;
								}
								else if(this.perfil == PerfilEnum.USER_PRO) {
										this.plan = environment.plans.paypal.pro;
								}
								else if(this.perfil == PerfilEnum.USER_PRO_NUTRI) {
										this.plan = environment.plans.paypal.pro_nutri;
								}
							}
            }
            this.createPaypalButton();
        }
    }

    doPagseguroCheckout() {
			this.checkout(this.perfil);
    }

    private checkout(perfil:PerfilEnum) {

			this.spinner.active = true;

			setTimeout(() => {
				this.spinner.active = false;
			}, 3000)

			let plan:PlanOption = this.getPlanByPerfil();

			if (this.user.plan && this.perfil === this.user.plan.perfil) {
				switch(this.perfil) {
					case PerfilEnum.USER_BASIC:
						plan = environment.plans.mercadopago.basic_40off;
						break;
					case PerfilEnum.USER_PRO:
						plan = environment.plans.mercadopago.pro_40off;
						break;
					case PerfilEnum.USER_PRO_NUTRI:
						plan = environment.plans.mercadopago.pro_nutri_40off;
						break;
					default:
						plan = environment.plans.mercadopago.basic_40off;
				}
			}

			let item:PreferenceItemDTO = {
				title: plan.description,
				quantity: 1,
				unitPrice: plan.values.annually,
				perfil: this.perfil
			};

			const iOSDevice = this._cpLocalStorageService.isIOS()

			// @ts-ignore
			if (typeof(Android) != "undefined") {
				this.handleAndroidPayment(plan.googlePlayId);
			} else if (iOSDevice) {
				const appleData = this._cpLocalStorageService.getAppleData();

				let bundleId = plan.appleStoreId

				if (appleData) {
					const parsed = JSON.parse(appleData);
					const { availableProducts } = parsed;

					if (availableProducts[0].productId.includes('global')) {
						bundleId = bundleId.replace("recipemasterapp.plan", "recipemasterapp.global.plan")
					}
				}

				console.log('Enviando para a ponte o seguinte bundleID: ', bundleId)
				// @ts-ignore
				window.webkit.messageHandlers.ios.postMessage({ productId: bundleId });
			} else {
				this.mpService.openCheckoutModal(item);
			}

    }

		get isIOS() {
			return this._cpLocalStorageService.isIOS()
		}

		get isAndroid() {
			// @ts-ignore
			return typeof(Android) != "undefined";
		}

		private handleAndroidPayment(googlePlayId: string) {
			const userEmail = this.user.email;
			// @ts-ignore
			Android.makePurchase(googlePlayId, userEmail, this.perfil);
		}

		private getPlanByPerfil():PlanOption {
			if (this.user && this.user.plan && this.plan) {
				return this.plan;
			}

			if (this.discountPlan) {
				if(!this.perfil) {
					return environment.plans.mercadopago.basic_40off;
				}

				switch(this.perfil) {
					case PerfilEnum.USER_BASIC:
						return environment.plans.mercadopago.basic_40off;
					case PerfilEnum.USER_PRO:
						return environment.plans.mercadopago.pro_40off;
					case PerfilEnum.USER_PRO_NUTRI:
						return environment.plans.mercadopago.pro_nutri_40off;
					default:
						return environment.plans.mercadopago.basic_40off;
				}
			} else {
				if(!this.perfil) {
					return environment.plans.mercadopago.basic;
				}

				switch(this.perfil) {
					case PerfilEnum.USER_BASIC:
						return environment.plans.mercadopago.basic;
					case PerfilEnum.USER_PRO:
						return environment.plans.mercadopago.pro;
					case PerfilEnum.USER_PRO_NUTRI:
						return environment.plans.mercadopago.pro_nutri;
					default:
						return environment.plans.mercadopago.basic;
				}
			}
		}

    private createPaypalButton() {
        paypal.Buttons({

            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        description: this.plan.description,
                        amount: {
                            currency_code: this.plan.currency,
                            value: this.plan.values.annually
                        }
                    }]
                });
            },

            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log(order);

                this.createPlan(order);

            },

            onError: err => {
                console.log(err);
            },

            style: {
                color: 'silver'
            }

        }).render(this.paypalBtn.nativeElement);

    }

    private createPlan(order:any) {

        let plan:Plan = {
            api: PaymentAPI.PAYPAL,
            perfil: this.perfil,
            paypalOrderId: order.id
        };

        if(order.status == 'COMPLETED') {
            plan.paypalOrderStatus = PaypalStatus.COMPLETED;
        }

        this.planService.createPlan(plan).subscribe( (response:ApiResponse) => {

            // this.planService.validatePlan().subscribe((r)=> console.log(`Plano existente e dentro da validade? ${r}`),err => console.log(err));
						if (order.status === 'COMPLETED') {
							this._toast.success('Payment successfully made!');
							this._router.navigate([CpRoutes.RECIPES]);
						}

        }, err => {
            console.log(err);
        });

    }

}

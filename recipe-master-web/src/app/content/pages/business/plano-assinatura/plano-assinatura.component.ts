import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PerfilEnum } from '../../../../core/models/security/perfil.enum';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { PlanService } from '../../../../core/services/business/plan.service';
import { environment } from '../../../../../environments/environment';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../core/models/user';
import * as moment from 'moment';
import { HandleAppleStorePaymentDTO, UserService } from '../../../../core/auth/user.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { TranslationService } from '../../../../core/metronic/services/translation.service';
import { SwiperOptions } from 'swiper';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogPlansComponent } from '../../tutorials/plans/dialog-plans/dialog-plans.component';

declare global {
	interface Window {
		handleAppleStorePayment: any;
	}
}

@Component({
  selector: 'm-plano-assinatura',
  templateUrl: './plano-assinatura.component.html',
  styleUrls: ['./plano-assinatura.component.scss']
})
export class PlanoAssinaturaComponent extends CpBaseComponent implements OnInit {

  perfil: PerfilEnum;
  PerfilEnum = PerfilEnum;
  loading: boolean = true;
  isPaypal: boolean = false;
  plans: any;
  fbDiscount: boolean = true;
  user: User;
  private _currentUser: User;
  canShowPix: boolean = false;
  cifrao: String = "R$";
	lang:String;

	config: SwiperOptions = {
		pagination: { el: '.swiper-pagination', clickable: true },
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		slidesPerView: 1.3,
		// spaceBetween: 15,
		centeredSlides: true,
		// centeredSlidesBounds: true,
		initialSlide: 1,
	};

  constructor(
  	_cdr: ChangeDetectorRef,
    _loading: CpLoadingService,
    private planService: PlanService,
    private _localStorage: CpLocalStorageService,
		private userService: UserService,
		private _translationService: TranslationService,
		private toast: ToastrService,
		private deviceDetectorService: DeviceDetectorService,
		private _dialog: MatDialog
  ) {
    super(_loading, _cdr);

	  this._translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});

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
    this.fillUser();
  }

	get screenWidth() {
		return +window.innerWidth
	}


  fillUser() {
		this._currentUser = this._localStorage.getLoggedUser();
		if (this._currentUser) {
			this.cifrao = this._localStorage.getCurrency();
		}
	}

  ngOnInit() {
		window.handleAppleStorePayment = (payload) => {
			console.log('[handleAppleStorePayment] Payload recebido no web app', payload)
			const { productIdentifier, transactionIdentifier } = payload

			const getPerfilEnum = (productIdentifier: string) => {
				if (productIdentifier === 'com.app.recipemasterapp.plan.basic') {
					return PerfilEnum.USER_BASIC;
				} else if (productIdentifier === 'com.app.recipemasterapp.plan.professional') {
					return PerfilEnum.USER_PRO;
				} else if (productIdentifier === 'com.app.recipemasterapp.plan.professional.nutri') {
					return PerfilEnum.USER_PRO_NUTRI;
				}
			}

			const dto: HandleAppleStorePaymentDTO = {
				productIdentifier,
				transactionIdentifier,
				userId: this._currentUser.id,
				perfil: getPerfilEnum(productIdentifier)
			}

			this.userService.handleAppleStorePayment(dto).subscribe(() => {
				window.location.reload();
			})
		}

    this.loading = false;
    this.definePlans();
    this.verifyCurrency(this.cifrao);
  }

	get isMobile() {
		return this.isAndroid || this.isIOS
	}

  verifyCurrency(currentCurrency){
    if(currentCurrency == "R$" && this.lang === 'pt'){
      this.canShowPix = true;
    }
  }

	get isAndroid() {
		// @ts-ignore
		return typeof(Android) != "undefined";
	}

	get isIOS() {
		return this._localStorage.isIOS()
	}

  definePlans() {
    if (this.isPaypal) {
			this.plans = environment.plans.paypal;
		} else {
			let pro = environment.plans.mercadopago.pro
			let proNutri = environment.plans.mercadopago.pro_nutri
			if (this.user && this.user.plan && !this.isMobile) {
				if (this.user.plan.perfil === PerfilEnum.USER_BASIC) {
					pro = {
						...pro,
						values: {
							annually: 60.90,
							monthly: 6.08
						}
					}
					proNutri = {
						...proNutri,
						values: {
							annually: 180.00,
							monthly: 17.97
						}
					}
				} else if (this.user.plan.perfil === PerfilEnum.USER_PRO) {
					proNutri = {
						...proNutri,
						values: {
							annually: 120.00,
							monthly: 11.98
						}
					}
				}
				this.plans = { basic: environment.plans.mercadopago.basic, pro, pro_nutri: proNutri }
			} else {
				if (this.isMobile) {
					if (this.isAndroid) {
						// @ts-ignore
						const allAndroidPlans = Android.getAllPlans();

						if (!allAndroidPlans) {
							this.plans = environment.plans.mercadopago;
							return;
						}

						const plans = JSON.parse(allAndroidPlans);

						if (plans.length === 0) {
							this.plans = environment.plans.mercadopago;
							return;
						}

						const basic = environment.plans.mercadopago.basic;
						const pro = environment.plans.mercadopago.pro;
						const proNutri = environment.plans.mercadopago.pro_nutri;

						const basicPrice = plans
							.find(plan => plan.productId === 'cp001').price_amount_micros / 1000000;

						const proPrice = plans
							.find(plan => plan.productId === 'cp002').price_amount_micros / 1000000;

						const proNutriPrice = plans
							.find(plan => plan.productId === 'cp003').price_amount_micros / 1000000;

						const toFixed = (num) => num.toFixed(3).slice(0,-1)

						this.plans = {
							basic: {
								...basic,
								values: {
									annually: basicPrice,
									monthly: toFixed(basicPrice/10)
								}
							},
							pro: {
								...pro,
								values: {
									annually: proPrice,
									monthly: toFixed(proPrice/10)
								}
							},
							pro_nutri: {
								...proNutri,
								values: {
									annually: proNutriPrice,
									monthly: toFixed(proNutriPrice/10)
								}
							}
						}

					} else if (this.isIOS) {
						const appleData = this._localStorage.getAppleData();
						console.log('Lendo dados dos planos do iOS', appleData);
						if (appleData) {
							const parsed = JSON.parse(appleData);
							const { availableProducts } = parsed;

							const basic = environment.plans.mercadopago.basic;
							const pro = environment.plans.mercadopago.pro;
							const proNutri = environment.plans.mercadopago.pro_nutri;

							const basicPrice = availableProducts
								.find(plan => plan.productId.includes('plan.basic')).price;

							const proPrice = availableProducts
								.find(plan => plan.productId.includes('plan.professional')).price;

							const proNutriPrice = availableProducts
								.find(plan => plan.productId.includes('professional.nutri')).price;

							const toFixed = (num) => num.toFixed(3).slice(0,-1)

							const getNumber = (str: string) => {
								let text = str.replace(',', '.');
								text = text.replace(/[^\d\.]/g, '');
								return Number(text);
							}

							this.plans = {
								basic: {
									...basic,
									values: {
										annually: getNumber(basicPrice),
										monthly: toFixed(getNumber(basicPrice)/10)
									}
								},
								pro: {
									...pro,
									values: {
										annually: getNumber(proPrice),
										monthly: toFixed(getNumber(proPrice)/10)
									}
								},
								pro_nutri: {
									...proNutri,
									values: {
										annually: getNumber(proNutriPrice),
										monthly: toFixed(getNumber(proNutriPrice)/10)
									}
								}
							}

							console.log('Redefinindo planos no iOS', this.plans)

						} else {
							this.plans = environment.plans.mercadopago;
						}
					}
				} else {
					this.plans = environment.plans.mercadopago;
				}
			}

		}
  }

	openDialog(type: string): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		const optionsDialog = {
			dialogPlans: DialogPlansComponent
		}

		const dialogComponent = optionsDialog[type];
		this._dialog.open(dialogComponent, dialogConfig);
	}

}

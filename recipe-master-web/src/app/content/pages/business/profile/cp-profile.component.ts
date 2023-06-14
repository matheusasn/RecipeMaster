import { CpBaseComponent } from './../../common/cp-base/cp-base.component';
import { User } from './../../../../core/models/user';
import { Component, OnInit, OnChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/auth/user.service';
import { UserDTO } from '../../../../core/models/security/dto/user-dto';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { ToastrService } from 'ngx-toastr';
import { RegionService } from '../../../../core/services/business/region.service';
import { Region } from '../../../../core/models/business/region';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../core/constants/cp-routes';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { APP_CONFIG } from '../../../../config/app.config';
import { ApiResponse } from '../../../../core/models/api-response';
import { STORAGE_KEYS } from '../../../../config/storage_keys.config';
import { PerfilEnum } from '../../../../core/models/security/perfil.enum';
import { PlanService } from '../../../../core/services/business/plan.service';
import { MessageService } from '../../components/message/message.service';
import { MessageResponse, MessageType } from '../../../../core/models/business/dto/message';
import { FirebaseService } from '../../../../core/services/business/firebase.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { CpLoadingComponent } from '../../components/common/loading/cp-loading.component';
import { TranslationService } from '../../../../core/metronic/services/translation.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogRecipeUseAmountComponent } from '../../tutorials/recipe/dialog-recipe-use-amount/dialog-recipe-use-amount.component';
@Component({
	selector: 'cp-profile',
	templateUrl: './cp-profile.component.html',
	styleUrls: ['./cp-profile.component.scss']
})

export class CPProfileComponent extends CpBaseComponent implements OnInit {

	user: UserDTO;
	regions: Region[] = [];

	cropOtions:any = {
		aspectRatio: 1
	};
    _currentUser: User;
    _currentPerfis: PerfilEnum[];

	languages = [
		'pt',
		'en',
		'es'
	]

	currencies = [
		"$",
		"R$",
		"€",
		"£",
		"kr",
		"Fr",
		"лв",
		"Kč",
		"kn",
		"₾",
		"ft",
		"zł",
		"₽",
		"lei",
		"₺",
		"₴",
		"د.إ",
		"₪",
		"Ksh",
		".د.م",
		"₦",
		"R",
		"S/.",
		"৳",
		"¥",
		"HK$",
		"Rp",
		"₹",
		"RM",
		"₱",
		"Rs",
		"₩",
		"฿",
		"₫"
	];

	validatePlan:boolean = true;
	cifrao: string;
	firebaseRecipesAvailable:any;

	modalTxt: string;
	modalBtn1: string;
	modalBtn2: string;

	lang: string;

	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _formBuilder: FormBuilder,
		private _userService: UserService,
		private _cpLocalStorageService: CpLocalStorageService,
		private _toastr: ToastrService,
		private planService: PlanService,
		private router: Router,
		private messageService:MessageService,
		private firebaseService:FirebaseService,
		private translate: TranslateService,
		private translationService: TranslationService,
		private dialog: MatDialog
	) {
		super(_loading, _cdr);
		this.fillCifrao();
		this._currentUser = this._cpLocalStorageService.getLoggedUser();

		this._currentPerfis = this.planService.getUserRoles();

		this.translate.get('MODAL.LOGOUT_TXT1').subscribe(
			data => {this.modalTxt = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN1').subscribe(
			data => {this.modalBtn1 = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN2').subscribe(
			data => {this.modalBtn2 = data}
		);

	}

	public logout () {
		swal('Confirmação', 'Você tem certeza?', 'question')
		swal({
			title: '',
			text: this.modalTxt,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: this.modalBtn1,
			cancelButtonText: this.modalBtn2
		  }).then((result) => {
				if (result.value) {
					this._cpLocalStorageService.clearToken();
					this.router.navigate([CpRoutes.LOGIN]);
				}
		  })
	}

	get screenWidth() {
		return +window.innerWidth
	}

	fillCifrao() {
		this.cifrao = this._cpLocalStorageService.getCurrency();
	}

	ngOnInit(): void {

		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		})

		this.formGroup = this._formBuilder.group({
			name: [null, Validators.required],
			email: [null, [Validators.required, Validators.email]],
			currency: '',
			password: '',
			password_confirm: '',
			defaultLanguage: ''
		});

		if(!environment.VALIDADE_PLAN) {
			this.validatePlan = false;
		}

		this.fillUser();

	}

	get migrationAvailable():boolean {
		return this.firebaseRecipesAvailable !== false && _.isNumber(this.firebaseRecipesAvailable) && this.firebaseRecipesAvailable > 0;
	}

	doMigration() {

		let total:number = this.firebaseRecipesAvailable;

		let op:SweetAlertOptions = {
			title: 'Confirmar transferência?',
			html: `Notamos que você tem <b>${total} receitas</b> cadastradas com esse e-mail no nosso aplicativo antigo.`,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: 'Sim',
			cancelButtonText: 'Depois',
			// reverseButtons: true
		};

		swal(op).then((result) => {
			if (result.value === true) {

				let response:MessageResponse = {
					title: "Migrar receitas app antigo (via profile)",
					type: MessageType.WELCOME_FIREBASE,
					data: 'Sim',
					migrar: true,
					cancel: false
				};

				this.messageService.userResponse(this._currentUser.id, response);

				let op: SweetAlertOptions = {
					title: 'Transferência de receitas',
					text: 'Chegará uma confirmação no seu e-mail para prosseguir com a transferência.',
					type: 'warning',
					showCloseButton: true,
					showConfirmButton: false
				};

				swal(op);

			}

		  });

	}

	fillUser() {
		this._loading.show();

		this.firebaseService.migrationAvailable(this._currentUser.id).subscribe( (response:ApiResponse) => {
			this.firebaseRecipesAvailable = response.data;
			if (this._currentUser) {
				this._userService.findByIdReduced(this._currentUser.id)
					.subscribe((res) => {
						this.user = res.data;
						this.fillForm();
						this._loading.hide();
					}, err => {
						console.warn(err.message);
						this._loading.hide();
					});
			}
			else {
				this._loading.hide();
			}

		}, err => {
			console.warn(err);
		})
	}

	cancelModifications() {
		this.fillForm();
		this.formGroup.markAsPristine();
	}

	doDismiss(event) {}

	photo:string;
	menuPhotoUpdated:boolean = false;
	baseUrl:string = APP_CONFIG.S3_PROFILE_URL;

	onPhotoChange(base64Content:any) {
		this.photo = base64Content;
		this.menuPhotoUpdated = true;
	}

	photoChanged:EventEmitter<string>;
	avatar: string = 'assets/avatar.png';
	saveModifications(passwordConfirm) {
		this._loading.show();

		this._currentUser.name = this.formGroup.value.name;
		this._currentUser.email = this.formGroup.value.email;
		this._currentUser.currency = this.formGroup.value.currency || 'R$';
		this._currentUser.password = this.formGroup.value.password;
		this._currentUser.passwordConfirm = passwordConfirm;
		this._currentUser.defaultLanguage = this.formGroup.value.defaultLanguage;

		this._currentUser.id = this.user.id;
		this._currentUser.photoUrl = this.user.photoUrl;

		if (!this._currentUser.password) {
			delete this._currentUser.password;
		}

		let shouldReload = this.formGroup.value.defaultLanguage !== localStorage.getItem('language')

		this.translationService.setLanguage(this.formGroup.value.defaultLanguage);

		if(this.menuPhotoUpdated) {

			let imageDto:any = {
				content: this.photo
			};

			this._userService.uploadPhoto(this._currentUser.id, imageDto).subscribe( (response: ApiResponse) => {
				try {

					if(response && response.data) {
						this._currentUser.photoUrl = this.baseUrl + response.data.key;
					}

				}
				catch(e) {
					console.warn(e.message);
				}

				this._userService.update(this._currentUser)
					.subscribe(apiResponse => {
						this.user = apiResponse.data;
						this._loading.hide();
						this._toastr.success(apiResponse.message);

						this._cpLocalStorageService.setCurrency(this.user.currency);

						this._cpLocalStorageService.setAvatar(this._currentUser.photoUrl);

						this._userService.getPhotoChangeEvent().emit(this._currentUser);

						if (shouldReload) {
							window.location.reload();
						}

					}, err => {
						this._loading.hide();
					});

			}, err => console.warn(err));

		}
		else {

			this._userService.update(this._currentUser)
				.subscribe(apiResponse => {
					this.user = apiResponse.data;
					this._userService.updatePhoto.emit(this.user.photo);
					this._loading.hide();
					this._toastr.success(apiResponse.message);

					this._cpLocalStorageService.setCurrency(this.user.currency);

					if (shouldReload) {
						window.location.reload();
					}

				}, err => {
					this._loading.hide();
				});

		}

	}

	private fillForm() {
		this.formGroup.setValue({
			name: this.user.name,
			email: this.user.email,
			currency: this.user.currency || 'R$',
			password: '',
			password_confirm: '',
			defaultLanguage: this.user.defaultLanguage || this.lang
		})
	}

	acessarPlanosAssinatura() {
		this.router.navigate([CpRoutes.PLAN_SIGN]);
	}

	confirmChangePass() {
		swal('Confirmação', 'Você tem certeza?', 'question');
		const op: SweetAlertOptions = {
			title: 'Voce irá alterar sua senha',
			text: 'Digite sua antiga senha para autorizar a operação',
			input: 'password',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar'
		};
		swal(op).then((result) => {
			if (result.value) {
				this.saveModifications(result.value);
			}
		})
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
			recipeUseAmount: DialogRecipeUseAmountComponent
		}

		const dialogComponent = optionsDialog[type];
		this.dialog.open(dialogComponent, dialogConfig);
	}
}

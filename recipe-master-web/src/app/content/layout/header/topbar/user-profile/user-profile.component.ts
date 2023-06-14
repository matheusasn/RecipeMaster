import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import swal from 'sweetalert2';
import { CpRoutes } from '../../../../../core/constants/cp-routes';

import { TranslateService } from '@ngx-translate/core';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { User } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/auth/user.service';

@Component({
	selector: 'm-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
	@HostBinding('class')
	// tslint:disable-next-line:max-line-length
	classes = 'm-nav__item m-topbar__user-profile m-topbar__user-profile--img m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light';

	@HostBinding('attr.m-dropdown-toggle') attrDropdownToggle = 'click';

	//TODO: Buscar foto do usuário
	avatar: string = 'assets/avatar.png';
	@Input() avatarBg: SafeStyle = '';

	@ViewChild('mProfileDropdown') mProfileDropdown: ElementRef;

	modalTxt: string;
	modalBtn1: string;
	modalBtn2: string;

	user: UserDTO;
	_currentUser: User;

	constructor (
		private _router: Router,
		private sanitizer: DomSanitizer,
		private _userService: UserService,
		private _localStorage: CpLocalStorageService,
		private _cpLocalStorageService: CpLocalStorageService,
		private translate: TranslateService,
		private pf: ChangeDetectorRef
	) {}

	ngOnInit (): void {
		if (!this.avatarBg) {
			this.avatarBg = this.sanitizer.bypassSecurityTrustStyle('url(./assets/app/media/img/misc/user_profile_bg.jpg)');
		}
		this.translate.get('MODAL.LOGOUT_TXT1').subscribe(
			data => {this.modalTxt = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN1').subscribe(
			data => {this.modalBtn1 = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN2').subscribe(
			data => {this.modalBtn2 = data}
		);

		this.fillUser();

		this._userService.getPhotoChangeEvent().subscribe( currentUser => {
			this._currentUser = currentUser;
			this.pf.detectChanges();
		});

	}

	fillUser() {

		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
			.subscribe((res) => {
					this.user = res.data;
				}, err => {
				});
		}
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
				this._localStorage.clearToken();
				this._router.navigate([CpRoutes.LOGIN]);
			}
		  })
	}
}

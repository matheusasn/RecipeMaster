import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, NgZone, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MenuAsideOffcanvasDirective } from '../../../core/metronic/directives/menu-aside-offcanvas.directive';
import { ClassInitService } from '../../../core/metronic/services/class-init.service';
import { MenuAsideService } from '../../../core/metronic/services/layout/menu-aside.service';
import { LayoutConfigService } from '../../../core/metronic/services/layout-config.service';
import { LayoutRefService } from '../../../core/metronic/services/layout/layout-ref.service';
import { PlanService } from '../../../core/services/business/plan.service';
import { PerfilEnum } from '../../../core/models/security/perfil.enum';
import * as _ from 'lodash';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { UserService } from '../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../core/services/common/cp-localstorage.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../core/models/user';
import { UserDTO } from '../../../core/models/security/dto/user-dto';

@Component({
	selector: 'm-aside-left',
	templateUrl: './aside-left.component.html',
	styleUrls: ['./aside-left.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent implements OnInit, AfterViewInit {

	@HostBinding('class') classes = 'm-grid__item m-aside-left';
	@HostBinding('id') id = 'm_aside_left';

	@HostBinding('attr.mMenuAsideOffcanvas') mMenuAsideOffcanvas: MenuAsideOffcanvasDirective;

	avatar: string = 'assets/avatar.png';
	_currentUser: User;
	user: UserDTO;

	currentRouteUrl: string = '';
	insideTm: any;
	outsideTm: any;

	shareMessage: string;

	isMinimized: boolean = false;
	menuToggled: boolean = false;

	constructor(
		private el: ElementRef,
		public classInitService: ClassInitService,
		public menuAsideService: MenuAsideService,
		public layoutConfigService: LayoutConfigService,
		private router: Router,
		private layoutRefService: LayoutRefService,
		@Inject(DOCUMENT) private document: Document,
		private planService: PlanService,

		private sanitizer: DomSanitizer,
		private _userService: UserService,
		private _localStorage: CpLocalStorageService,
		private _cpLocalStorageService: CpLocalStorageService,
		private pf: ChangeDetectorRef,
		private translate: TranslateService,
		private zone: NgZone,
	) {
		this.classInitService.onClassesUpdated$.subscribe(classes => {
			this.classes = 'm-grid__item m-aside-left ' + classes.aside_left.join(' ');
		});

		setTimeout(() => {
			$("#m_aside_left_minimize_toggle").on("click", () => {
				this.menuToggled = !this.menuToggled;
				this.isMinimized = !this.isMinimized;
				this.pf.detectChanges();
			})

			$("#m_ver_menu").on("mouseover", () => {
				setTimeout(() => {
					if (this.menuToggled) {
						if (this.isMinimized) {
							this.isMinimized = false;
							this.pf.detectChanges();
						}
					}
				}, 500)
			})

			$("#m_ver_menu").on("mouseleave", () => {
				setTimeout(() => {
					if (this.menuToggled) {
						this.isMinimized = true;
						this.pf.detectChanges();
					}
				}, 500)
			})
		}, 200)
	}

	get isAndroid() {
		// @ts-ignore
		return typeof(Android) != "undefined"
	}

	shareOnAndroid() {
		// @ts-ignore
		Android.shareText(this.shareMessage);
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.mMenuAsideOffcanvas = new MenuAsideOffcanvasDirective(this.el);
			this.mMenuAsideOffcanvas.ngAfterViewInit();

			this.layoutRefService.addElement('asideLeft', this.el.nativeElement);
		});
	}

	ngOnInit() {
		this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => this.currentRouteUrl = this.router.url.split(/[?#]/)[0]);

			this.fillUser();

			this._userService.getPhotoChangeEvent().subscribe( currentUser => {
				this._currentUser = currentUser;
				this.pf.detectChanges();
			});

			this.translate.get('SHARE_MESSAGE').subscribe(
				data => {
					this.shareMessage = encodeURIComponent(data)
				}
			);
	}

	goToProfile() {
		this.router.navigate(['perfil']);
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

	isEnabled(child:any):boolean {

		let userRoles:PerfilEnum[] = this.planService.getUserRoles();

		if(!_.isNil(child.roles) && _.isArray(child.roles) ) {

			return !_.isUndefined(_.find(child.roles, (role:any) => {
				return userRoles.includes(role);
			}));

		}

		return true;
	}

	checkPayment(item){

		this.router.navigate([item.page]);

	}

	isMenuItemIsActive(item): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		// dashboard
		if (item.page !== '/' && this.currentRouteUrl.startsWith(item.page)) {
			return true;
		}
		return this.currentRouteUrl === item.page;
	}

	isMenuRootItemIsActive(item): boolean {
		let result: boolean = false;

		for (const subItem of item.submenu) {
			result = this.isMenuItemIsActive(subItem);
			if (result) {
				return true;
			}
		}

		return false;
	}

	closeMenu() {
		setTimeout(() => document.getElementById('m_aside_left_close_btn').click(), 450);
	}

	mouseEnter(e: Event) {
		if (this.document.body.classList.contains('m-aside-left--fixed')) {
			if (this.outsideTm) {
				clearTimeout(this.outsideTm);
				this.outsideTm = null;
			}

			this.insideTm = setTimeout(() => {
				if (this.document.body.classList.contains('m-aside-left--minimize') && mUtil.isInResponsiveRange('desktop')) {
					this.document.body.classList.remove('m-aside-left--minimize');
					this.document.body.classList.add('m-aside-left--minimize-hover');
				}
			}, 300);
		}
	}

	mouseLeave(e: Event) {
		if (this.document.body.classList.contains('m-aside-left--fixed')) {
			if (this.insideTm) {
				clearTimeout(this.insideTm);
				this.insideTm = null;
			}

			this.outsideTm = setTimeout(() => {
				if (this.document.body.classList.contains('m-aside-left--minimize-hover') && mUtil.isInResponsiveRange('desktop')) {
					this.document.body.classList.remove('m-aside-left--minimize-hover');
					this.document.body.classList.add('m-aside-left--minimize');
				}
			}, 500);
		}
	}
}

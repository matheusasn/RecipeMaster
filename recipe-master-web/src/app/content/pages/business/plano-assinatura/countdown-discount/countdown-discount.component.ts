import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../../../../../core/auth/user.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';

@Component({
	selector: 'countdown-discount',
	templateUrl: './countdown-discount.component.html',
	styleUrls: ['./countdown-discount.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownDiscountComponent implements OnInit, OnDestroy {

	@Input() minutesToAdd: number = 10;
	@Input() showButton: boolean = true;

	user: User;

	private subscription: Subscription;
	public dateNow = new Date();
	public dDay: Date;
	public hiddenCountdown: boolean;

	milliSecondsInASecond = 1000;
	hoursInADay = 25;
	minutesInAnHour = 60;
	SecondsInAMinute = 60;

	public timeDifference;
	public secondsToDday = 0;
	public minutesToDday = 0;
	public hoursToDday = 0;

	lang: string;

	constructor(
		private ref: ChangeDetectorRef,
		private _localStorage: CpLocalStorageService,
		private _userService: UserService,
		private translationService: TranslationService
	) {
		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});
	}

	@HostBinding('style.height') get height() {
		return this.showButton ? 192 + 'px' : 139 + 'px';
	}

	@HostBinding('class.hidden') get hidden() {
		return this.hiddenCountdown;
	}

	private getInitialTimer() {
		if (this.user.discountTimerStartedAt) {
			const endTime = moment(this.user.discountTimerStartedAt).add(this.minutesToAdd, 'm').toDate().getTime()
			if (moment(endTime).isAfter(moment(new Date()))) {
				return endTime - moment(new Date()).toDate().getTime()
			} else {
				return 0
			}
		} else {
			this._userService.startDiscountTimer(this.user.id).subscribe(apiResponse => {})
			const endTime = moment(new Date()).add(this.minutesToAdd, 'm').toDate().getTime()
			return endTime - moment(new Date()).toDate().getTime()
		}
	}

	async ngOnInit() {
		this._userService.findByIdReduced(this._localStorage.getLoggedUser().id).subscribe(
			(apiResponse: ApiResponse) => {
				this.user = apiResponse.data
				this.timeDifference = this.getInitialTimer();

				if (this.timeDifference <= 0 || this.user.plan) {
					this.hiddenCountdown = true;
					let element:HTMLElement = document.getElementsByClassName('countdown')[0] as HTMLElement;
					element.click()
					return
				}

				if (this.timeDifference === undefined || this.timeDifference === null || this.timeDifference === 'null') {
					this.dDay = moment(new Date()).add(this.minutesToAdd, 'm').toDate();
					this.initCount();
				} else {
					if (Number(this.timeDifference) > 0) {
						this.dDay = moment(new Date()).add(this.timeDifference, 'ms').toDate();
						this.initCount();
					}
				}
			}
		)
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	private initCount() {
		this.subscription = interval(1000).subscribe(_ => {
			this.getTimeDifference();
			this.ref.markForCheck();
		});
	}

	private getTimeDifference () {

		this.timeDifference = this.dDay.getTime() - new Date().getTime();
		if (this.timeDifference > 0) {
			this.allocateTimeUnits(this.timeDifference);
		}
	}

	private allocateTimeUnits (timeDifference) {
		this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
		this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
		// this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
	}


}

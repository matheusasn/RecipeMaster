import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { UserStatsDTO } from '../users/users.component';
import * as _ from 'lodash';
import { AdminService } from '../../../../../core/services/business/admin.service';
import moment from 'moment';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { DeviceType } from '../../../../../core/services/business/stats.service';

export interface RequestStatsGraphDTO {
	start: Date,
	end: Date,
	perfil?: number;
}

@Component({
  selector: 'm-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss']
})
export class AdminStatsComponent extends CpBaseComponent implements OnInit {

  stats:AdminStats;
	unhandledStats;
	private chartData: any = {};
	lastPerfil: number;
	lastPath: string;
	startDate: string;
	endDate: string;
	showGraph: boolean;
  @Output() onReload = new EventEmitter();
	@Output() onGraphLoad = new EventEmitter();

	totalSubscribers: number = 0;
	todayUsers: number = 0;
	todayAccesses: number = 0;
	todaySubscribers: number = 0;
	todayRecipes: number = 0;
	todayPdfs: number = 0;
	todayIngredients: number = 0;
	todayCompoundIngredients: number = 0;
	todayPrices: number = 0;
	todayMenus: number = 0;
	webCount: number = 0;
	androidCount: number = 0;
	iOSCount: number = 0;
	totalExpired: number = 0;
	todayRenewed: number = 0;
	currentExpired: number = 0;
	lessThanOneMonthToExpire = 0;

	firebaseUsers = 0;
	firebaseMigratedUsers = 0;

  constructor(_loading: CpLoadingService,
		private adminService: AdminService,
		_cdr: ChangeDetectorRef) {
			super(_loading, _cdr);
		}

  async ngOnInit() {
		this.endDate = new Date().toISOString().split('T')[0]
		this.startDate = moment().subtract(30, 'days').toDate().toISOString().split('T')[0];

    this._loading.show();

		const response = await this.adminService.getAllStats().toPromise();
		this.unhandledStats = response.data;

    this.stats = this.buildStats();

		this.adminService.getTodayUsers().subscribe(response => {
			this.todayUsers = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayAccesses().subscribe(response => {
			this.todayAccesses = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodaySubscribers().subscribe(response => {
			this.todaySubscribers = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayRecipes().subscribe(response => {
			this.todayRecipes = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayPdfs().subscribe(response => {
			this.todayPdfs = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayIngredients().subscribe(response => {
			this.todayIngredients = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayCompoundIngredients().subscribe(response => {
			this.todayCompoundIngredients = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayPrices().subscribe(response => {
			this.todayPrices = response.data;
			this.onChangeComponent();
		});
		this.adminService.getTodayMenus().subscribe(response => {
			this.todayMenus = response.data;
			this.onChangeComponent();
		});

		this.adminService.getCountByDevice(DeviceType.WEB).subscribe(response => {
			this.webCount = response.data;
			this.onChangeComponent();
		});
		this.adminService.getCountByDevice(DeviceType.ANDROID).subscribe(response => {
			this.androidCount = response.data;
			this.onChangeComponent();
		});
		this.adminService.getCountByDevice(DeviceType.iOS).subscribe(response => {
			this.iOSCount = response.data;
			this.onChangeComponent();
		});

		this.adminService.getPlanExpirations().subscribe(response => {
			this.totalExpired = response.data.totalExpired;
			this.todayRenewed = response.data.totalRenewed;
			this.currentExpired = response.data.currentExpired;
			this.lessThanOneMonthToExpire = response.data.lessThanOneMonthToExpire;
			this.onChangeComponent();
		});

		this.adminService.getFirebaseStats().subscribe(response => {
			this.firebaseUsers = response.data.totalFirebase;
			this.firebaseMigratedUsers = response.data.totalMigratedFromFirebase;
		})

    this._loading.hide();

  }

	getPercent(first, second) {
		if (first && second) {
			return Number((first * 100) / second).toFixed(2);
		}
		return 0;
	}

	changePath(path) {
		this.onGraphLoad.emit({
			path
		});
	}

	toggleGraph() {
		this.showGraph = !this.showGraph;
	}

  private buildStats():AdminStats {

    let stats = new AdminStats();

    let filteredUsers:UserStatsDTO[] = _.filter(this.unhandledStats, (u) => {
			return u[7] !== 1 // 1 = ADMIN
    })

    stats.users = filteredUsers.length;
		stats.prices = filteredUsers[0][9]?filteredUsers[0][9]:0;

    _.each(filteredUsers, (u:UserStatsDTO) => {

      try {

        stats.recipes += (u&&u[3]?u[3]:0);
        stats.menus += (u&&u[4]?u[4]:0);
        stats.usedIngredients += (u&&u[1]?u[1]:0);
        stats.compoundIngredients += (u&&u[2]?u[2]:0);
        stats.access += (u&&u[5]?u[5]:0);
				stats.pdfs += (u&&u[8]?u[8]: 0);

				const isUserBasic = u[7] === 3;
				const isUserPro = u[7] === 4;
				const isUserProNutri = u[7] === 5;

        if(isUserBasic) {
          stats.signatures.basic++;
        }
        else if(isUserPro) {
          stats.signatures.pro++;
        }
        else if(isUserProNutri) {
          stats.signatures.proNutri++;
        }

      }
      catch(e) {
        console.warn(e);
      }

    });

		this.totalSubscribers = stats.signatures.basic + stats.signatures.pro + stats.signatures.proNutri;

    return stats;

  }

	private getDates(startDate, stopDate) {
		const addDays = (date: Date, days: number) => {
			date.setDate(date.getDate() + days);
			return date;
		}

    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
			dateArray.push(new Date (currentDate));
			currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

	async loadGraph(title: string, path:string, perfil: number = null) {
		this.onGraphLoad.emit({
			path,
			perfil
		});

		this.lastPath = path;
		this.lastPerfil = perfil;

		const end = moment(this.endDate).endOf('day').toDate()
		const start = moment(this.startDate).startOf('day').toDate()

		const response = await this.adminService.loadGraph(path, {
			end,
			start,
			perfil
		}).toPromise();

		const data: number[] = [];
		const labels: string[] = [];

		const dates = this.getDates(start, end)

		const result = dates.map(date => {
			const found = response.data.find(item => moment(item[0]).isSame(moment(date), 'day'))
			return {
				date,
				qtd: found ? found[1] : 0
			}
		})

		result.forEach(item => {
			labels.push(moment(item.date).format('DD/MM'));
			data.push(item.qtd);
		})

		this.chartData = {
			title,
			labels: labels,
			data: [{
				data
			}]
		}

		this._cdr.detectChanges()
	}

	applyFilter() {
		this.loadGraph(this.chartData.title, this.lastPath, this.lastPerfil)
	}

}

export class SignatureStats {
  basic:number = 0;
  pro:number = 0;
  proNutri:number = 0;
};

export class AdminStats {
  users:number = 0;
  signatures:SignatureStats = new SignatureStats();
  recipes:number = 0;
  menus:number = 0;
  usedIngredients:number = 0;
  compoundIngredients:number = 0;
  access:number = 0;
	pdfs: number = 0;
	prices: number = 0;
}

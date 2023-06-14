import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { DataTableDirective } from 'angular-datatables';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { MessageService } from '../../../components/message/message.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { User } from '../../../../../core/models/user';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../../../../../core/constants/endpoints';
import { APP_CONFIG } from '../../../../../config/app.config';
import { EditUserPlanDateComponent } from '../edit-user-plan-date/edit-user-plan-date.component';
import { AuthenticationService } from '../../../../../core/auth/authentication.service';
import { Credential } from '../../../../../core/auth/credential';
import { StatsService } from '../../../../../core/services/business/stats.service';
import { NewPwdModalComponent } from './newpwdmodal.component';

export interface UserStatsDTO {
    id: number;
    name: string;
    user: User;
    stats:any[];
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends CpBaseComponent implements OnInit {

		dtOptions;

    dtTrigger: Subject<any> = new Subject();
    users:UserStatsDTO[];
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    allSelected:boolean = false;
		private lastSearch: string;
		private lastPageLenght:number;
		private lastStart:number;

		newPwdModalRef: MatDialogRef<NewPwdModalComponent>;

    constructor(_cdr: ChangeDetectorRef,_loading: CpLoadingService,
        private messageService:MessageService,
        private toaster: ToastrService,
				private authService: AuthenticationService,
        private dialog: MatDialog,
        private http: HttpClient,
				private _dialogNewPwd: MatDialog,
				private statsService: StatsService) {
        super(_loading, _cdr);
    }

    ngOnInit() {

			this.dtOptions = {
				pagingType: 'simple_numbers',
				pageLength: 25,
				stateSave: false,
				info: true,
				lengthMenu: [10, 25, 50, 10000],
				ordering: true,
				searching: true,
				searchDelay: 500,
				language: {
						lengthMenu: "Exibir: _MENU_",
						zeroRecords: "",
						paginate: {
								first: "Primeira",
								last: "Última",
								next: "Próxima",
								previous: "Anterior"
						}
				},
				columnDefs: [
						{
								orderable: false,
								className: 'select-checkbox',
								targets: 0
						},
						{
								targets: [3,7,9,10,11],
								type: 'natural'
						}
				],
				select: {
						style: 'multi',
						selector: 'td:first-child'
				},
				serverSide: true,
				processing: false,

				ajax: (dataTablesParameters: any, callback) => {
					if (this.lastPageLenght !== dataTablesParameters.length ||
						 this.lastSearch !== dataTablesParameters.search.value ||
						 this.lastStart !== dataTablesParameters.start) {
						this.lastSearch = dataTablesParameters.search.value;
						this.lastPageLenght = dataTablesParameters.length;
						this.lastStart = dataTablesParameters.start;
						this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
							this.http
							.post<DataTablesResponse>(
								`${APP_CONFIG.BASE_FULL_URL}${ENDPOINTS.ADMIN.STATS.ALL}/users`,
								Object.assign(dataTablesParameters, { page: dtInstance.page() }), {}
							).subscribe(resp => {
								this.users = this.orderUsers(resp.data['content'], dataTablesParameters.order)
								callback({
									recordsTotal: resp.data['totalElements'],
									recordsFiltered: resp.data['totalElements'],
									data: []
								});

								this.onChangeComponent();
							});
						})
					} else {
						this.users = this.orderUsers(this.users, dataTablesParameters.order);
						this.onChangeComponent();
					}
				},
		};


    }

		onGraphLoad(data){
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				if (data.perfil) {
					dtInstance.search(`auto:${data.path}-${data.perfil}`);
				} else {
					dtInstance.search(`auto:${data.path}`);
				}

				dtInstance.ajax.reload();
			})
		}

		removeDiscountTimer(user) {
			if (confirm(`Deseja realmente resetar o countdown de desconto para o ${user.user.name}?`)) {
				this.statsService.removeDiscountTimer(user.user.id).subscribe(() => {
					this.toaster.success(`Countdown resetado com sucesso para o usuário: ${user.user.name}`);
					user.user.discountTimerStartedAt = null;
					this.reload();
					this.onChangeComponent();
				})
			}
		}

		lessThanOneMonthToExpires(user) {
			if (user && user.plan && user.plan.expiration) {
				const diffMonths = moment(user.plan.expiration).diff(moment(), 'M', true)
				return diffMonths < 1
			}
			return false
		}

		private orderUsers(users, order): UserStatsDTO[] {
			let result = users
			if (order && order.length > 0) {
				const dir = order[0].dir
				const column = order[0].column
				if (column == 2) {
					result = _.sortBy(result, [function (o) { return o.name } ])
					if (dir === 'desc') {
						result = result.reverse()
					}
				} else if (column == 3) {
					result = _.sortBy(result, [function (o) { return o.user.email } ])
					if (dir === 'desc') {
						result = result.reverse()
					}
				} else if (column == 4) {
					result = _.sortBy(result, [function (o) { return o.user.perfis[0] } ])
					if (dir === 'desc') {
						result = result.reverse()
					}
				} else {
					result = result.sort((a, b) => {
						if (column === 1) {
							if (dir === 'asc') {
								return a.id - b.id
							}
							return b.id - a.id
						} else if (column == 6) {
							if (dir === 'asc') {
								return a.nps - b.nps
							}
							return b.nps - a.nps

						} else if (column == 7) {
							if (dir === 'asc') {
								return a.user.inclusion - b.user.inclusion
							}
							return b.user.inclusion - a.user.inclusion
						} else if (column == 8) {
							if (dir === 'asc') {
								return this.getLastAccess(a).getTime() - this.getLastAccess(b).getTime()
							}
							return this.getLastAccess(b).getTime() - this.getLastAccess(a).getTime()
						} else if (column == 9) {
							if (dir === 'asc') {
								return a.stats[5] - b.stats[5]
							}
							return b.stats[5] - a.stats[5]
						} else if (column == 10) {
							if (dir === 'asc') {
								return a.stats[3] - b.stats[3]
							}
							return b.stats[3] - a.stats[3]
						} else if (column == 11) {
							if (dir === 'asc') {
								return a.stats[7] - b.stats[7]
							}
							return b.stats[7] - a.stats[7]

						} else if (column == 12) {
							if (dir === 'asc') {
								return a.stats[1] - b.stats[1]
							}
							return b.stats[1] - a.stats[1]
						} else if (column == 13) {
							if (dir === 'asc') {
								return a.stats[2] - b.stats[2]
							}
							return b.stats[2] - a.stats[2]
						} else if (column == 14) {
							if (dir === 'asc') {
								return a.stats[4] - b.stats[4]
							}
							return b.stats[4] - a.stats[4]
						} else if (column == 15) {
							const getInclusion = (u) => u.user.plan ? (u.user.plan.inclusion ? u.user.plan.inclusion : 0) : 0;
							if (dir === 'asc') {
								return getInclusion(a) - getInclusion(b)
							}
							return getInclusion(b) - getInclusion(a)
						} else if (column == 16) {
							const getExpiration = (u) => u.user.plan ? (u.user.plan.expiration ? new Date(u.user.plan.expiration).getTime() : 0) : 0;
							if (dir === 'asc') {
								return getExpiration(a) - getExpiration(b)
							}
							return getExpiration(b) - getExpiration(a)
						} else if (column == 17) {
							const getExpiration = (u) => u.user.lastPlanExpiredAt ? new Date(u.user.lastPlanExpiredAt).getTime() : 0
							if (dir === 'asc') {
								return getExpiration(a) - getExpiration(b)
							}
							return getExpiration(b) - getExpiration(a)
						}
						else if (column == 19) {
							const getDate = (u) => u.user.discountTimerStartedAt ? new Date(u.user.discountTimerStartedAt).getTime() : 0
							if (dir === 'asc') {
								return getDate(a) - getDate(b)
							}
							return getDate(b) - getDate(a)
						}
					})
				}
			}
			return result
		}

    ngAfterViewInit() {
			this.dtTrigger.next();
    }

		ngOnDestroy(): void {
			this.dtTrigger.unsubscribe();
		}

    getLastAccess(dto:UserStatsDTO):Date|null {

        try {
            return dto.stats&&dto.stats[6]?moment(dto.stats[6]).toDate():(dto.user&&dto.user.inclusion?moment(dto.user.inclusion).toDate():null);
        }
        catch(e) {
            console.warn(e.message);
            return null;
        }

    }

		doEditDate(user:any, dateName: string) {
			let dialog = this.dialog.open(EditUserPlanDateComponent, {
				data: {
					user: user,
					dateName: dateName
				},
				panelClass: 'cpPanelOverflow'
			})

			dialog.afterClosed().subscribe( (userChanged:User) => {

				if(userChanged) {

						this._loading.show();

						try {
								user.user = userChanged;

								this.reload();
								this._loading.hide();
						}
						catch(e) {
								console.warn(e);
								this._loading.hide();
						}

						this.onChangeComponent();

				}

		});
		}

    doDetail(user:any) {
        let dialog = this.dialog.open(UserDetailComponent, {
            data: {
                user: user
            },
            panelClass: 'cpPanelOverflow'
        });

        dialog.afterClosed().subscribe( (userChanged:User) => {

            if(userChanged) {

                this._loading.show();

                try {
                    user.user = userChanged;

                    this.reload();
                    this._loading.hide();
                }
                catch(e) {
                    console.warn(e);
                    this._loading.hide();
                }

                this.onChangeComponent();

            }

        });

    }

		reload() {
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.ajax.reload();
			})
		}

		rerender() {
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				// Destroy the table first
				dtInstance.destroy();
				// Call the dtTrigger to rerender again
				this.dtTrigger.next();
			})
		}

		get haveOneUserSelected() {
			return this.users && this.users.filter(user => user['selected']).length === 1
		}

		createPassword() {
			const selected = this.users.filter(user => user['selected'])[0]
			this.newPwdModalRef = this._dialogNewPwd.open(NewPwdModalComponent, {
				panelClass: 'cpPanelOverflow',
				data: {
					selected
				}
			})

			this.newPwdModalRef.afterClosed().subscribe(data => {
				if (data && data.ok) {
					this.toaster.success('Senha alterada com sucesso')
				}
			})
		}

		resetPassword() {
			const selected = this.users.filter(user => user['selected'])[0]

			const credential:Credential = {
				email: selected.user.email,
				username: '',
				password: ''
			}

			this._loading.show();
			this.authService.requestPassword(credential).subscribe(response => {
				this._loading.hide();
				this.toaster.success("Link de recuperação de senha enviado com sucesso para " + selected.user.email);
			});

		}

    doCreateMessage() {

				const selecteds = this.users.filter(user => user['selected'])

				if(!selecteds || selecteds.length == 0) {
					this.toaster.warning("Selecione ao menos um usuário.");
					return;
			}

			this.messageService.openCreateModal(selecteds);

    }

    toogleSelectAllBtn() {

			this.users.forEach(user => {
				user['selected'] = !user['selected']
			})

    }


}

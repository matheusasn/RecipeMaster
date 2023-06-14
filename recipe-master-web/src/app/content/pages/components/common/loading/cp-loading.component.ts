import { Component, OnInit} from '@angular/core';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { ENDPOINTS } from '../../../../../core/constants/endpoints';
import { APIClientService } from '../../../../../core/services/common/api-client.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';

@Component({
  selector: 'cp-loading',
  templateUrl: './cp-loading.component.html',
  styleUrls: ['./cp-loading.component.scss']
})
export class CpLoadingComponent implements OnInit{

  currentPerfis: PerfilEnum[];
  user: ApiResponse;

  constructor(
    private planService: PlanService,
    private apiClient: APIClientService,
		private _localStorage: CpLocalStorageService) {}


  ngOnInit() {
    this.refreshRoles();
  }

  refreshRoles(){
		const loggedUser = this._localStorage.getLoggedUser();
		if (loggedUser) {
			this.apiClient.get(`${ENDPOINTS.SECURITY.REFRESH_PLAN}`).subscribe( response => {
				this.planService.setUserRoles(response);
			})
		}
  }


}

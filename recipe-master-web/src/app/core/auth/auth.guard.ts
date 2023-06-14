import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CpRoutes } from '../constants/cp-routes';
import { Token } from '../interfaces/token';
import { CpLocalStorageService } from '../services/common/cp-localstorage.service';
import { PerfilEnum } from '../models/security/perfil.enum';
import { PlanService } from '../services/business/plan.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _cpLocalStorageService: CpLocalStorageService,
    private planService: PlanService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.endpointWithoutVerification(state.url)) {
      return true;
    }

    let token: Token = this._cpLocalStorageService.getToken();

    if (!token) {
      this._router.navigate([CpRoutes.LOGIN]);
      return false;
    }

    if(!this.hasPermission(route)) {
      this._router.navigate([CpRoutes.RECIPES]);
      return false;
    }

    return true;

  }

  endpointWithoutVerification(url: string): boolean {
    return url.includes(CpRoutes.LOGIN) ||
      url == CpRoutes.REGISTER_USER ||
      url == CpRoutes.REGISTER;
  }

  private hasPermission(route: ActivatedRouteSnapshot) {

    if(_.isNil(environment.VALIDADE_PLAN) || !environment.VALIDADE_PLAN) {
      return true;
    }

    let access:PerfilEnum[] = route.data && route.data.access;

    if(access == null) {
      return true;
    }

    let userRoles:PerfilEnum[] = this.planService.getUserRoles();

    if(_.intersection(access, userRoles).length > 0 ) {
      return true;
    }

    if(!_.isNil(route.data.enableAlreadyCreated) && route.data.enableAlreadyCreated===true ) {
        return true;
    }

    return false;

  }

}

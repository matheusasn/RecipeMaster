import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { CpLocalStorageService } from "../services/common/cp-localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
  constructor(private localStorage: CpLocalStorageService,private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const isSignedIn = !!this.localStorage.getLoggedUser()
    if (isSignedIn) {
      this.router.navigate(["/"]); // or home
      return false;
    }
    return true;
  }
}

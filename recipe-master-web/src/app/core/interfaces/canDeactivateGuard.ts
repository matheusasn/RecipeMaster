import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CpBaseComponent} from '../../content/pages/common/cp-base/cp-base.component';

export interface PendingChangesComponent {
	canDeactivate: () => boolean | Observable<boolean>;
}
//
// @Injectable()
// export class CanDeactivateGuard implements CanDeactivate<PendingChangesComponent> {
// 	canDeactivate(component: any): boolean {
// 		console.log('canDeactivate');
// 		console.log(component);
// 		// if (component.hasUnsavedData()) {
// 		// 	if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
// 		// 		return true;
// 		// 	} else {
// 		// 		return false;
// 		// 	}
// 		// }
// 		return true;
// 	}
// }


@Injectable({
	providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {

	canDeactivate(
		component: any,
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		return true;
	}
}

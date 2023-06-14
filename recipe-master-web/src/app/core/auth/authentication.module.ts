import { NgModule } from '@angular/core';
import {
	AUTH_SERVICE,
	AuthModule,
	PROTECTED_FALLBACK_PAGE_URI,
	PUBLIC_FALLBACK_PAGE_URI
} from 'ngx-auth';

import { TokenStorage } from './token-storage.service';
import { AuthenticationService } from './authentication.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

export function factory(authenticationService: AuthenticationService) {
	return authenticationService;
}

@NgModule({
	imports: [AuthModule],
	providers: [
		TokenStorage,
		AuthenticationService,
		AuthService,
		UserService,
		{ provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
		{ provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/login' },
		{
			provide: AUTH_SERVICE,
			deps: [AuthenticationService],
			useFactory: factory
		}
	]
})
export class AuthenticationModule {}

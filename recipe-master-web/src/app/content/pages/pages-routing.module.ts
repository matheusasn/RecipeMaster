import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './header/profile/profile.component';
import { ErrorPageComponent } from './snippets/error-page/error-page.component';
import { InnerComponent } from "./components/inner/inner.component";
import { AuthGuard } from '../../core/auth/auth.guard';
import { IsSignedInGuard } from '../../core/auth/is-signed-in.guard';
import { PerfilEnum } from '../../core/models/security/perfil.enum';

const routes: Routes = [
	{
		path: '',
		component: PagesComponent, children: [
			{
				path: '',
				loadChildren: './business/business-pages.module#BusinessPagesModule',
				canActivate: [ AuthGuard ]
			},
			{
				path: 'builder',
				loadChildren: './builder/builder.module#BuilderModule',
				canActivate: [ AuthGuard ]
			},
			{
				path: 'profile',
				component: ProfileComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'inner',
				component: InnerComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'admin',
                loadChildren: './business/admin/admin.module#AdminModule',
				canActivate: [ AuthGuard ],
                data: {
                    access: [PerfilEnum.ADMIN]
                }
			}
		]
	},
	{
		path: 'login',
		loadChildren: './auth/auth.module#AuthModule',
		canActivate: [ IsSignedInGuard ]
	},
	{
		path: 'register',
		loadChildren: './auth/auth.module#AuthModule',
		data: {
			action: 'register'
		},
		canActivate: [ IsSignedInGuard ]
	},
	{
		path: '404',
		component: ErrorPageComponent
	},
	{
		path: 'error/:type',
		component: ErrorPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}

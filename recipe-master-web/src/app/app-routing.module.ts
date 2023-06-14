import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

const _pathLandpage: string = '../landpage/landpage.module#LandpageModule';
const _pathPAGES: string = 'app/content/pages/pages.module#PagesModule';

const routes: Routes = [
	{ 
		path: '', 
		loadChildren: _pathPAGES, 
		canActivate: [ AuthGuard ] 
	},
	{
		path: '**',
		redirectTo: '404',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

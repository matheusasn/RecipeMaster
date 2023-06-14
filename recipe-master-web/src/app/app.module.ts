import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AuthenticationModule} from './core/auth/authentication.module';
import {NgxPermissionsModule} from 'ngx-permissions';

import {LayoutModule} from './content/layout/layout.module';
import {PartialsModule} from './content/partials/partials.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material';
import {OverlayModule} from '@angular/cdk/overlay';

import 'hammerjs';
import {CoreModule} from './core/core.module';
import {MetronicServiceModule} from './core/metronic/services/metronic-service.module';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig} from 'ng2-currency-mask/src/currency-mask.config';

import {ToastrModule} from 'ngx-toastr';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {RecipeReportModule} from './core/report/recipe/recipereport.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: "R$",
    suffix: "",
    thousands: "."
};

// import { FacebookLoginProvider } from 'angularx-social-login';
import { AdsenseModule } from 'ng2-adsense';
import { environment } from '../environments/environment';

// const fbLoginOptions: LoginOpt = {
// 	scope: 'email',
// 	return_scopes: true,
// 	enable_profile_selector: true
//   };

// let config = new AuthServiceConfig([
// 	{
// 	  id: FacebookLoginProvider.PROVIDER_ID,
// 	  provider: new FacebookLoginProvider("512951236019787", fbLoginOptions)
// 	}
// ]);

// export function provideConfig() {
// 	return config;
// }

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { CpLocalStorageService } from './core/services/common/cp-localstorage.service';

registerLocaleData(localePt, 'pt');

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		LayoutModule,
		PartialsModule,
		CoreModule,
		MetronicServiceModule,
		OverlayModule,
		AuthenticationModule,
		NgxPermissionsModule.forRoot(),
		NgbModule.forRoot(),
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		ToastrModule.forRoot(),
		DragDropModule,
		ConfirmDialogModule,
		RecipeReportModule,
		InfiniteScrollModule,
		// SocialLoginModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-7000897604640151',
			adSlot: 4439575095
        }),
        NgxGoogleAnalyticsModule.forRoot(environment.ga.code),
	],
	providers: [
		// { provide: AuthServiceConfig, useFactory: provideConfig },
		// { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
		{
			provide: LOCALE_ID,
			// useValue: 'pt',
			deps: [CpLocalStorageService],
			useFactory: (CpLocalStorageService) => CpLocalStorageService.getLocale()
		 },
    ],
	bootstrap: [AppComponent]
})
export class AppModule {}

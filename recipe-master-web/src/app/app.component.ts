import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, } from '@angular/core';
import * as objectPath from 'object-path';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
// language list
import { locale as enLang } from './config/i18n/en';
import { locale as esLang } from './config/i18n/es';
import { locale as ptLang } from './config/i18n/pt';
import { LayoutConfigService } from './core/metronic/services/layout-config.service';
import { ClassInitService } from './core/metronic/services/class-init.service';
import { TranslationService } from './core/metronic/services/translation.service';
import { PageConfigService } from './core/metronic/services/page-config.service';
import { SplashScreenService } from './core/metronic/services/splash-screen.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { environment } from '../environments/environment';

declare let gtag: Function;
declare let fbq:Function;

// LIST KNOWN ISSUES
// [Violation] Added non-passive event listener; https://github.com/angular/angular/issues/8866

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[m-root]',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit, OnInit {

	title = 'recipemaster';

	@HostBinding('style') style: any;
	@HostBinding('class') classes: any = '';

	@ViewChild('splashScreen', {read: ElementRef})
	splashScreen: ElementRef;
	splashScreenImage: string;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private classInitService: ClassInitService,
		private sanitizer: DomSanitizer,
		private translationService: TranslationService,
		private router: Router,
		private pageConfigService: PageConfigService,
		private splashScreenService: SplashScreenService,
        protected $gaService: GoogleAnalyticsService
	) {

		// subscribe to class update event
		this.classInitService.onClassesUpdated$.subscribe(classes => {
			// get body class array, join as string classes and pass to host binding class
			setTimeout(() => this.classes = classes.body.join(' '));
		});

		this.layoutConfigService.onLayoutConfigUpdated$.subscribe(model => {
			this.classInitService.setConfig(model);

			this.style = '';
			if (objectPath.get(model.config, 'self.layout') === 'boxed') {
				const backgroundImage = objectPath.get(model.config, 'self.background');
				if (backgroundImage) {
					this.style = this.sanitizer.bypassSecurityTrustStyle('background-image: url(' + objectPath.get(model.config, 'self.background') + ')');
				}
			}

			//	splash screen image
			this.splashScreenImage = objectPath.get(model.config, 'loader.image');
		});

		// register translations
		this.translationService.loadTranslations(enLang, esLang, ptLang);

		this.translationService.setDefaultLanguage();

		// override config by router change from pages config
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				this.layoutConfigService.setModel({page: objectPath.get(this.pageConfigService.getCurrentPageConfig(), 'config')}, true);
				fbq('track', 'ViewContent', { content_name: event.urlAfterRedirects });
			});
	}

	ngOnInit(): void {

        this.trackPageViews();

	}

	ngAfterViewInit(): void {
		if (this.splashScreen) {
			this.splashScreenService.init(this.splashScreen.nativeElement);
		}
	}

	trackPageViews() {
        environment.ga.enabled &&  this.router.events.subscribe( event => {
            if(event instanceof NavigationEnd) {
                this.$gaService.pageView(event.urlAfterRedirects);
            }
        });

    }
}

import { NgModule } from "@angular/core";
import { AclService } from "./acl.service";
import { LayoutConfigService } from "./layout-config.service";
import { LayoutConfigStorageService } from "./layout-config-storage.service";
import { LayoutRefService } from "./layout/layout-ref.service";
import { MenuConfigService } from "./menu-config.service";
import { PageConfigService } from "./page-config.service";
import { UserService } from "./user.service";
import { ClassInitService } from "./class-init.service";
import { MessengerService } from "./messenger.service";
import { ClipboardService } from "./clipboard.sevice";
import { LogsService } from "./logs.service";
import { QuickSearchService } from "./quick-search.service";
import { DataTableService } from "./datatable.service";
import { SplashScreenService } from "./splash-screen.service";
import { UtilsService } from "./utils.service";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SubheaderService } from "./layout/subheader.service";
import { HeaderService } from "./layout/header.service";
import { MenuHorizontalService } from "./layout/menu-horizontal.service";
import { MenuAsideService } from "./layout/menu-aside.service";
import { HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { GestureConfig } from "@angular/material";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	// suppressScrollX: true
};

@NgModule({
    providers: [
        AclService,
		LayoutConfigService,
		LayoutConfigStorageService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		UserService,
		UtilsService,
		ClassInitService,
		MessengerService,
		ClipboardService,
		LogsService,
		QuickSearchService,
		DataTableService,
		SplashScreenService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},	

		// template services	
		SubheaderService,
		HeaderService,
		MenuHorizontalService,
		MenuAsideService,
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		}
    ]
})
export class MetronicServiceModule {}
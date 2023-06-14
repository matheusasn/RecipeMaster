import { BusinessServiceModule } from './business/business-service.module';
import { NgModule } from "@angular/core";
import { CommonServiceModule } from "./common/common-service.module";

@NgModule({
   imports: [
	   CommonServiceModule,
	   BusinessServiceModule
   ]
})
export class ServiceModule {

}

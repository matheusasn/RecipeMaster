import { NgModule } from "@angular/core";
import { CommonServiceModule } from "./services/common/common-service.module";
import { MetronicCoreModule } from "./metronic/metronic-core.module";
import { InterceptorModule } from "./interceptors/interceptor.module";

@NgModule({
    imports: [
        MetronicCoreModule,
        CommonServiceModule,
        InterceptorModule
    ]
})
export class CoreModule {}
import { APIConversionService } from './facebook-business/api-conversion.service';
import { NgModule } from "@angular/core";

import { APIClientService } from './api-client.service';
import { CpLocalStorageService } from "./cp-localstorage.service";
import { CpLoadingService } from "./cp-loading.service";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    APIClientService,
    CpLocalStorageService,
    CpLoadingService,
    APIConversionService
  ]
})
export class CommonServiceModule { }

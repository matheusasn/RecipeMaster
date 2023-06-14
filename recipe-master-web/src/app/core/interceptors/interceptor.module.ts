import { NgModule } from "@angular/core";

import { RequestInterceptorProvider } from "./request.interceptor";
import { ErrorInterceptorProvider } from "./error.interceptor";

@NgModule({
    providers: [
        RequestInterceptorProvider,
        ErrorInterceptorProvider
    ]
})
export class InterceptorModule {} 
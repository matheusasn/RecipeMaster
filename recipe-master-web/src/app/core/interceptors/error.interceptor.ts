import { Injectable, ChangeDetectorRef } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiResponse } from "../models/api-response";
import { HttpStatusCode } from "../constants/http-status-code";
import { ErrorMessages } from "../constants/error-messages";
import { ActiveToast, ToastrService } from "ngx-toastr";
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { CpRoutes } from "../constants/cp-routes";
import { TranslationService } from "../metronic/services/translation.service";
import { CpLocalStorageService } from "../services/common/cp-localstorage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	lang;

    constructor(private toast: ToastrService,
				private translationService: TranslationService,
        private router: Router,
				private _localStorage: CpLocalStorageService) {
				this.translationService.getSelectedLanguage().subscribe(lang => {
					this.lang = lang;
				});
    }

    activeToastr:ActiveToast<any>;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err, caught) => {

                console.warn(err, caught);

                let apiResponse: ApiResponse;

                if (err.error.message) {
                    apiResponse = err.error;
                } else {
                    apiResponse = {
                        status: err.status,
                        message: this.getMessage(err)
                    }
                }

								if (apiResponse.message === "Email já cadastrado") {
									return throwError(err);
								}

                if(this.redirectToLoginIfDeniedAccess(err.status)) {

                    if(!this.activeToastr) {
                        this.activeToastr = this.toast.warning("Faça seu login novamente.", "Sua sessão expirou!");
                    }

                    return throwError(err);

                }

                if(!this.activeToastr) {

									let errorMessage = 'Tente novamente mais tarde.';
									if (this.lang !== 'pt') {
										errorMessage = 'Try again later. And if the error persists, get in touch.'
									}

                    if(apiResponse.errors) {

											let errorTitle = 'Falha na conexão'
											if (this.lang !== 'pt') {
												errorTitle = 'Connection fail'
											}

                        this.activeToastr = this.toast.warning(errorMessage, errorTitle);

                    }
                    else {

											let errorTitle = 'Erro na conexão.'
											if (this.lang !== 'pt') {
												errorTitle = 'Connection error.'
											}

                        this.activeToastr = this.toast.error(errorMessage, errorTitle);

                    }

                    this.activeToastr.onHidden.subscribe( action => {
                        this.activeToastr = null;
                    });

                }

                return throwError(apiResponse);

            }) as any);
    }

    getErrors(apiResponse: ApiResponse): string {
        return apiResponse.errors.map( e => e.concat(" \n ")).join();
    }


    redirectToLoginIfDeniedAccess(status):boolean {

        if (status == HttpStatusCode.UNAUTHORIZED || status == HttpStatusCode.FORBIDDEN) {
						this._localStorage.clearToken();
            this.router.navigate([CpRoutes.LOGIN]);
            return true;
        }

        return false;
    }

    getMessage(err: any): string {
        if (err.message.includes(ErrorMessages.UNKNOWN_URL)) {
            return ErrorMessages.UNKNOWN_API;
        } else {
            return err.message;
        }

    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}

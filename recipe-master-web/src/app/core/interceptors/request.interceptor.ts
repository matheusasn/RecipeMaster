import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CpLocalStorageService } from "../services/common/cp-localstorage.service";
import { Token } from "../interfaces/token";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../constants/endpoints";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(public storageService: CpLocalStorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.endpointWithoutVerification(req)) {
            return next.handle(req);
        }
        let token: Token = this.getToken();
        if (token) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', token.token)
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
    endpointWithoutVerification(req: HttpRequest<any>): any {        
        return req.url.includes(ENDPOINTS.SECURITY.LOGIN) ||
               (req.url.endsWith(ENDPOINTS.SECURITY.USER) && req.method == 'POST') || 
               req.url.includes('geolocation-db') || req.url.includes('graph.facebook.com');
    }

    private getToken() {
        let token = this.storageService.getToken();
        if (token) {
            if (Array.isArray(token)) {
                return token[0];
            }
            return token;
        }
        return null;
    }
}

export const RequestInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
}

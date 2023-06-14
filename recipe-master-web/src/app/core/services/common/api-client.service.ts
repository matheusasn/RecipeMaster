import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ApiResponse } from './../../models/api-response';
import { ENDPOINTS } from "../../constants/endpoints";
import { APP_CONFIG } from "../../../config/app.config";

@Injectable()
export class APIClientService {

    constructor(private _httpClient: HttpClient) {
    }

    delete(uri: string, headers?: HttpHeaders) {
        return this._httpClient.delete<ApiResponse>(
            this.getUrl(uri),
            {
                headers
            }
        );
    }

    post(uri: string, body: any, headers?: HttpHeaders) {
        return this._httpClient.post<ApiResponse>(
            this.getUrl(uri),
            body,
            {
                headers
            }
        );
    }

    put(uri: string, body: any, headers?: HttpHeaders) {
        return this._httpClient.put<ApiResponse>(
            this.getUrl(uri),
            body,
            {
                headers
            }
        );
    }

    get(uri: string, headers?: HttpHeaders) {
        return this._httpClient.get<ApiResponse>(
            this.getUrl(uri),
            {
                headers
            }
        );
    }

		patch(uri: string, body: any) {
			return this._httpClient.patch<ApiResponse>(
				this.getUrl(uri),
				body
			);
		}

    getUrl(uri: string): string {
        let url: string = '';
        if (uri.endsWith(ENDPOINTS.SECURITY.LOGIN) || uri.endsWith(ENDPOINTS.SECURITY.LOGIN_FACEBOOK) ||
				uri.endsWith(ENDPOINTS.SECURITY.LOGIN_GOOGLE)) {
            url = APP_CONFIG.BASE_URL;
        } else {
            url = APP_CONFIG.BASE_FULL_URL;
        }
        return `${url}${uri}`
    }

    getExternal(uri: string) {

        return this._httpClient.get(uri);

    }

}

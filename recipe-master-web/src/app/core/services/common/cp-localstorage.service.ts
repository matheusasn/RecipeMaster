import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../../../config/storage_keys.config";
import { Token } from "../../interfaces/token";
import { User } from "../../models/user";
import * as _ from 'lodash';
import { registerLocaleData } from "@angular/common";
import localeBr from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { UserStatsDTO } from "../../../content/pages/business/admin/users/users.component";
import { ApiResponse } from "../../models/api-response";

//Criar Modulo
@Injectable()
export class CpLocalStorageService {

    saveStats(statsResponse:ApiResponse) {
        localStorage.setItem('USERS_STATS', JSON.stringify(statsResponse));
    }

		saveAppleData(plans: string) {
			localStorage.setItem('APPLE_DATA', JSON.stringify(plans));
		}

		getAppleData() {
			return localStorage.getItem('APPLE_DATA');
		}

		persistUserDevice(device: string) {
			localStorage.setItem('USER_DEVICE', device);
		}

		isIOS() {
			const userDevice = localStorage.getItem('USER_DEVICE')
			return userDevice && userDevice === 'iOS'
		}

    getStats():ApiResponse|null {

        try {

            let stats:ApiResponse = JSON.parse(localStorage.getItem('USERS_STATS'));

            return stats;

        }
        catch(e) {
            console.warn(e.message);
        }

        return null;

    }

    setToken(token: Token) {
        if (token == null) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        } else {
            localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
        }

        try {

            let user:User = this.getLoggedUser();

            if( ! _.isNil(user) ) {
                this.setCurrency( user.currency || "R$" );
								if (!_.isNil(user.defaultLanguage) && !_.isNil(localStorage.getItem('language'))) {
									if (user.defaultLanguage !== localStorage.getItem('language')) {
										localStorage.setItem('language', user.defaultLanguage);
										window.location.reload();
									}
								}
            }

        }
        catch(e) {
            console.warn(e.message);
        }

    }

    getToken(): Token {
        let token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token == null) {
            return null;
        } else {
            return JSON.parse(token);
        }
    }

    getLoggedUser(): User {

        let user: User;

        let token: Token = this.getToken();

        if (token) {

            if (Array.isArray(token)) {
                user = token[0].user;
            }
            else {
                user = token.user;
            }

        }

        return user;
    }

    setAvatar(photoUrl:string) {

        let token = this.getToken();

        token.user.photoUrl = photoUrl;

        this.setToken(token);

    }

    clearToken() {
        this.setToken(null);
				localStorage.removeItem('language')
				window.location.reload();
    }

    getCurrency():string {
        return localStorage.getItem(STORAGE_KEYS.CURRENCY);
    }

		getLocale() {
			const currency = this.getCurrency();
			if (currency === 'R$') {
				return 'pt'
			}
			return 'en'
		}

    setCurrency(currency: string, locale: string = 'pt') {
				if (currency !== this.getCurrency()) {
					window.location.reload();
				}
        localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);

        switch (currency) {
            case '$': {
              registerLocaleData(localeEn, 'en');
              break;
            }
            default:
                registerLocaleData(localeBr, 'pt');
          }

    }

}

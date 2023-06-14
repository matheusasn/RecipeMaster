import { from, Observable } from 'rxjs';
import { DeviceType } from '../../business/stats.service';
import { CpLocalStorageService } from '../cp-localstorage.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventResponse } from './interfaces/EventResponse';
import UserData from './interfaces/UserData';
import Content from './interfaces/Content';
import ServerEvent from './interfaces/ServerEvent';
import * as shajs from 'sha.js';

@Injectable()
export class APIConversionService {

    //api: FacebookAdsApi;
    private access_token: string;
    private pixel_id: string;

    constructor(
        private _httpClient: HttpClient,
        private storageService: CpLocalStorageService,
    ) {
        //this.api = FacebookAdsApi.init("access_token");
        this.access_token = environment.facebook_business.access_token;
        this.pixel_id = environment.facebook_business.pixel_id;
    }

    // async getCustomEventData() {
    //     let device = DeviceType.WEB;

    //     // @ts-ignore
    //     if (typeof Android !== 'undefined') {
    //         device = DeviceType.ANDROID;
    //     } else if (this.storageService.isIOS()) {
    //         device = DeviceType.iOS;
    //     }

    //     let ipAddress: any = await this.getIpAddress();

    //     return {
    //         platform: device,
    //         ip_address: ipAddress
    //     };
    // }

    createNewEvent(event_name: string) {
        let device = DeviceType.WEB;

        // @ts-ignore
        if (typeof Android !== 'undefined') {
            device = DeviceType.ANDROID;
        } else if (this.storageService.isIOS()) {
            device = DeviceType.iOS;
        }

        //let ipAddress: any = await this.getIpAddress();

        let current_timestamp: number = Math.floor((new Date().valueOf() / 1000));

        // const userData = (new UserData())
        //     .setEmails(['joe@eg.com'])
        //     .setPhones(['12345678901', '14251234567'])
        //     .setClientIpAddress(ipAddress)
        //     .setClientUserAgent(device)
        //     .setFbp('fb.1.1558571054389.1098115397')
        //     .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');
        const userData: UserData = {
            em: [this.getHash("rauny22@gmail.com")]
        };

        // const content = (new Content())
        //     .setId('product123')
        //     .setQuantity(1)
        //     .setDeliveryCategory(DeliveryCategory.HOME_DELIVERY);
        const content: Content = {
        };

        // const customData = (new CustomData())
        //     .setContents([content])
        //     .setCurrency('usd')
        //     .setValue(123.45);

        // const serverEvent = (new ServerEvent())
        //     .setEventName('Purchase')
        //     .setEventTime(current_timestamp)
        //     .setUserData(userData)
        //     .setCustomData(customData)
        //     .setEventSourceUrl('http://jaspers-market.com/product/123')
        //     .setActionSource('website');
        const serverEvent: ServerEvent = {
            event_name: event_name,
            event_time: current_timestamp,
            action_source: "website",
            user_data: userData
        };

        const data = [serverEvent];

        return this._httpClient.post<EventResponse>(`https://graph.facebook.com/v16.0/${this.pixel_id}/events?access_token=${this.access_token}`, {data});
    }

    private getIpAddress() {
        return this._httpClient.get('https://geolocation-db.com/json/').toPromise()
            .then((res: any) => res.IPv4)
            .catch(() => null);
    }

    private getHash(str: string): string {
        return shajs('sha256').update(str.toLowerCase()).digest('hex');
    }

}

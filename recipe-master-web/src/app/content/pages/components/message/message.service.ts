import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { Notification } from '../../../../core/models/business/dto/notification';
import { APIClientService } from '../../../../core/services/common/api-client.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { Message, MessageType, MessageResponse } from '../../../../core/models/business/dto/message';
import { ENDPOINTS } from '../../../../core/constants/endpoints';
import { NotificationService } from '../../../../core/services/business/notification.service';
import { MessageAddComponent } from './message-add/message-add.component';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

    modal:MatDialogRef<MessageModalComponent>;
    // newMessageEvent:EventEmitter<any>;

    constructor(private _apiService: APIClientService, private dialog:MatDialog, private notificationService: NotificationService) {
        // this.newMessageEvent = new EventEmitter<any>();
    }

    checkMessages(notifications:Notification[]) {

        if(notifications && notifications.length > 0) {

            notifications = _.orderBy(notifications, ['inclusion'], ['asc'])

            let n:Notification = notifications[0];

            if(n && n.objectId) {

                this._apiService.get(`${ENDPOINTS.BUSINESS.MESSAGES}/${n.objectId}`).subscribe( (response:ApiResponse) => {

                    let message:Message = response.data;

                    if(message && message.id && Object.keys(MessageType).includes(message.type) ) {
                        this.openModal(message, n);
                    }

                }, err => console.warn(err));

            }

        }

    }

    openCreateModal(selectedRows:any) {
        let config:MatDialogConfig = {
            data: {
                users:selectedRows,
                service: this
            },
            panelClass: 'cpPanelOverflow',
            disableClose: true,
            id: 'message-create-modal-uid'
        };

        let modal = this.dialog.open(MessageAddComponent, config);

        modal.afterClosed().subscribe( () => {

        }, err => console.warn(err) );

        return modal;
    }

    openModal(message:Message, notification:Notification):MatDialogRef<MessageModalComponent> {

        let config:MatDialogConfig = {
            data: {
                message,
                service: this
            },
            panelClass: 'message-modal-bottom',
            disableClose: true,
            id: 'message-modal-uid'
        };

        this.modal = this.dialog.open(MessageModalComponent, config);

        this.modal.afterClosed().subscribe( () => {

            this.notificationService.markAsRead([notification]);

        }, err => console.warn(err) );

        return this.modal;

    }

    doClose():void {
        this.modal.close();
    }

    notify(notifications:Notification[]) {
        return this._apiService.post(`${ENDPOINTS.BUSINESS.MESSAGES}/notifications`, notifications);
    }

    create(m:Message):Observable<ApiResponse> {
        return this._apiService.post(`${ENDPOINTS.BUSINESS.MESSAGES}`, m);
    }

    userResponse(userId:number, response:MessageResponse) {
        return this._apiService.post(`${ENDPOINTS.BUSINESS.MESSAGES}/user/${userId}`, response).toPromise();
    }

    uploadPhoto(imageDto:any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.STORAGE.MESSAGES}`, imageDto);
	}

}

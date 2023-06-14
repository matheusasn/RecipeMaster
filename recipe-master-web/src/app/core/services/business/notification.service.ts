import { Injectable } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../../constants/endpoints';
import { ApiResponse } from '../../models/api-response';
import { Notification, NotificationType } from '../../models/business/dto/notification';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NotificationModalComponent } from '../../../content/pages/components/notification-modal/notification-modal.component';
import { MessageService } from '../../../content/pages/components/message/message.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  modal:MatDialogRef<NotificationModalComponent>;

  constructor(private _apiService: APIClientService, private dialog:MatDialog) { }

  public checkNotifications(messageService:MessageService): void {

    this._apiService.get(`${ENDPOINTS.BUSINESS.NOTIFICATION}/unread`).subscribe( (response: ApiResponse) => {

        let notifications:any = response.data;

        if(response.errors && response.errors.length == 0 && notifications && notifications.length > 0) {

            let sharedRecipes:Notification[] = _.filter(notifications, ['type', NotificationType.RECIPE]);
            let messages:Notification[] = _.filter(notifications, ['type', NotificationType.MESSAGE]);

            if(sharedRecipes.length > 0) {

                this.openNotificationModal(sharedRecipes);

            }
            else if(messages.length > 0) {
                messageService.checkMessages(messages);
            }

        }

    }, err => {
        console.warn(err);
    });

  }

  public markAsRead(notifications: Notification[]) {
    notifications.forEach( (n:Notification) => {
      n.read = true;
      this.update(n).subscribe( (response:ApiResponse) => {
        console.log(response);
      }, (err) => {
        console.log(err);
      });

    });

  }

  private update(n: Notification): Observable<ApiResponse> {
    return this._apiService.put(ENDPOINTS.BUSINESS.NOTIFICATION, n);
  }

  openNotificationModal(sharedRecipes:Notification[]) {
    this.modal = this.dialog.open(NotificationModalComponent, {
      data: {
          notifications: sharedRecipes
      }
    });

    this.modal.afterClosed().subscribe( () => {

      this.markAsRead(sharedRecipes);

    }, err => console.warn(err) );

  }

}

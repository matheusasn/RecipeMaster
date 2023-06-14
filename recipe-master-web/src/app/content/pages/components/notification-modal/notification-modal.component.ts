import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Notification } from '../../../../core/models/business/dto/notification';

@Component({
  selector: 'm-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {

  notifications: Notification[];
  constructor(private _dialog: MatDialogRef<NotificationModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.notifications = this.data.notifications;
  }

//   ngAfterViewInit() {
//     console.log("after view init");
//     this.notificationService.markAsRead(this.notifications);
//   }

  cancel() {
    this._dialog.close({});
  }

}

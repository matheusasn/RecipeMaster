import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Message, MessageType, MessageResponse } from '../../../../../core/models/business/dto/message';
import { MessageService } from '../message.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';

@Component({
  selector: 'm-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {

    MessageType = MessageType;
    message:Message;
    service: MessageService;

    constructor(@Inject(MAT_DIALOG_DATA) private data:any, private dialog:MatDialog, private _localStorage:CpLocalStorageService) {
        this.message = data.message;
        this.service = data.service;
    }

    ngOnInit() {}

    doClose() {
        this.dialog.getDialogById('message-modal-uid').close();
    }

    doSubmit(response:MessageResponse) {

			let userId:number = this._localStorage.getLoggedUser().id;
			if (response && response.type === MessageType.OLD_USER_WITH_X_RECIPES) {
				this.service.userResponse(userId, response);
				return;
			}

        if(response && response.cancel === true) {
            this.dialog.getDialogById('message-modal-uid').close();
            return;
        }

        response.type = this.message.type;
        response.title = `${this.message.title} (${this.message.id})`;

        if(this.message.type == MessageType.WIZARD) {

            let config:any = JSON.parse(this.message.config);

            try {
                if(config[0] && config[0].sendmail === true) {
                    this.service.userResponse(userId, response);
                }
            }
            catch(e) {
                console.warn(e);
            }

        }
        if(this.message.type == MessageType.WELCOME_FIREBASE) {

            let config:any = JSON.parse(this.message.config);

            if(config && config.sendmail === true) {
                this.service.userResponse(userId, response);
            }

            if(response.migrar === true) {
                return; // não é para fechar o modal para aparecer a última mensagem
            }

        }
        else {

            let config:any = JSON.parse(this.message.config);

            if(config && config.sendmail === true) {
                this.service.userResponse(userId, response);
            }
        }

        this.dialog.getDialogById('message-modal-uid').close();

    }

}

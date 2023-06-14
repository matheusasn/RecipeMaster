import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageType, Message } from '../../../../../core/models/business/dto/message';
import { MessageService } from '../message.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { Notification, NotificationType } from '../../../../../core/models/business/dto/notification';
import * as _ from 'lodash';
import { APP_CONFIG } from '../../../../../config/app.config';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'm-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.scss']
})
export class MessageAddComponent implements OnInit {

    users:any;
    form:FormGroup;
    types:any = [MessageType.BUTTONS, MessageType.INPUT, MessageType.NPS_RANKING]; //Object.values(MessageType);
    service:MessageService;
    loading:boolean = true;
    avatar: string = 'assets/avatar.png';
    cropOtions:any = {
		aspectRatio: 1
    };
    baseUrl:string = APP_CONFIG.S3_MESSAGES_URL;
    photoAtual:string;
    wizard:Message[];

    constructor(@Inject(MAT_DIALOG_DATA) private data:any, private dialog:MatDialog, private fb:FormBuilder, private _toast: ToastrService) {
        this.users = data.users;
        this.service = data.service;
    }

    ngOnInit() {
        this.buildForm();
    }

    onPhotoChange(base64Content:any) {
        this.photoAtual = base64Content;

        this.form.patchValue({
            photoContent: base64Content
        });

    }

    doWizardNext() {

        if(!this.wizard) {
            this.wizard = [];
        }

        if(this.form.invalid) {
            this._toast.warning("Preencha todos os campos obrigatórios.");
            return;
        }

        this.wizard.push(this.createMessage());

        this.form.reset();

    }

    doSubmit(ev:any) {

        if(this.wizard && this.wizard.length > 0) {
            this.doSubmitWizard();
        }
        else {
            this.doSubmitSingle();
        }
    }

    private async doSubmitWizard() {

        this.loading = true;

        try {

            let lastPhotoResponse:any;

            for(var i = 0; i<this.wizard.length; i++) {

                let m:Message = this.wizard[i];

                if(m.photoContent) {

                    let imageDto:any = {
                        content: m.photoContent
                    };

                    let photoResponse:any = await this.service.uploadPhoto(imageDto).toPromise().catch(err => console.warn(err));

                    if(photoResponse && photoResponse.data && photoResponse.data.key) {
                        m.photoUrl = this.baseUrl + photoResponse.data.key;
                        lastPhotoResponse = photoResponse;
                    }

                    delete(m.photoContent);

                }
                else if(lastPhotoResponse && lastPhotoResponse.data && lastPhotoResponse.data.key) {
                    m.photoUrl = this.baseUrl + lastPhotoResponse.data.key;
                }

            }

            let data:Message = this.wizard[0];

            let message:Message;

            if(this.wizard.length > 1) {
                message = {
                    title: data.title,
                    text: data.text,
                    type: MessageType.WIZARD,
                    config: JSON.stringify(this.wizard)
                };
            }
            else {
                message = {
                    title: data.title,
                    text: data.text,
                    type: data.type,
                    config: data.config
                };
            }

            this.service.create(message).subscribe( (response:ApiResponse) => {

                if(response.data && response.data.id) {

                    let notifications:Notification[] = this.createNotifications(this.users,response.data.id, message.type);

                    this.service.notify(notifications).toPromise();

                    this._toast.success("Mensagem criada com sucesso!");

                    this.doClose();

                }
                else {
                    this._toast.warning("Não criou a mensagem. Tente novamente mais tarde.");
                    this.loading = false;
                }

            }, err => {
                this._toast.warning(err.message);
                console.warn(err);
                this.loading = false;
            });

        }
        catch(e) {
            console.warn(e.message);
            this._toast.warning(e.message);
            this.loading = false;
        }

    }

    private createNotifications(users:any[], id:number, type:MessageType):Notification[] {

        let notifications:Notification[] = [];

        _.each(users, (u:any) => {
            notifications.push({
                message: `Notificação de mensagem do tipo: ${type}`,
                objectId: id,
                type: NotificationType.MESSAGE,
                userid: u.id
            })
        });

        return notifications;

    }

    private createMessage(data:any = null):Message {

        if(!data) {
            data = this.form.value;
        }

        let config:any = null;

        if(data.type == MessageType.BUTTONS) {
            config = JSON.stringify({
                label1: data.config.label1,
                label2: data.config.label2,
                url1: data.config.url1,
                url2: data.config.url2,
                cancel1: data.config.cancel1,
                cancel2: data.config.cancel2,
                sendmail: data.sendmail
            });
        }
        else if(data.sendmail && data.sendmail===true) {
            config = JSON.stringify({
                sendmail: true
            });
        }

        let message:Message = {
            title: data.title,
            text: data.text,
            type: data.type,
            config: config,
            photoUrl: data.photoUrl
        };

        if(data.photoContent) {
            message.photoContent = data.photoContent;
        }

        return message;

    }

    private async doSubmitSingle() {

        if(this.form.invalid) {
            this._toast.warning("Preencha todos os campos obrigatórios.");
            return;
        }

        this.loading = true;
        let photoResponse:any;

        if(this.photoAtual) {

            let imageDto:any = {
                content: this.photoAtual
            };

            photoResponse = await this.service.uploadPhoto(imageDto).toPromise().catch(err => console.warn(err));

        }

        try {

            if(photoResponse && photoResponse.data && photoResponse.data.key) {
                this.form.patchValue({
                    photoUrl: this.baseUrl + photoResponse.data.key
                });
            }

            let message:Message = this.createMessage();

            this.service.create(message).subscribe( (response:ApiResponse) => {

                if(response.data && response.data.id) {

                    let notifications:Notification[] = this.createNotifications(this.users,response.data.id, message.type);

                    this.service.notify(notifications).toPromise();

                    this._toast.success("Mensagem criada com sucesso!");

                    this.doClose();

                }
                else {
                    this._toast.warning("Não criou a mensagem. Tente novamente mais tarde.");
                    this.loading = false;
                }

            }, err => {
                this._toast.warning(err.message);
                console.warn(err);
                this.loading = false;
            });

        }
        catch(e) {
            console.warn(e.message);
            this._toast.warning(e.message);
            this.loading = false;
        }


    }

    doClose() {
        this.dialog.getDialogById('message-create-modal-uid').close();
    }

    private buildForm() {

        this.form = this.fb.group({
            title: ['', Validators.required],
            text: [''],
            type: [null, Validators.required],
            config: this.fb.group({
                label1: [null],
                label2: [null],
                url1: [null],
                url2: [null],
                cancel1: [null],
                cancel2: [null]
            }),
            photoUrl: [null],
            photoContent: [null],
            sendmail: [true]
        });

        this.loading = false;

    }

}

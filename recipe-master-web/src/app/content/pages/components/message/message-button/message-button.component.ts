import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageResponse } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-message-button',
  templateUrl: './message-button.component.html',
  styleUrls: ['./message-button.component.scss']
})
export class MessageButtonComponent implements OnInit {

    @Input() message:Message;
    @Output() onSubmit:EventEmitter<MessageResponse>;
    config:any;
        
    constructor() { 
        this.onSubmit = new EventEmitter<any>();
    }

    get label1() {
        return this.config && this.config.label1?this.config.label1:'OK';
    }

    get label2() {
        return this.config && this.config.label2?this.config.label2:false;
    }

    get url1() {
        return this.config && this.config.url1?this.config.url1:false;
    }

    get url2() {
        return this.config && this.config.url2?this.config.url2:false;
    }

    get cancel1() {
        return this.config && this.config.cancel1 && this.config.cancel1===true?true:false;
    }

    get cancel2() {
        return this.config && this.config.cancel2 && this.config.cancel2===true?true:false;
    }

    ngOnInit() {

        if(this.message.config) {

            try {
                this.config = JSON.parse(this.message.config);
            }
            catch(e) {
                console.warn(e);
            }
        }

    }

    doSubmit(label:string, cancel:boolean) {
        this.onSubmit.emit({
            title: this.message.title,
            type: this.message.type,
            data: label,
            cancel: cancel
        });
    }

}

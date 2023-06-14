import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageResponse } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-message-welcome-firebase',
  templateUrl: './message-welcome-firebase.component.html',
  styleUrls: ['./message-welcome-firebase.component.scss']
})
export class MessageWelcomeFirebaseComponent implements OnInit {

  @Input() message:Message;
  @Output() onSubmit:EventEmitter<MessageResponse>;
  config:any;

  accepted:boolean = false;

  constructor() {
      this.onSubmit = new EventEmitter<any>();
  }

  get label1() {
      return this.config && this.config.label1?this.config.label1:'Sim';
  }

  get label2() {
      return this.config && this.config.label2?this.config.label2:'Depois';
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

  doSubmit(label:string) {

    if(label == 'Sim') {
        this.accepted = true;
    }

    this.onSubmit.emit({
        title: this.message.title,
        type: this.message.type,
        data: label,
        migrar: label == 'Sim'?true:false,
        cancel: label == 'Sim'?false:true
    });
  }

}

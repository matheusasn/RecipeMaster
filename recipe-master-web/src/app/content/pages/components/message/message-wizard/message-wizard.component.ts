import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Message, MessageResponse, MessageType } from '../../../../../core/models/business/dto/message';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'm-message-wizard',
  templateUrl: './message-wizard.component.html',
  styleUrls: ['./message-wizard.component.scss']
})
export class MessageWizardComponent implements OnInit {

  MessageType = MessageType;
  @Input() message:Message;
  @Output() onSubmit:EventEmitter<MessageResponse>;
  @ViewChild('usefulSwiper') usefulSwiper: SwiperComponent;
  config: SwiperOptions = {
      pagination: { el: '.swiper-pagination', clickable: false },
      simulateTouch : false,
      allowTouchMove: false
  };
  form:FormGroup;
  wizard:Message[];
  responses:MessageResponse[] = [];

  constructor() {
    this.onSubmit = new EventEmitter<MessageResponse>();
  }

  ngOnInit() {
    this.wizard = JSON.parse(this.message.config);
  }

  doSubmit(ev:MessageResponse) {
    this.responses.push(ev);

    this.usefulSwiper.swiper.slideNext();

    if( this.responses.length == this.wizard.length ) {
      this.onSubmit.emit({
        title: this.message.title,
        type: this.message.type,
        wizard: this.responses
      });
    }

  }

}

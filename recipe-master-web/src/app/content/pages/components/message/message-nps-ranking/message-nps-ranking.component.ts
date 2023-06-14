import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageResponse } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-message-nps-ranking',
  templateUrl: './message-nps-ranking.component.html',
  styleUrls: ['./message-nps-ranking.component.scss']
})
export class MessageNpsRankingComponent implements OnInit {

  @Input() message:Message;
  @Output() onSubmit: EventEmitter<MessageResponse>;

  constructor() {
    this.onSubmit = new EventEmitter<MessageResponse>();
  }

  ngOnInit() {
  }

  doRecomendar(response:number) {

    this.onSubmit.emit({
      title: this.message.title,
      type: this.message.type,
      data: response.toString()
    });
  }


}

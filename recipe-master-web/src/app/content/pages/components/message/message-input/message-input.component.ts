import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageResponse } from '../../../../../core/models/business/dto/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'm-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {

    @Input() message:Message;
    @Output() onSubmit:EventEmitter<MessageResponse>;
    form:FormGroup;
    
    constructor(private fb:FormBuilder) {
        this.onSubmit = new EventEmitter<any>();
        this.buildForm();
    }

    ngOnInit() {
    }

    doSubmit() {

        if(this.form.invalid) {
            console.warn("algum erro no form...");
            return;
        }

        this.onSubmit.emit({
            title: this.message.title,
            type: this.message.type,
            data: this.form.value.text
        });
        
    }

    private buildForm() {
        this.form = this.fb.group({
            text: [""]
        });
    }

}

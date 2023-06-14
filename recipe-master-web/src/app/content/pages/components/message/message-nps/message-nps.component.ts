import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-message-nps',
  templateUrl: './message-nps.component.html',
  styleUrls: ['./message-nps.component.scss']
})
export class MessageNpsComponent implements OnInit {

    @Input() message:Message;
    @Output() onSubmit:EventEmitter<any>;
    showPesquisa:boolean = false;
    config:any;

    constructor(private translate : TranslateService) {
        this.onSubmit = new EventEmitter<any>();
    }

    get label1() {
        let labelNegacao: string;
        this.translate.get('RECIPE.MODAL_USER_NOTA.MODAL_1_BTNNAO').subscribe(data => labelNegacao = data);

        return this.config && this.config.label1 ? this.config.label1 : labelNegacao;
    }

    get label2() {
        let labelSim: string;
        this.translate.get('RECIPE.MODAL_USER_NOTA.MODAL_1_BTNSIM').subscribe(data => labelSim = data);

        return this.config && this.config.label2 ? this.config.label2 : labelSim;
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

        // if(!this.message.photoUrl) {
        //     this.message.photoUrl = './assets/avatar.png';
        // }

    }

    doPesquisa() {
        this.showPesquisa = true;
    }

    doCancel(label:string) {
        this.onSubmit.emit({text: label});
    }

    doSubmit(data:any) {
        this.onSubmit.emit(data);
    }

}

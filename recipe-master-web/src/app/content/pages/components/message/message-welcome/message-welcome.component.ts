import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../../../../../core/models/business/dto/message';
import { TutorialItem } from '../../tutorial-card/tutorial-card.component';
import { CPTutorial } from '../../../../../config/tutorial.config';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'm-message-welcome',
  templateUrl: './message-welcome.component.html',
  styleUrls: ['./message-welcome.component.scss']
})
export class MessageWelcomeComponent implements OnInit {

    @Input() message:Message;
    @Output() onSubmit:EventEmitter<any>;
    config:any;
    swiperConfig: SwiperOptions = {
        // pagination: { el: '.swiper-pagination', clickable: true },
        // simulateTouch : false,
        // allowTouchMove: false
        autoHeight: true,
        slidesPerView: 4,
        spaceBetween: 5,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1208: {
                slidesPerView: 3,
                spaceBetween: 5
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 5
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 1
            }
        }
    };

    tutorialItens:TutorialItem[] = CPTutorial.itens;
    viewTutorial:boolean = false;

    constructor() {
        this.onSubmit = new EventEmitter<any>();
    }

    get label1() {
        return this.config && this.config.label1?this.config.label1:'Sim';
    }

    get label2() {
        return this.config && this.config.label2?this.config.label2:'Não, obrigado!';
    }

    get url1() {
        return this.config && this.config.url1?this.config.url1:false;
    }

    get url2() {
        return this.config && this.config.url2?this.config.url2:false;
    }

    ngOnInit() {

        this.message.title = "Olá! Seja bem-vindo ao recipemaster!";
        this.message.text = "Você gostaria de uma explicação sobre as funcionalidades antes de começar?";
        this.message.config = JSON.stringify({
            label1: "Sim",
            label2: 'Não, obrigado!',
            url1: '/suporte'
        });

        if(this.message.config) {

            try {
                this.config = JSON.parse(this.message.config);
            }
            catch(e) {
                console.warn(e);
            }
        }

    }

    doConfirm(label:string) {
        this.viewTutorial = true;
    }

    doCancel(label:string) {
        this.onSubmit.emit({
            title: this.message.title,
            type: this.message.type,
            data: label
        });
    }

}

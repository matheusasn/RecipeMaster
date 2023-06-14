import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { PesquisaUser } from '../../../../../core/models/business/pesquisaUser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { MessageResponse, MessageType } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-message-nps-swiper',
  templateUrl: './message-nps-swiper.component.html',
  styleUrls: ['./message-nps-swiper.component.scss']
})
export class MessageNpsSwiperComponent implements OnInit {

    @ViewChild('usefulSwiper') usefulSwiper: SwiperComponent;
    config: SwiperOptions = {
        pagination: { el: '.swiper-pagination', clickable: false },
        simulateTouch : false, 
        allowTouchMove: false
    };
    form:FormGroup;
    @Output() onSubmit:EventEmitter<MessageResponse>;

    get npsLabel():string {

        if(this.form.value.recomendar < 9) {
            return "O que nós poderíamos melhorar para conseguir receber uma nota 10?";
        }
        else {
            return "";
        }
    }

    constructor(private fb:FormBuilder, private recipeService:RecipeService, private _localStorage: CpLocalStorageService) { 
        this.onSubmit = new EventEmitter<any>();
    }

    ngOnInit() {
        this.buildForm();
    }

    private buildForm() {

        this.form = this.fb.group({
            util: [null],
            dificuldade: [""],
            melhoria: [""],
            recomendar: [null],
            infoMelhoria: [""]
        });
    }

    doUtil(util:number) {
        this.form.patchValue({
            util: util
        });
        this.usefulSwiper.swiper.slideNext();
    }

    doDificuldade() {
        this.usefulSwiper.swiper.slideNext();
    }

    doMelhoria() {
        this.usefulSwiper.swiper.slideNext();
    }

    doRecomendar(recomendar:number) {
        this.form.patchValue({
            recomendar: recomendar
        });
        this.usefulSwiper.swiper.slideNext();
    }

    doSubmit() {

        if(this.form.invalid) {
            console.log("formulário inválido", this.form);
            return;
        }

        this.onSubmit.emit({
            title: "NPS (auto)",
            type: MessageType.NPS,

            util: this.form.value.util,
            dificuldade: this.form.value.dificuldade,
            melhoria: this.form.value.melhoria,
            recomendar: this.form.value.recomendar, // o número NPS
            infoMelhoria: this.form.value.infoMelhoria

        });

    }

}

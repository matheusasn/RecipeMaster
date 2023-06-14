import { Component, OnInit, Input } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { environment } from '../../../../../../../environments/environment';

export const PAYMENT_TYPE:string[] = ["PICPAY", "PAYPAL", "PAGSEGURO"];

export class Payment {
    title:string;
    price:number;
    qrcode:string;
}

export const PAYMENTS:any = {
    "PICPAY": (hasDiscount: boolean) => {
        return [
            {
                title: hasDiscount ? environment.plans.qr_code.picpay.pro_nutri_40off.description : environment.plans.qr_code.picpay.pro_nutri.description,
                price: hasDiscount ? environment.plans.qr_code.picpay.pro_nutri_40off.values.annually : environment.plans.qr_code.picpay.pro_nutri.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/picpay/PICPAY PLANO PRONUTRI 40 OFF.png" : "assets/payment/qrcodes/picpay/PICPAY PLANO PRONUTRI.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.picpay.pro_40off.description : environment.plans.qr_code.picpay.pro.description,
                price: hasDiscount ? environment.plans.qr_code.picpay.pro_40off.values.annually : environment.plans.qr_code.picpay.pro.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/picpay/PICPAY PLANO PROFISSIONAL 40 OFF.png" : "assets/payment/qrcodes/picpay/PICPAY PLANO PROFISSIONAL.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.picpay.basic_40off.description : environment.plans.qr_code.picpay.basic.description,
                price: hasDiscount ? environment.plans.qr_code.picpay.basic_40off.values.annually : environment.plans.qr_code.picpay.basic.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/picpay/PICPAY PLANO INICIAL 40 OFF.png" : "assets/payment/qrcodes/picpay/PICPAY PLANO INICIAL.png"
            },
        ];
    },
    "PAYPAL": (hasDiscount: boolean) => {
        return [
            {
                title: hasDiscount ? environment.plans.qr_code.paypal.pro_nutri_40off.description : environment.plans.qr_code.paypal.pro_nutri.description,
                price: hasDiscount ? environment.plans.qr_code.paypal.pro_nutri_40off.values.annually : environment.plans.qr_code.paypal.pro_nutri.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/paypal/PAYPAL PLANO PRONUTRI 40 OFF.png" : "assets/payment/qrcodes/paypal/PAYPAL PLANO PRONUTRI.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.paypal.pro_40off.description : environment.plans.qr_code.paypal.pro.description,
                price: hasDiscount ? environment.plans.qr_code.paypal.pro_40off.values.annually : environment.plans.qr_code.paypal.pro.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/paypal/PAYPAL PLANO PROFISSIONAL 40 OFF.png" : "assets/payment/qrcodes/paypal/PAYPAL PLANO PROFISSIONAL.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.paypal.basic_40off.description : environment.plans.qr_code.paypal.basic.description,
                price: hasDiscount ? environment.plans.qr_code.paypal.basic_40off.values.annually : environment.plans.qr_code.paypal.basic.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/paypal/PAYPAL PLANO INICIAL 40 OFF.png" : "assets/payment/qrcodes/paypal/PAYPAL PLANO INICIAL.png"
            }
        ];
    },
    "PAGSEGURO": (hasDiscount: boolean) => {
        return [
            {
                title: hasDiscount ? environment.plans.qr_code.pagseguro.pro_nutri_40off.description : environment.plans.qr_code.pagseguro.pro_nutri.description,
                price: hasDiscount ? environment.plans.qr_code.pagseguro.pro_nutri_40off.values.annually : environment.plans.qr_code.pagseguro.pro_nutri.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO PRONUTRI 40 OFF.png" : "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO PRONUTRI.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.pagseguro.pro_40off.description : environment.plans.qr_code.pagseguro.pro.description,
                price: hasDiscount ? environment.plans.qr_code.pagseguro.pro_40off.values.annually : environment.plans.qr_code.pagseguro.pro.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO PROFISSIONAL 40 OFF.png" : "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO PROFISSIONAL.png"
            },
            {
                title: hasDiscount ? environment.plans.qr_code.pagseguro.basic_40off.description : environment.plans.qr_code.pagseguro.basic.description,
                price: hasDiscount ? environment.plans.qr_code.pagseguro.basic_40off.values.annually : environment.plans.qr_code.pagseguro.basic.values.annually,
                qrcode: hasDiscount ? "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO INICIAL 40 OFF.png" : "assets/payment/qrcodes/pagseguro/PAGSEGURO PLANO INICIAL.png"
            }
        ];
    }

};

@Component({
  selector: 'm-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

    @Input() type:string = PAYMENT_TYPE[0];
		@Input() hasDiscount:boolean;
    plans:any;
    label:string;

    config: SwiperOptions = {
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    };

    payments:Payment[];

    constructor() { }

    ngOnInit() {
        this.payments = PAYMENTS[this.type](this.hasDiscount);

        switch(this.type) {
            case PAYMENT_TYPE[0]: //picpay
                this.plans = environment.plans.qr_code.picpay;
                this.label = "PicPay";
                break;
            case PAYMENT_TYPE[1]: //paypal
                this.plans = environment.plans.qr_code.paypal;
                this.label = "PayPal";
                break;
            case PAYMENT_TYPE[2]: //pagseguro
                this.plans = environment.plans.qr_code.pagseguro;
                this.label = "Pagseguro";
                break;
        }

    }

}

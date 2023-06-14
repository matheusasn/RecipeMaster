import { Injectable, EventEmitter } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class CpLoadingService {

    public loadingHideEvent: EventEmitter<any> = new EventEmitter();

    constructor(private _spinner: NgxSpinnerService) {
    }

    show() {
        this._spinner.show();
    }

    hide() {

        try {

            this._spinner.hide();
            this.loadingHideEvent.emit();

        }
        catch(e) {
            console.warn(e.message);
        }

    }

}

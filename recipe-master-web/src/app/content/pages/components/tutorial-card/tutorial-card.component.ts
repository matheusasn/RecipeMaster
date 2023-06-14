import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TutorialIframeComponent } from '../tutorial-iframe/tutorial-iframe.component';
import { TutorialIframePopupComponent } from '../tutorial-iframe-popup/tutorial-iframe-popup.component';

export interface TutorialItem {
  image: string;
  title: string;
  url?: string;
  router?: string;
}

@Component({
  selector: 'm-tutorial-card',
  templateUrl: './tutorial-card.component.html',
  styleUrls: ['./tutorial-card.component.scss']
})
export class TutorialCardComponent implements OnInit {

  @Input() item: TutorialItem;
  @Input() mode:string;
  @Output() onClick:EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  doClick() {

    if(this.mode == "iframe") {

      let config:MatDialogConfig = {
        data: {
          url: this.item.url
        },
        panelClass: 'message-modal-bottom',
        id: 'tutorial-modal-uid'
      };
  
      this.dialog.open(TutorialIframePopupComponent, config);

    }
    else if(this.mode == "onclick") {
      this.onClick.emit(this.item.url);
    }
    else {
      
      window.open(this.item.url, "_blank");

    }

  }

}

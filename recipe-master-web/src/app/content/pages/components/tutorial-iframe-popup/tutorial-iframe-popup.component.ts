import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'm-tutorial-iframe-popup',
  templateUrl: './tutorial-iframe-popup.component.html',
  styleUrls: ['./tutorial-iframe-popup.component.scss']
})
export class TutorialIframePopupComponent implements OnInit {

  url:string;

  constructor(@Inject(MAT_DIALOG_DATA) private data:any, private dialog: MatDialog) { 

    if(data && data.url) {
      this.url = data.url;
    }

  }

  ngOnInit() { }

  doClose() {
    this.dialog.getDialogById('tutorial-modal-uid').close();
  }

}

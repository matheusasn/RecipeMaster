import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'm-tutorial-iframe',
  templateUrl: './tutorial-iframe.component.html',
  styleUrls: ['./tutorial-iframe.component.scss']
})
export class TutorialIframeComponent implements OnInit {

  @Input() url:string;
  safeUrl:SafeUrl;
  @Output() onClose:EventEmitter<void> = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  doClose() {
    // this.dialog.getDialogById('tutorial-modal-uid').close();
    this.onClose.emit();
  }

}

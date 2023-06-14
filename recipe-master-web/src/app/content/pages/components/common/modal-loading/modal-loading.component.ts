import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'm-modal-loading',
  templateUrl: './modal-loading.component.html',
  styleUrls: ['./modal-loading.component.scss']
})
export class ModalLoadingComponent implements OnInit {

	message: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private _dialog: MatDialogRef<ModalLoadingComponent>) {
		this.message = data.text;
		this._dialog.disableClose = true;
	}

  ngOnInit() {
		setTimeout(() => this._dialog.close(), 3000);
  }

}

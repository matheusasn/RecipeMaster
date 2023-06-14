import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../../../core/services/business/admin.service';

@Component({
  selector: 'm-newpwdmodal',
  templateUrl: './newpwdmodal.component.html',
  styleUrls: ['./newpwdmodal.component.scss']
})
export class NewPwdModalComponent implements OnInit {
		form: FormGroup;

    constructor(
			private _formBuilder: FormBuilder,
			private _dialogRef: MatDialogRef<NewPwdModalComponent>,
			@Inject(MAT_DIALOG_DATA) private data: any,
			private adminService: AdminService
			) {}

    ngOnInit() {
			this.createForm();
    }

		createForm() {
			this.form = this._formBuilder.group({
				password: ['', [Validators.required]],
			})
		}

		save() {
			if (this.form.valid) {
				this.adminService.updateUserPassword(this.data.selected.id, this.form.value.password).subscribe(response => {
					this._dialogRef.close({ ok: true });
				})
			}
		}

}

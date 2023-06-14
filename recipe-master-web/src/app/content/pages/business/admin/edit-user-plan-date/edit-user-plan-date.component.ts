import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../core/auth/user.service';
import { User } from '../../../../../core/models/user';
import * as moment from 'moment';
import { ApiResponse } from '../../../../../core/models/api-response';
import { PlanDateUpdate } from '../../../../../core/models/business/plan';

@Component({
  selector: 'm-edit-user-plan-date',
  templateUrl: './edit-user-plan-date.component.html',
  styleUrls: ['./edit-user-plan-date.component.scss']
})
export class EditUserPlanDateComponent implements OnInit {

	user:User;
  form:FormGroup;
	date: string = "2010/10/10";
	dateName: string = "Data de Vencimento do Plano";

  constructor(@Inject(MAT_DIALOG_DATA) private data:any,
	 private userService:UserService,
	 private fb:FormBuilder,
	 private dialog:MatDialogRef<any>
	) { }

  ngOnInit() {

    this.user = this.data.user;
		this.dateName = this.data.dateName;

		this.date = moment(this.user.plan.expiration).toDate().toISOString().split('T')[0];

		this.buildForm();
  }

	private buildForm() {
		this.form = this.fb.group({
			date: [this.date, []]
		});
  }

  doSubmit() {

    const update: PlanDateUpdate = {
			date: moment(this.form.value.date).toDate(),
			userId: this.user.id
		}

		this.userService.updatePlanExpiration(update).subscribe((response: ApiResponse) => {
			this.user.plan.expiration = update.date;
			this.dialog.close(this.user);
		})

  }

	doCancel(ev:any) {
    this.dialog.close();
  }

}

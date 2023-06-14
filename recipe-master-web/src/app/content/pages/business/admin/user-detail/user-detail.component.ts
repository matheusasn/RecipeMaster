import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../core/auth/user.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { User } from '../../../../../core/models/user';
import * as _ from 'lodash';
import { Dialog } from 'primeng/dialog';

export interface PerfilItem {
  perfil:PerfilEnum;
  checked:boolean;
}

@Component({
  selector: 'm-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user:User;
  form:FormGroup;
  perfis:PerfilItem[];

  constructor(@Inject(MAT_DIALOG_DATA) private data:any, private userService:UserService, private fb:FormBuilder, private dialog:MatDialogRef<any>) { }

  ngOnInit() {

    this.buildPerfis();

    let u:any = this.data.user;

    this.userService.findById(u.id).subscribe( (response:ApiResponse) => {
      if(response && response.data) {
        this.user = response.data;

        this.user.perfis.forEach( (p:PerfilEnum) => {

          let perfil:PerfilItem = _.find( this.perfis, {'perfil' : p} );

          if(perfil) {
            perfil.checked = true;
          }

        } );

      }

      this.buildForm();

    }, err => {
      console.warn(err);
    } );

  }

  doChange(p:PerfilItem) {
    p.checked = !p.checked;
  }

  doSubmit() {

    let perfis:PerfilEnum[] = [];

    this.perfis.forEach( (p:PerfilItem) => {

      if(p.checked === true) {
        perfis.push(p.perfil);
      }

    } );

    this.user.perfis = perfis;

    this.userService.updateByAdmin(this.user).subscribe( (response:ApiResponse) => {
      this.dialog.close(response.data);

    }, err => {
      console.warn(err);
    } );

  }

  doCancel(ev:any) {
    this.dialog.close();
  }

  private buildForm() {

    this.form = this.fb.group({
      perfis: this.fb.array(this.perfis)
    });

  }

  private buildPerfis() {

    this.perfis = [
      {
        perfil: PerfilEnum.NONE,
        checked: false
      },
      {
        perfil: PerfilEnum.ADMIN,
        checked: false
      },
      {
        perfil: PerfilEnum.USER,
        checked: false
      },
      {
        perfil: PerfilEnum.USER_BASIC,
        checked: false
      },
      {
        perfil: PerfilEnum.USER_PRO,
        checked: false
      },
      {
        perfil: PerfilEnum.USER_PRO_NUTRI,
        checked: false
      },
      {
        perfil: PerfilEnum.USER_BETA,
        checked: false
      },
      {
        perfil: PerfilEnum.USER_INTERNAL,
        checked: false
      }
    ];

  }

}

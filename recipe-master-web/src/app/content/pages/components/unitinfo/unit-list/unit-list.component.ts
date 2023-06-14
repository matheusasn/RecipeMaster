import { Component, OnInit, Inject } from '@angular/core';
import { Unit } from '../../../../../core/models/business/unit';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import swal, { SweetAlertOptions } from 'sweetalert2';
import * as _ from 'lodash';
import { UnitEditComponent } from '../unit-edit/unit-edit.component';
import { User } from '../../../../../core/models/user';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'm-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {

    ingredient:Ingredient;
    unit:Unit;
    units:Unit[];
    userUnits:Unit[];
    user:User;
	lastUnit: Unit;

    constructor(
        private dialogRef: MatDialogRef<UnitListComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialog: MatDialog,
        private toaster: ToastrService,
        private unitService: UnitService,
        private translate: TranslateService) {

        this.ingredient = data.ingredient;
        this.unit = data.unit;
        this.units = data.units;
        this.user = data.user;
        this.userUnits = _.filter(data.units, (u:Unit) => {
            return !_.isNil(u.userId) || !_.isNil(u.ingredientId);
        });

    }

    ngOnInit() {
    }

    doEditar(item:Unit) {

        let createUnitModal = this.dialog.open(UnitEditComponent, {
            data: {
              unit: item,
              ingredient: this.ingredient,
              units: this.units,
              user: this.user,
			  type: this.data.type
            },
            panelClass: 'custom-modalbox'
        });

        createUnitModal.afterClosed().subscribe( (response:any) => {
            if(!response) {
                return;
            }

            this.lastUnit = response.unit;

            let u:Unit = _.find(this.units, {id: item.id});
            if (u) {
                Object.assign(u, response.unit);
            } else {
                this.units.push(response.unit);
            }
        });

    }

    doClose() {
        this.dialogRef.close({
            units: this.units,
			lastUnit: this.lastUnit
        });
    }

    async doExcluir(item:Unit) {

        let txtBtnExcluir: string;
        let txtBtnCancel: string;
        let txtAlert: string;
        
        this.translate.get('INPUTS.BACK').subscribe(data => txtBtnCancel = data);
        this.translate.get('INPUTS.DELETE').subscribe(data => txtBtnExcluir = data);
        this.translate.get('ALERTS.TXT2').subscribe(data => txtAlert = data);

        const op: SweetAlertOptions = {
            title: '',
            text: txtAlert,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f4516c',
            cancelButtonColor: '#d2d2d2',
            confirmButtonText: txtBtnExcluir,
            cancelButtonText: txtBtnCancel,
        };

        swal(op).then((result) => {

            let txtAlertRemove: string;
            this.translate.get('ALERTS.TXT3').subscribe(data => txtAlertRemove = data);

            if (result.value) {

                this.unitService.delete(this.user.id, item.id).subscribe( (response:ApiResponse) => {
                    this.toaster.success(txtAlertRemove);

                    // remover do this.units e
                    // this.onDelete.emit(this.units);

                });

            }

        });

    }

}

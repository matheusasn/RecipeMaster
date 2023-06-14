import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { Unit, UnitType } from '../../../../../core/models/business/unit';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../../core/models/user';
import { ToastrService } from 'ngx-toastr';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { TranslateService } from '@ngx-translate/core';

export const UNITS:number[] = [
    1, // gramas
    3, // mililitros
];

@Component({
  selector: 'm-unit-edit',
  templateUrl: './unit-edit.component.html',
  styleUrls: ['./unit-edit.component.scss']
})
export class UnitEditComponent implements OnInit {

    ingredient:Ingredient;
    unit:Unit;
    units:Unit[];
    user: User;
    form: FormGroup;
		unitType: UnitType;

    constructor(
        private dialog: MatDialogRef<UnitEditComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private fb:FormBuilder,
        private toaster: ToastrService,
        private unitService: UnitService,
        private translate: TranslateService) {

				this.unitType = data.type;
        this.ingredient = data.ingredient;
        this.unit = data.unit;
        this.user = data.user;
        this.units = _.filter(data.units, (u:Unit) => {
            return UNITS.includes(u.id);
        });

    }

    ngOnInit() {
        this.buildForm();
    }

    async doSubmit() {

        let txtAlertFill: string;
        let txtUpdateSucces: string;
        let txtCreateSucces: string;

        this.translate.get("ALERTS.TXT6").subscribe(data => txtCreateSucces = data);
        this.translate.get('ALERTS.TXT4').subscribe(data => txtAlertFill = data);
        this.translate.get('ALERTS.TXT5').subscribe(data => txtUpdateSucces = data);

        this.form.patchValue({
            abbreviation: this.form.value.name
        })

        if(this.form.invalid) {
            this.toaster.error(txtAlertFill);
            return;
        }

        let medidaCaseira:Unit = this.form.value;

        if(this.unit && _.isNil(this.unit.userId)) {
            delete(medidaCaseira.id); // não deve atualizar medida (caseira) do sistema
        }

        if(medidaCaseira.id) {

            // atualizar

            let response = await this.unitService.update(medidaCaseira).toPromise();
						if (!_.isNil(response.data.ingredientId)) {
							const responseOriginalUnit = await this.unitService.getById(response.data.unitId).toPromise();
							medidaCaseira.unitUuid = responseOriginalUnit.data.uuid;
						}

            this.toaster.success(txtUpdateSucces);

            this.dialog.close({
                event: 'update',
                unit: medidaCaseira
            });

        }
        else {

            // criar

            let response = await this.unitService.create(medidaCaseira).toPromise();
						if (!_.isNil(response.data.ingredientId)) {
							const responseOriginalUnit = await this.unitService.getById(response.data.unitId).toPromise();
							medidaCaseira.unitUuid = responseOriginalUnit.data.uuid;
						}

            this.toaster.success(txtCreateSucces);

            medidaCaseira.id = response.data.id;
            medidaCaseira.userId = response.data.user.id;
            medidaCaseira.unitId = response.data.unitId;
            medidaCaseira.ingredientId = response.data.ingredientId;

            this.dialog.close({
                event: 'create',
                unit: medidaCaseira
            });

        }

    }

    doCancel() {
        // this.onCancel.emit();
        this.dialog.close({
            event: 'cancel'
        });
    }

    private buildForm() {
			if (this.unitType === UnitType.OTHER_COSTS) {
        this.form = this.fb.group({
					id: [this.unit&&this.unit.id?this.unit.id:null, []],
					name: [this.unit&&this.unit.name?this.unit.name:null, [Validators.required, Validators.minLength(2)]],
					abbreviation: [null, [Validators.required]],
					user: [this.user, [Validators.required]],
					type: [ this.data.type ? this.data.type : null ]
			});
			} else {
        this.form = this.fb.group({
            id: [this.unit&&this.unit.id?this.unit.id:null, []],
            name: [this.unit&&this.unit.name?this.unit.name:null, [Validators.required, Validators.minLength(2)]],
            abbreviation: [null, [Validators.required]],
            amount: [this.unit&&this.unit.amount?this.unit.amount:null, [Validators.required, Validators.min(0)]],
            unitId: [this.unit&&this.unit.unitId?this.unit.unitId:null, [Validators.required]],
            user: [this.user, [Validators.required]],
            ingredientId: [this.ingredient.ingredientCopiedId?this.ingredient.ingredientCopiedId:this.ingredient.id, [Validators.required]],
            type: [ this.data.type && this.data.type === "PURCHASE_LIST"?UnitType.PURCHASE_LIST:null]
        });
			}

    }

}

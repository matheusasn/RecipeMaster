import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormGroupName } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UnitEditComponent } from '../unit-edit/unit-edit.component';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { EnglishUnitsUuid, Unit, UnitType } from '../../../../../core/models/business/unit';
import { UnitListComponent } from '../unit-list/unit-list.component';
import { User } from '../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import * as _ from 'lodash';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { PurchasePrice } from '../../../../../core/models/common/purchaseprice';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalCostsTab } from '../../recipe-costs/modal-fixed-costs-form/modal-fixed-costs-form.component';

export interface UnitSelectOptions {
    basic?:boolean;
    canCreate?:boolean;
    canUpdate?:boolean;
    inputName?: string;
    exclude:number[];
    showLabel?:boolean;
    type?:string;
		isModalSpecificCost?: boolean;
		selectTabOnModalSpecificCost?: ModalCostsTab;
}

@Component({
  selector: 'm-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.scss']
})
export class UnitSelectComponent extends CpBaseComponent implements OnInit, OnChanges {

    @Input() options: UnitSelectOptions = {
        basic: false,
        canCreate: true,
        canUpdate: true,
        inputName: 'unit',
        exclude: [],
        showLabel: true,
    };
    @Input() form:FormGroup;
    @Input() disabled:boolean;
    @Input() units:any[];
    @Input() ingredient:Ingredient;
    @Input() purchasePrice:PurchasePrice;
    lastUnit:Unit;
    user:User;
    canCreate:boolean;
    canUpdate:boolean;
    inputName:string;
    showLabel:boolean;
		lang: String;
		showUnitAbbreviated: boolean = false;

    constructor(_cdr: ChangeDetectorRef, _loading: CpLoadingService, private dialog: MatDialog,
        private _localStorage: CpLocalStorageService,
        private unitService: UnitService,
				private translationService: TranslationService,
				private translate: TranslateService) {
        super(_loading, _cdr);
        this.user = this._localStorage.getLoggedUser();

				this.translationService.getSelectedLanguage().subscribe(lang => {
					this.lang = lang;
				});

    }

    ngOnInit() {

        this.canCreate = (this.options && this.options.canCreate===false)?false:true;
        this.canUpdate = (this.options && this.options.canUpdate===false)?false:true;
        this.inputName = (this.options && this.options.inputName)?this.options.inputName:'unit';
        this.showLabel = (this.options && this.options.showLabel===false)?false:true;

        this.unitService.onCreateUnitEvent().subscribe( (units:Unit[]) => {
            if(_.isNil(this.options) || !_.isNil(this.options) && this.options.basic === false) {
                this.units = units;
            }

        } );
        this.filterUnits();

        this.lastUnit = this.form.get(this.inputName).value;
    }

    ngOnChanges(changes: SimpleChanges) {

        try {

            if(changes.units && changes.units.firstChange == false ) {

                this.filterUnits();

            }

        }
        catch(e) {
            console.warn(e.message);
        }
    }

    async onChange(ev:any) {

        let item:any = this.form.get(this.inputName).value;

        if(this.purchasePrice) {
            item = this.form.value.purchasePrice.unit;
        }

        switch(Number.parseInt(item)) {
            case -2:
                this.openList();
              break;
            case -1:
                this.openCreate();
              break;
            default:
                this.lastUnit = this.form.get(this.inputName)!=null?Object.assign(this.form.get(this.inputName).value):null;
        }

				const unit = this.form.value.unit

				const name = await this.translate.get(unit.name).toPromise();

				unit.name = name

				this.form.patchValue({
					unit
				})

    }

		getUnitEnDetails(unit: Unit) {
			if (unit.abbreviation === 'lib') {
				return `(${unit.abbreviation}) - ${unit.amount} grams`
			} else if (unit.abbreviation === 'oz') {
				return `(${unit.abbreviation}) - ${unit.amount} grams`
			} else if (unit.abbreviation === 'fl oz') {
				return `(${unit.abbreviation}) - ${unit.amount} ml`
			} else if (unit.abbreviation === 'Stick') {
				return `- ${unit.amount} grams`
			}
			return ''
		}

    private openCreate() {
        let createUnitModal = this.dialog.open(UnitEditComponent, {
            data: {
              unit: null,
              ingredient: this.ingredient,
              units: this.units,
              user: this.user,
              type: this.options.type
            },
            panelClass: 'custom-modalbox'
        });

        createUnitModal.afterClosed().subscribe( (response:any) => {

            if(!response) {

                if(this.purchasePrice) {
                    this.form.patchValue({
                        purchasePrice: {
                            unit: this.lastUnit
                          }
                    });
                }
                else {
                    this.form.patchValue( {
                        unit: this.lastUnit
                      } );
                }

                this.onChangeComponent();

                return;
            }

            if(response.event == 'create') {
                this.units.push(response.unit);

                if(this.purchasePrice) {
                    this.form.patchValue({
                        purchasePrice: {
                            unit: response.unit
                          }
                    });
                }
                else {
                    // this.form.patchValue( {
                    //     unit: response.unit
                    // } );
                    this.form.get(this.inputName).setValue(response.unit);
                }

                this.lastUnit = response.unit;

                this.unitService.onCreateUnitEvent().emit(this.units);

                this.onChangeComponent();

                return;

            }

            if(this.purchasePrice) {
                this.form.patchValue({
                    purchasePrice: {
                        unit: this.lastUnit
                      }
                });
            }
            else {
                this.form.patchValue( {
                    unit: this.lastUnit
                  } );
            }

            this.onChangeComponent();

        });

    }

    private openList() {

        let listUnitModal = this.dialog.open(UnitListComponent, {
            data: {
              unit: this.lastUnit,
              ingredient: this.ingredient,
              units: this.units,
              user: this.user,
							type: this.options.type
            },
            panelClass: 'custom-modalbox'
        });

        listUnitModal.afterClosed().subscribe( (response:any) => {

            if(response && response.units) {
                this.units = response.units;
            }

            if(this.purchasePrice) {
                this.form.patchValue({
                    purchasePrice: {
                        unit: this.lastUnit
                    }
                });
            }
            else {
								if (response.lastUnit) {
									this.lastUnit = response.lastUnit
								}
                this.form.patchValue({
                    unit: this.lastUnit
                });
            }

        });

    }

    private filterUnits() {
        let filteredUnits:any[];
        if(!_.isNil(this.options.exclude) && this.options.exclude.length > 0) {
            filteredUnits = _.filter(this.units, (u:Unit) => {
                return !this.options.exclude.includes(u.id);
            });

        }
        else {
            filteredUnits = this.units;
        }

        if (!_.isNil(this.options) && this.options.basic === true) {
					if (this.options.type === 'PURCHASE_LIST') {
						filteredUnits = _.filter(filteredUnits, (u:Unit) => {
							return _.isNil(u.ingredientId) || u.type === "PURCHASE_LIST";
						});
					} else {
						if (this.options.type === UnitType.OTHER_COSTS) {
							filteredUnits = _.filter(filteredUnits, (u:Unit) => {
								return _.isNil(u.ingredientId);
							});
						} else {
							filteredUnits = _.filter(filteredUnits, (u:Unit) => {
								return _.isNil(u.ingredientId) && u.type !== UnitType.OTHER_COSTS;
							});
						}
					}
        }
        else if(this.purchasePrice) {
            filteredUnits = _.filter(filteredUnits, (u:Unit) => {
                return _.isNil(u.ingredientId) || (u.ingredientId == this.ingredient.ingredientCopiedId) || (u.ingredientId == this.ingredient.id);
            });
        }
        else if(this.ingredient) {
            filteredUnits = _.filter(filteredUnits, (u:Unit) => {
                return _.isNil(u.ingredientId) || (u.ingredientId == this.ingredient.ingredientCopiedId) || (u.ingredientId == this.ingredient.id);
            });

            //filteredUnits = this.transformUnit(this.units, this.ingredient);
        }

        if(this.options && (_.isNil(this.options.type) || this.options.type !== "PURCHASE_LIST")) {

            filteredUnits = _.filter(filteredUnits, (u:Unit) => {
                return u.type != UnitType.PURCHASE_LIST;
            });

        }

        this.units = _.orderBy(filteredUnits, ['ingredientId', 'userId', 'name'], ['desc', 'asc', 'desc']);

        this.units = this.removeDuplicatedUnits();

				if (this.lang !== 'pt') {
					this.units = _.filter(this.units, (u:Unit) => {
						return u.name !== 'Colher de Café';
					});
				}

				if (this.lang !== 'en') {
					this.units = this.removeEnglishUnits();
				} else {
					if (this.ingredient.nameen !== 'Butter') {
						this.units = this.removeStick();
					}
				}

				if (this.options.isModalSpecificCost) {
					if (this.options.selectTabOnModalSpecificCost === ModalCostsTab.EQUIPMENT) {
						this.units = this.units.filter(unit => ['kWh', 'Kg'].includes(unit.abbreviation));
						this.showUnitAbbreviated = true;
					}
					if (this.options.selectTabOnModalSpecificCost === ModalCostsTab.LABOUR) {
						this.units = this.units.filter(unit => ['min', 'hrs'].includes(unit.abbreviation));
					}
					if (this.options.selectTabOnModalSpecificCost === ModalCostsTab.OTHERS) {
						this.units = this.units.filter(unit => ['Unid.', 'min', 'hrs'].includes(unit.abbreviation));
					}
				}

    }

		removeEnglishUnits() {
			return _.filter(this.units, (u:Unit) => {
				return !EnglishUnitsUuid.includes(u.uuid);
			});
		}

		removeStick() {
			return _.filter(this.units, (u:Unit) => {
				return u.name !== 'Stick';
			});
		}

    removeDuplicatedUnits() {
        var reduced = [];
        _.reverse(this.units).forEach((item) => {
            var duplicated  = reduced.findIndex(redItem => {
                return item.name == redItem.name;
            }) > -1;

            if(!duplicated) {
                reduced.push(item);
            }
        });
        return reduced;
    }

    transformUnit(units: Unit[], args?: any): any {
        if(!args) {
          return units;
        }

        let ingredient:Ingredient = args;

        let ingredientUnitId:number = ingredient.purchasePrice.unit&&
                        ingredient.purchasePrice.unit.ingredientId
                        ? ingredient.purchasePrice.unit.unitId
                        : (ingredient.purchasePrice.unit?ingredient.purchasePrice.unit.id : null);

        //sempre exibir 1,5: gramas, unidades
        if([1,2,5].includes(ingredientUnitId)) {

          units = _.filter(units, (u:Unit) => {
            return [1,2,5].includes(u.ingredientId?u.unitId:u.id);
          });

        }
        else if([3,4].includes(ingredientUnitId)) {

          units = _.filter(units, (u:Unit) => {
            return [1,3,4,5].includes(u.ingredientId?u.unitId:u.id);
          });

        }
        return units;

        // return units;
      }

}

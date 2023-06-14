import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Unit } from '../../../../../core/models/business/unit';
import { MenuItem } from '../../../../../core/models/business/menuitem';
import { MenuitemInfoComponent } from '../menuitem-info/menuitem-info.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import * as _ from 'underscore';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { User } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { of } from 'rxjs';
import { OthercostsService } from '../../../../../core/services/business/othercosts.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { OtherCostDTO } from '../../../../../core/models/business/recipeitem';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';

@Component({
  selector: 'm-menuitem',
  templateUrl: './menuitem.component.html',
  styleUrls: ['./menuitem.component.scss']
})
export class MenuitemComponent extends CpBaseComponent implements OnInit {
  user: UserDTO;
	private _currentUser: User;
  @ViewChild('searchInput') searchInput: ElementRef;
  itemForm:FormGroup;
  searchResult:any[] = [];

  @Input() units:Unit[];
  @Input() itens:MenuItem[];
  @Output() itensChange = new EventEmitter();
  @Input() placeholder:string = "Digite aqui o nome do item para adicionar...";

  ingredientInfoRef: MatDialogRef<MenuitemInfoComponent>;

  cifrao: String = 'R$';
  othersResult:OtherCostDTO[];

  constructor(  _cdr: ChangeDetectorRef, _loading: CpLoadingService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private calc: CommonCalcService,
    private _userService: UserService,
    private _cpLocalStorageService: CpLocalStorageService,
    private otherCostsService:OthercostsService
  ) {
    super(_loading, _cdr);
    this.fillUser();
  }

  fillUser() {
		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
          this.user = res.data;
          this.cifrao = this.user.currency || 'R$';
				}, err => {
				});
		}
	}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {

    this.itemForm = this._formBuilder.group({
      searchTerm: ''
    });

    this.itemForm.get('searchTerm')
          .valueChanges
          .pipe(
            debounceTime(400),
            switchMap( (term:string = "") => {

                if(_.isEmpty(term)) {
                    return of([]);
                }

                return this.otherCostsService.find(term);

            } )
          ).subscribe( (response: ApiResponse) => {

            let otherCosts:OtherCostDTO[] = _.sortBy(response.data, 'inclusion');

            otherCosts.reverse();

            this.othersResult = _.uniq(otherCosts, (oc:OtherCostDTO) => {
                return oc.name;
            });

            this.onChangeComponent();

            return response;

        });

  }

  async copyItem(dto:OtherCostDTO) {

    let unit:Unit = _.findWhere(this.units, {id:dto.unitId});

    let item:any = {
        name: dto.name,
        price: dto.price,
        unit: unit,
        unityQuantity: dto.unityQuantity,
        unitUsed: _.findWhere(this.units, {id:dto.usedUnitId}),
        unityQuantityUsed: dto.unityQuantityUsed,
        menu: null
    };

    if(!this.itens) {
        this.itens = [];
    }

    this.itens.push(item);
    this.searchResult = [];
    this.itemForm.reset();

    this.itensChange.emit(this.itens);

}

  async createItem() {

    let unit:Unit = this.units[4];

    let item:any = {
      name: this.itemForm.get('searchTerm').value,
      price: 0,
      unit: unit,
      unityQuantity: 1,
      unitUsed: unit,
      unityQuantityUsed: 1,
      menu: null
    };

    if(!this.itens) {
      this.itens = [];
    }

    this.itens.push(item);
    this.searchResult = [];
    this.itemForm.reset();

    this.itensChange.emit(this.itens);

  }

  doMenuItemInfo(index:number) {
    this.ingredientInfoRef = this._matDialog.open(MenuitemInfoComponent, {
			data: {
        item: this.itens[index],
        units: this.units
			},
    });

    this.ingredientInfoRef.afterClosed().subscribe( (response:any) => {

      if (!response || !response.item) {
				return;
			}

			if (response.exclude === true) {
        this.removeItem(response.item);
      }

      this.itensChange.emit(this.itens);

    });

  }

  private removeItem(item:MenuItem) {

    this.itens = _.filter(this.itens, (value, index) => {
			return value != item;
    });

    this.itensChange.emit(this.itens);

  }

  public calcItemPrice(item:MenuItem) {
    return this.calc.calcMenuItemPrice(item);
  }

}

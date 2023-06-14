import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../../../core/models/user';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Unit } from '../../../../../core/models/business/unit';
import { RecipeItem, OtherCostDTO } from '../../../../../core/models/business/recipeitem';
import { MatDialogRef, MatDialog } from '@angular/material';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as _ from 'underscore';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';
import { UserService } from '../../../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { TranslateService } from '@ngx-translate/core';
import { RecipeitemInfoComponent } from '../recipeitem-info/recipeitem-info.component';
import { of, Subscription } from 'rxjs';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { OthercostsService } from '../../../../../core/services/business/othercosts.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'm-recipeitem',
  templateUrl: './recipeitem.component.html',
  styleUrls: ['./recipeitem.component.scss']
})
export class RecipeitemComponent extends CpBaseComponent implements OnInit {

    user: UserDTO;
	private _currentUser: User;
    @ViewChild('searchInput') searchInput: ElementRef;
    itemForm:FormGroup;
    searchResult:any[] = [];

		@Input() isDraggingEnabled: boolean;
    @Input() units:Unit[];
    @Input() itens:RecipeItem[];
    @Output() itensChange = new EventEmitter();
    @Input() placeholder:string = "Digite aqui o nome do item para adicionar...";

    ingredientInfoRef: MatDialogRef<RecipeitemInfoComponent>;

    cifrao: String = 'R$';
    othersResult:OtherCostDTO[];

    constructor(_cdr: ChangeDetectorRef,
        _loading: CpLoadingService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private calc: CommonCalcService,
        private _userService: UserService,
        private _cpLocalStorageService: CpLocalStorageService,
        private translate: TranslateService,
        private otherCostsService: OthercostsService,
				private dragulaService: DragulaService
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
				this.initDragula();
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

        this.ingredientInfoRef = this._matDialog.open(RecipeitemInfoComponent, {
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

		handleReorderItens(ordered: RecipeItem[]) {
			ordered.forEach((item, i) => item.order = i)
			this.itens = ordered;
			this.itensChange.emit(this.itens);
		}

		initDragula() {
			this.dragulaService.createGroup('ITENS_DRAGGABLE', {
				direction: 'vertical',
				moves: () => {
					return this.isDraggingEnabled;
				}
			});
		}

		ngOnDestroy() {
			this.destroyDragula();
		}

		destroyDragula() {
			this.dragulaService.destroy('ITENS_DRAGGABLE');
		}

    private removeItem(item:RecipeItem) {

        this.itens = _.filter(this.itens, (value, index) => {
            return value != item;
        });

        this.itensChange.emit(this.itens);

    }

    public calcItemPrice(item:RecipeItem) {
        return this.calc.calcRecipeItemPrice(item);
    }

}

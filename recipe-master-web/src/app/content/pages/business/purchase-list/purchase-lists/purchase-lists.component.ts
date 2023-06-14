import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PurchaseListService } from '../../../../../core/services/business/purchase-list.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from './../../../../../core/services/common/cp-loading.service';
import { PurchaseList } from '../../../../../core/models/business/purchase-list.model';
import { ApiResponse } from '../../../../../core/models/api-response';
import { UserService } from '../../../../../core/auth/user.service';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'm-purchase-lists',
  templateUrl: './purchase-lists.component.html',
  styleUrls: ['./purchase-lists.component.scss']
})
export class PurchaseListsComponent extends CpBaseComponent implements OnInit {

  listaDeCompras: PurchaseList[] = [];
  public fullListaDeCompras: PurchaseList[] = [];
  cifrao: String = 'R$';
  private _currentUser: UserDTO;
  contPesquisa: string;
  searchTerm: string;
  ready = false;

  linguagem: string;

  constructor(
    protected _loading: CpLoadingService,
		protected _cdr: ChangeDetectorRef,
    private _service: PurchaseListService,
    private _localStorage: CpLocalStorageService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private translate: TranslateService
  ) { 
    super(_loading, _cdr);
  }

  ngOnInit() {
    this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
			}
    );

    this.fillUser();
    this.listarItensDeCompras();
  }

  fillUser() {
		this._userService.findByIdReduced(this._localStorage.getLoggedUser().id)
				.subscribe((res) => {
					this._currentUser = res.data;
					this.cifrao = this._currentUser.currency || 'R$';
				}, err => {
				});
	}

  async listarItensDeCompras() {
    this._loading.show();
    this._service.getAllByUser(this._localStorage.getLoggedUser().id, {
			currentPage: this.pagination.currentPage,
			name
		}).subscribe(
      
      (apiResponse: ApiResponse) => {        
        
        if (apiResponse.data.length > 0) {                    
          this.listaDeCompras = apiResponse.data;
          this._loading.hide();
        } else {
          this.listaDeCompras = [];
					this._loading.hide();
        }

      }, error => {
				this._loading.hide();
        this.onChangeComponent();
      }
    );
  }

  edit(id: number): void {
    this._router.navigate([CpRoutes.PURCHASELIST+"/"+id]);
  }

  doCreate(): void {
    this._router.navigate([CpRoutes.PURCHASELIST]);
  }

  onChangeSearch(term: string) {
    this.searchTerm = term;
  }
  
  onSearch(apiResponse) {
    this.ready = false;
    const lastListaCompra = this.listaDeCompras;
    this.listaDeCompras = apiResponse.data;
    this.retrieveFullMenu(this.listaDeCompras);

  }

  async retrieveFullMenu(lastListaCompra: any[]) {

		if (this.listaDeCompras && this.listaDeCompras.length > 0) {

			await _.each(this.listaDeCompras, (lCompras1: any, index) => {

				const listaCompraCompleto: any = _.find(lastListaCompra, (lCompras2: any) => {
					return lCompras2.id === lCompras1.id && !_.isNil(lCompras2.financial);
				});

				if (_.isNil(listaCompraCompleto)) {

					this.getById(lCompras1.id, index);
				} else {
					this.listaDeCompras[index] = listaCompraCompleto;
					this.fullListaDeCompras[index] = listaCompraCompleto;
				}
			});
			this.ready = true;
		}

  }
  
  async getById(id, index) {
		await this._service.getById(id).subscribe(async (apiResponse: ApiResponse) => {
			const fullListaDeCompras: PurchaseList = apiResponse.data;
			this.listaDeCompras[index] = fullListaDeCompras;
			this.fullListaDeCompras[index] = fullListaDeCompras;
			this.onChangeComponent();
		}, err => {
			console.log(err);
		} );
  }

}

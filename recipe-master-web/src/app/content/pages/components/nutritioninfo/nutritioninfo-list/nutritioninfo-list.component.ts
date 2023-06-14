import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NutritionInfo } from '../../../../../core/models/business/nutritioninfo';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { NutritionInfoService } from '../../../../../core/services/business/nutritioninfo.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { NutritionInfoOrigin } from '../../../../../core/models/business/dto/nutritioninfo-filter';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';

@Component({
  selector: 'm-nutritioninfo-list',
  templateUrl: './nutritioninfo-list.component.html',
  styleUrls: ['./nutritioninfo-list.component.scss']
})
export class NutritioninfoListComponent implements OnInit {

  @Output() onEdit:EventEmitter<NutritionInfo> = new EventEmitter<NutritionInfo>();
  @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete:EventEmitter<NutritionInfo> = new EventEmitter<NutritionInfo>();
  @Input() items: NutritionInfo[];
  NutritionInfoOrigin = NutritionInfoOrigin;

  constructor(private router: Router, private nutritionInfoService: NutritionInfoService, private _localStorage: CpLocalStorageService, private toaster: ToastrService) { }

  ngOnInit() {
  }

  doEditar(item:NutritionInfo) {
    this.onEdit.emit(item);
  }

  doClose() {
    this.onClose.emit();
  }

  doExcluir(item:NutritionInfo) {

    const op: SweetAlertOptions = {
			title: '',
			text: 'Excluir esta informação nutricional?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: "Excluir",
			cancelButtonText: "Voltar"
    };

    swal(op).then((result) => {
        if (result.value) {
            let user = this._localStorage.getLoggedUser();

            this.nutritionInfoService.delete(user.id, item.id).subscribe(response => {
                this.toaster.success("Registro excluído com sucesso!");
                this.onDelete.emit(item);
            }, err => {
                console.warn(err);
                this.toaster.error("Erro ao excluir Informação Nutricional.");
            });
        }
    });

  }

  doSwal(item:NutritionInfo) {

    let msg:string = `<p>Este é um ingrediente composto!</p> \
    <p>Para editar a informação nutricional, você pode <a target="_blank" href="${CpRoutes.RECIPE + `/` + item.recipe.id}">abrir em outra aba</a>.</p>`;

    let op:SweetAlertOptions = {
        html: msg,
        type: 'warning',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: "Voltar"
    };

    swal(op);

  }

}

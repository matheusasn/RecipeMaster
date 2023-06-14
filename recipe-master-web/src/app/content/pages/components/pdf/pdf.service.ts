import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response';
import { CARD_TYPE } from '../../../../core/models/common/card-type';
import { User } from '../../../../core/models/user';
import { APIClientService } from '../../../../core/services/common/api-client.service';
import { ConfigModalComponent, PdfConfigModalOptions } from './components/config-modal/config-modal.component';

export enum PDFType {
	RECIPE,
	MENU
}

interface RegisterPDFDTO {
	type: PDFType,
	user: User
}

@Injectable()
export class PdfService {

  static PDF_GENERATE:string = 'gerar';

  private _options: PDFOptions = {
    showPhoto:true,
    showPreparationSteps:true,
    showOtherCosts:true,
    showFinancial:true,
    showNutritionalInfo:true,
    showLogo: false,
    showIngredients: true,
		isComplete: true,
		isProduction: false,
		isManagerial: false,
		showFixedCosts: true,
		showVariableCosts: true
  };
  private dialogRef:MatDialogRef<ConfigModalComponent>;

  constructor(private _apiService: APIClientService, private dialog:MatDialog) { }

  get options():PDFOptions {
    return this._options;
  }

  set options(options:PDFOptions) {
    this._options = options;
  }

  openConfig(options?:PdfConfigModalOptions):MatDialogRef<ConfigModalComponent> {

    if(!options) {

      options = {
				type: CARD_TYPE.RECEITA,
				service: this
      };

    }
    else {
      options.service = this;
    }

    this.dialogRef = this.dialog.open(ConfigModalComponent, {
      width: '320px',
      data: options
    });

    return this.dialogRef;

  }

  closeConfig() {
    this.dialogRef.close(PdfService.PDF_GENERATE);
  }

	registerPDF(data: RegisterPDFDTO): Observable<ApiResponse> {
    return this._apiService.post(`${ENDPOINTS.BUSINESS.PDF}`, data);
  }

	count(): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.PDF}/count`);
	}

  uploadPdfLogo(imageDto:any): Observable<ApiResponse> {
    return this._apiService.post(`${ENDPOINTS.STORAGE.PDF}`, imageDto);
  }

  loadPdfLogo(): Observable<ApiResponse> {
    return this._apiService.get(`${ENDPOINTS.STORAGE.PDF}`);
  }

}

export interface PDFOptions {
  showPhoto:boolean;
  showPreparationSteps:boolean;
  showOtherCosts:boolean;
  showFinancial:boolean;
  showNutritionalInfo:boolean;
  showLogo:boolean;
  logoUrl?:string;

  // itens de PDF de cardápios
  // showGeneral?:boolean;
  showIngredients?:boolean;

	isComplete: boolean;
	isProduction: boolean;
	isManagerial: boolean;

	showFixedCosts: boolean;
	showVariableCosts: boolean;
}

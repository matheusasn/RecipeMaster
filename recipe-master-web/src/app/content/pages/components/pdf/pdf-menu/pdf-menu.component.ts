import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { exportPDF } from '@progress/kendo-drawing';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { ApiResponse } from '../../../../../core/models/api-response';
import { Menu } from '../../../../../core/models/business/menu';
import { Recipe } from '../../../../../core/models/business/recipe';
import { Unit } from '../../../../../core/models/business/unit';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { APIClientService } from '../../../../../core/services/common/api-client.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { ModalLoadingComponent } from '../../common/modal-loading/modal-loading.component';
import { PDFOptions, PdfService, PDFType } from '../pdf.service';

@Component({
  selector: 'recipemaster-pdf-menu',
  templateUrl: './pdf-menu.component.html',
  styleUrls: [
    './pdf-menu.component.scss'
  ]
})
export class PdfMenuComponent implements OnInit, OnChanges {

  @Input() menu: Menu;
  @Input() units: Unit[];
	@Input() menuRecipes: Recipe[];
  @ViewChild('pdf') pdfExport:PDFExportComponent;
  @ViewChild('coverContainer') coverContainer:ElementRef;
  @ViewChild('allInfoContainer') allInfoContainer:ElementRef;
	modalLoadingRef: MatDialogRef<ModalLoadingComponent>;

  constructor(private pdfService:PdfService, private unitService:UnitService,
		private _cpLocalStorageService: CpLocalStorageService,
		private _apiService: APIClientService,
		private _dialogLoading: MatDialog,
		private translate: TranslateService) {
		}


  ngOnInit() {

    if(!this.units) {
      this.loadUnits();
    }

  }

  ngOnChanges(changes:SimpleChanges) {
    if(changes.menu && !changes.menu.isFirstChange) {
      this.menu = changes.menu.currentValue;
    }

  }

  get options():PDFOptions {
    return this.pdfService.options;
  }

  get allInfoBreak():boolean {

    try {
      let limit:number = 742;
      let height:number = (this.coverContainer&&this.coverContainer.nativeElement?this.coverContainer.nativeElement.offsetHeight:0)
                        + (this.allInfoContainer&&this.allInfoContainer.nativeElement?this.allInfoContainer.nativeElement.offsetHeight:0);

      return height >= limit;
    }
    catch(e) {
      console.warn(e.message);
    }

    return false;

  }

  async save(filename:string = "cardapio.pdf") {

		const user = this._cpLocalStorageService.getLoggedUser();
		await this.pdfService.registerPDF({
			user,
			type: PDFType.MENU
		}).toPromise()


		if (+window.innerWidth <= 768) {
			this.pdfExport.forceProxy = true

			this.pdfExport.proxyURL = this._apiService.getUrl('/business/pdf/proxy')
		}

		let text = '';
		let pdfGeneratedText = ''

		this.translate.get('GENERATING_PDF').subscribe(
			data => {text = data}
		);

		this.translate.get('PDF_GENERATED').subscribe(
			data => {pdfGeneratedText = data}
		);

		this.modalLoadingRef = this._dialogLoading.open(ModalLoadingComponent, {
			data: {
				text
			},
		});

		let op: SweetAlertOptions = {
			title: pdfGeneratedText,
			type: 'success',
			showCloseButton: true,
			showConfirmButton: false,
			timer: 1000,
		};

		setTimeout(() => swal(op), 3100)

		const iOSDevice = this._cpLocalStorageService.isIOS()
		// @ts-ignore
		const isAndroid = typeof Android !== 'undefined'
		if (isAndroid || iOSDevice) {
			const group = await this.pdfExport.export();
			const base64Pdf = await exportPDF(group);

			if (isAndroid) {
				// @ts-ignore
				Android.downloadPdfWithName(base64Pdf,filename);
			} else if (iOSDevice) {
				// @ts-ignore
				window.webkit.messageHandlers.ios.postMessage({ base64: base64Pdf, fileName: filename });
			}
		} else {
			this.pdfExport.saveAs(filename);
		}

		this.menu = null;
  }

  private async loadUnits() {

    let response:ApiResponse = await this.unitService.getReduced().toPromise();

    if(response.data) {
      this.units = response.data;
    }

  }

}

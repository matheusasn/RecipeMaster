import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { PDFExportComponent } from "@progress/kendo-angular-pdf-export";
import { exportPDF } from "@progress/kendo-drawing";
import swal, { SweetAlertOptions } from "sweetalert2";
import { IngredientService } from "../../../../../core/services/business/ingredient.service";
import { APIClientService } from "../../../../../core/services/common/api-client.service";
import { CpLocalStorageService } from "../../../../../core/services/common/cp-localstorage.service";
import { ModalLoadingComponent } from "../../common/modal-loading/modal-loading.component";

@Component({
  selector: 'pdf-ingredients-used',
  templateUrl: './pdf-ingredients-used.component.html',
  styleUrls: ['./pdf-ingredients-used.component.scss']
})
export class PdfIngredientsUsedComponent implements OnInit, OnChanges {

	@ViewChild('pdf')
  pdfExport:PDFExportComponent;

	@Input() linguagem: string;
	@Input() sortType: string;
	@Input() sortField: string;
	@Input() cifrao: string;

	ingredients = [];

	constructor(
		private _apiService: APIClientService,
		private _localStorage: CpLocalStorageService,
		private _dialog: MatDialog,
		private translate: TranslateService,
		private ingredientService: IngredientService,
		private cd: ChangeDetectorRef
	) {

	}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {}

	async save(filename:string = "Ingredientes Utilizados.pdf") {

		let yes = '';
		let cancel = ''
		let question = '';

		this.translate.get('INGREDIENT.PDF_INGREDIENTS_YES').subscribe(
			data => {yes = data}
		);

		this.translate.get('INGREDIENT.PDF_INGREDIENTS_CANCEL').subscribe(
			data => {cancel = data}
		);

		this.translate.get('INGREDIENT.PDF_INGREDIENTS_QUESTION').subscribe(
			data => {question = data}
		);

		swal({
			// title: "Confirmação",
			text: "Deseja gerar o PDF da lista de ingredientes utilizados?",
			type: 'question',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: yes,
			cancelButtonText: cancel
		}).then(async (result) => {
			if (result.value === true) {
				const apiResponse = await this.ingredientService.getCopiedByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
					currentPage: 1,
					name: null,
					copied: true,
					historyLimit: 2,
					usedInRecipe: true,
					sortField: this.sortField,
					sortType: this.sortType,
					itensPerPage: 99999
				}).toPromise();

				this.ingredients = apiResponse.data.content;

				this.cd.detectChanges();

				if (+window.innerWidth <= 768) {
					this.pdfExport.forceProxy = true

					this.pdfExport.proxyURL = this._apiService.getUrl('/business/pdf/proxy')
				}

				const iOSDevice = this._localStorage.isIOS()

				let text = '';
				let pdfGeneratedText = ''

				this.translate.get('GENERATING_PDF').subscribe(
					data => {text = data}
				);

				this.translate.get('PDF_GENERATED').subscribe(
					data => {pdfGeneratedText = data}
				);

				this._dialog.open(ModalLoadingComponent, {
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
			}
		});
  }

}

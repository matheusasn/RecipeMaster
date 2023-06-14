import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { exportPDF } from '@progress/kendo-drawing';
import _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { ApiResponse } from '../../../../core/models/api-response';
import { Menu } from '../../../../core/models/business/menu';
import { Recipe } from '../../../../core/models/business/recipe';
import { RecipeItem } from '../../../../core/models/business/recipeitem';
import { Unit } from '../../../../core/models/business/unit';
import { CARD_TYPE } from '../../../../core/models/common/card-type';
import { CommonCalcService } from '../../../../core/services/business/common-calc.service';
import { UnitService } from '../../../../core/services/business/unit.service';
import { APIClientService } from '../../../../core/services/common/api-client.service';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { ModalLoadingComponent } from '../common/modal-loading/modal-loading.component';
import { RecipeInfoComponent } from './components/recipe-info/recipe-info.component';
import { PDFOptions, PdfService, PDFType } from './pdf.service';

@Component({
  selector: 'recipemaster-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, OnChanges {

  @Input()
  recipe: Recipe;

	@Input()
	chartData;

  @Input()
  units: Unit[];

  @ViewChild('pdf')
  pdfExport:PDFExportComponent;

  @ViewChild('coverContainer') coverContainer:ElementRef;
  @ViewChild('recipeInfoContainer') recipeInfoContainer:ElementRef;
  @ViewChild('ingredientsContainer') ingredientsContainer:ElementRef;
  @ViewChild('otherCostsContainer') otherCostsContainer:ElementRef;
  @ViewChild('financialContainer') financialContainer:ElementRef;
	@ViewChild('stepsContainer') stepsContainer:ElementRef;
	@ViewChild('totalCostsContainer') totalCostsContainer:ElementRef;

  @ViewChild('menuInfoContainer') menuInfoContainer:ElementRef;

	modalLoadingRef: MatDialogRef<ModalLoadingComponent>;

  CARD_TYPE = CARD_TYPE;

	cifrao;
	user;

  constructor(private pdfService:PdfService, private unitService:UnitService,
		private _cpLocalStorageService: CpLocalStorageService,
		private _apiService: APIClientService,
		private calc: CommonCalcService,
		private _localStorage: CpLocalStorageService,
		private deviceDetectorService: DeviceDetectorService,
		private _dialogLoading: MatDialog,
		private translate: TranslateService,
		private cd: ChangeDetectorRef) { }

  ngOnInit() {

    if(!this.units) {
      this.loadUnits();
    }

		this.fillUser();

  }

  ngOnChanges(changes:SimpleChanges) {
    if(changes.recipe && !changes.recipe.isFirstChange) {
      this.recipe = changes.recipe.currentValue;
    }

  }

	fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user){
      this.cifrao = this._localStorage.getCurrency();
    }
	}

  get ingredientsBreak():boolean {

    try {
      let limit:number = 742;
      let height:number = (this.coverContainer&&this.coverContainer.nativeElement?this.coverContainer.nativeElement.offsetHeight:0)
                        + (this.recipeInfoContainer&&this.recipeInfoContainer.nativeElement?this.recipeInfoContainer.nativeElement.offsetHeight:0)
                        + (this.ingredientsContainer&&this.ingredientsContainer.nativeElement?this.ingredientsContainer.nativeElement.offsetHeight:0)
                        + (this.otherCostsContainer&&this.otherCostsContainer.nativeElement?this.otherCostsContainer.nativeElement.offsetHeight:0);

      return height >= limit;
    }
    catch(e) {
      console.warn(e.message);
    }

    return false;

  }

	/**
	 * Início cálculos financeiros
	 */

	getItensTotalCost(): number {

		if (this.recipe.itens && this.recipe.itens.length > 0) {
			return _.reduce(this.recipe.itens, (sum: number, item: RecipeItem) => {
				const valor: number = this.calc.calcRecipeItemPrice(item);
				return sum + valor;
			}, 0);
		}

		return 0;

    }

	getTotalIngredients(): number {
		return this.calc.totalRecipeIngredients(this.recipe.ingredients);
	}

	getAmountBasedOnRecipeYield(total: number): number {
		let amount = total;
		if (this.recipe && this.recipe.unityQuantity && this.recipe.ingredientsYield) {
			amount = (this.recipe.ingredientsYield / this.recipe.unityQuantity) * amount
		}
		return amount;
	}

	getTotalCost(): number {
		return this.getAmountBasedOnRecipeYield(this.getTotalIngredients()) + this.getItensTotalCost();
	}

	calcProfit() {

		try {

			return this.recipe.financial.totalCostValue - this.getTotalCost();

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	private getRendimento():number {

		if (this.recipe.ingredientsYield) {
			return this.recipe.ingredientsYield;
		}

		return this.recipe.unityQuantity ? this.recipe.unityQuantity : 1;

	}

	calcMargemDeLucro(tipo: string = 'total'): number {

		let rendimento:number = 1;
		let precoDeVenda:number = this.recipe.financial.totalCostValue;

		if (tipo === 'unitario') {
			precoDeVenda = this.recipe.financial.costUnitValue;
			rendimento = this.getRendimento();
		}

		return this.calc.calcMargemDeLucro(this.recipe.ingredients, precoDeVenda, rendimento, this.getItensTotalCost());

	}

	getUnitCost(): number {

		let rendimento:number = this.getRendimento();

		let value = this.getTotalCost() / (rendimento ? rendimento : 1)

		return value

	}

	calcUnitProfit() {

		try {

			return this.recipe.financial.costUnitValue - this.getUnitCost();

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	/**
	 * Fim cálculos financeiros
	 */


  get otherCostsBreak():boolean {

    try {

      let limit:number = 615;
      let height:number = (this.coverContainer&&this.coverContainer.nativeElement?this.coverContainer.nativeElement.offsetHeight:0)
                        + (this.recipeInfoContainer&&this.recipeInfoContainer.nativeElement?this.recipeInfoContainer.nativeElement.offsetHeight:0)
                        + (this.ingredientsContainer&&this.ingredientsContainer.nativeElement?this.ingredientsContainer.nativeElement.offsetHeight:0)
                        + (this.otherCostsContainer&&this.otherCostsContainer.nativeElement?this.otherCostsContainer.nativeElement.offsetHeight:0)
												+ (this.totalCostsContainer&&this.totalCostsContainer.nativeElement?this.totalCostsContainer.nativeElement.offsetHeight:0)
												+ (this.stepsContainer&&this.stepsContainer.nativeElement?this.stepsContainer.nativeElement.offsetHeight:0);
                        // + (this.financialContainer&&this.financialContainer.nativeElement?this.financialContainer.nativeElement.offsetHeight:0);

			console.log({ height })

      return height >= limit;

    }
    catch(e) {
      console.warn(e.message);
    }

    return false;

  }

  get options():PDFOptions {
    return this.pdfService.options;
  }

	private async fixFinancial() {

		while(!this.recipe) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		if (this.recipe && this.recipe.financial) {
			const costValue = this.recipe.financial.totalCostValue;
			let totalCostPerc = 0.0;
			if (costValue && costValue > 0) {

				totalCostPerc = ((costValue - this.getTotalCost()) / this.getTotalCost()) * 100;
			}
			this.recipe.financial.totalCostPerc = totalCostPerc;

			const costUnitValue = this.recipe.financial.costUnitValue;
			let costUnitPerc = 0.0;
			const rendimento:number = this.getRendimento();
			const totalIngredientsByUnityQuantity = this.getTotalCost() / rendimento;

			if (costUnitValue && costUnitValue > 0) {
				costUnitPerc = ((costUnitValue - totalIngredientsByUnityQuantity) / totalIngredientsByUnityQuantity) * 100;
			}

			this.recipe.financial.costUnitPerc = costUnitPerc;

			this.cd.detectChanges();
		}
	}

  async save(filename:string = "fichatecnica.pdf") {
		await this.fixFinancial();

		const user = this._cpLocalStorageService.getLoggedUser();
		await this.pdfService.registerPDF({
			user,
			type: PDFType.RECIPE
		}).toPromise()

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

		console.log(this.pdfExport)

  }

  private async loadUnits() {

    let response:ApiResponse = await this.unitService.getReduced().toPromise();

    if(response.data) {
      this.units = response.data;
    }

  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { API, APP_CONFIG } from '../../../../../../config/app.config';
import { ApiResponse } from '../../../../../../core/models/api-response';
import { CARD_TYPE } from '../../../../../../core/models/common/card-type';
import { RolePermission } from '../../../../../../core/models/security/perfil.enum';
import { PlanService } from '../../../../../../core/services/business/plan.service';
import { PDFOptions, PdfService } from '../../pdf.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogRecipePdfRecipeComponent } from '../../../../tutorials/recipe/dialog-recipe-pdf-recipe/dialog-recipe-pdf-recipe.component';
export interface PdfConfigModalOptions {
  type: CARD_TYPE;
  service:PdfService
};

@Component({
  selector: 'm-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent implements OnInit {

  form:FormGroup;
  service:PdfService;
  nutritionalInfoPermission:boolean = false;
  disableNutritionalInfo:boolean = false;
  cropOtions:any = {
		aspectRatio: 1/1
  };
  logo: string; // = 'assets/avatar.png';
  logoUpdated:boolean = false;
  baseUrl:string = API.S3_URL;
  options:PdfConfigModalOptions;
  CARD_TYPE = CARD_TYPE;

  constructor(
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data:PdfConfigModalOptions,
    private planService:PlanService,
    private translate: TranslateService,
		private dialog: MatDialog
		) {}

  ngOnInit() {

    this.options = this.data;

    if(!this.options.type) {
      this.options.type = CARD_TYPE.RECEITA;
    }

    this.service = this.data.service;

    this.nutritionalInfoPermission = this.planService.hasPermission(RolePermission.NUTRITION_INFO_ENABLED, false);

    if(this.nutritionalInfoPermission === false) {
      this.disableNutritionalInfo = true;
    }

    // carregar a foto, se existir
    this.loadPdfLogo();

    this.buildForm();

		this.createListeners();

  }

  private async loadPdfLogo() {

    try {

      let response:ApiResponse = await this.service.loadPdfLogo().toPromise();

      if(response && response.message) {

        this.logo = response.message;

      }

    }
    catch(e) {
      console.warn(e);
    }

  }

  onPhotoChange(base64Content:any) {
		this.logo = base64Content;
		this.logoUpdated = true;
	}

  async doGerarPdf() {

    let options:PDFOptions = this.form.value;

    // salvar foto, se existir
    if(options.showLogo) {

      try {

        if(this.logoUpdated) {

          let imageDto:any = {
            content: this.logo
          };

          let response:ApiResponse = await this.service.uploadPdfLogo(imageDto).toPromise();

          if(response && response.data && response.data.key) {
            options.logoUrl = response.data.key;
          }

        }
        else {
          options.logoUrl = this.logo;
        }

      }
      catch(e) {
        console.warn(e.message);
      }

    }

    this.service.options = options;

    this.service.closeConfig();

  }

	private createListeners() {
		this.form.controls.isComplete.valueChanges.subscribe((change) => {
			if (change) {
				this.form.patchValue({
					isProduction: false,
					isManagerial: false
				})
			}
		});
		this.form.controls.isProduction.valueChanges.subscribe((change) => {
			if (change) {
				this.form.patchValue({
					isComplete: false,
					isManagerial: false
				})
			}
		});
		this.form.controls.isManagerial.valueChanges.subscribe((change) => {
			if (change) {
				this.form.patchValue({
					isComplete: false,
					isProduction: false
				})
			}
		});
	}

  private buildForm() {

    let options:PDFOptions = this.service.options;

    if(this.nutritionalInfoPermission === false) {
      options.showNutritionalInfo = false;
    }

    if(this.options.type == CARD_TYPE.CARDAPIO) {

      this.form = this.fb.group({
        // showGeneral:[options.showGeneral],
        showIngredients:[options.showIngredients],
        showOtherCosts:[options.showOtherCosts],
        showFinancial:[options.showFinancial],
        showLogo: [options.showLogo]
      });

    }
    else { // padrão é RECEITA

      this.form = this.fb.group({
        showPhoto:[options.showPhoto],
        showPreparationSteps:[options.showPreparationSteps],
        showOtherCosts:[options.showOtherCosts],
        showFinancial:[options.showFinancial],
        showNutritionalInfo: new FormControl({value: options.showNutritionalInfo, disabled: this.disableNutritionalInfo}),
        showLogo: [options.showLogo],
				isComplete: [options.isComplete],
				isProduction: [options.isProduction],
				isManagerial: [options.isManagerial],
				showFixedCosts: [options.showFixedCosts],
				showVariableCosts: [options.showVariableCosts],
      });

    }

  }

	openDialog(type: string): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		const optionsDialog = {
			recipePdfRecipe: DialogRecipePdfRecipeComponent
		}

		const dialogComponent = optionsDialog[type];
		this.dialog.open(dialogComponent, dialogConfig);
	}

}

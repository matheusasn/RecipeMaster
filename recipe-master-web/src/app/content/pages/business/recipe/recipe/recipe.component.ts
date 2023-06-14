import { DragulaService } from "ng2-dragula";
import { Messages } from "./../../../../../core/constants/messages";
import { PERCENT_UUID, Unit } from "./../../../../../core/models/business/unit";
import { UnitService } from "./../../../../../core/services/business/unit.service";
import { ApiResponse } from "./../../../../../core/models/api-response";
import {
	isRecipeVariableCostActive,
	Recipe,
} from "./../../../../../core/models/business/recipe";
import { CpLoadingService } from "./../../../../../core/services/common/cp-loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChildren,
	ViewChild,
	OnDestroy,
	ElementRef,
	QueryList,
} from "@angular/core";
import { RecipeService } from "../../../../../core/services/business/recipe.service";
import { CpRoutes } from "../../../../../core/constants/cp-routes";
import {
	FormBuilder,
	Validators,
	FormArray,
	FormGroup,
	FormControl,
} from "@angular/forms";
import { CpBaseComponent } from "../../../common/cp-base/cp-base.component";
import { RecipeCategory } from "../../../../../core/models/business/recipecategory";
import { CpLocalStorageService } from "../../../../../core/services/common/cp-localstorage.service";
import { ToastrService } from "ngx-toastr";
import { Ingredient } from "../../../../../core/models/business/ingredient";
import { IngredientService } from "../../../../../core/services/business/ingredient.service";
import { RecipeIngredient } from "../../../../../core/models/business/recipeingredient";
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
	MatGridTileHeaderCssMatStyler,
} from "@angular/material";
import { IngredientInfoComponent } from "../../ingredient/ingredient-info/ingredient-info.component";
import { TranslateService } from "@ngx-translate/core";
import { User } from "../../../../../core/models/user";
import * as _ from "lodash";
import { CommonCalcService } from "../../../../../core/services/business/common-calc.service";
import { RecipeReportOptions } from "../../../../../core/report/recipe/recipereportoptions";
import { UserService } from "../../../../../core/auth/user.service";
import { TyperformCount } from "../../../../../core/models/business/typeformCount";
import { DisplayColumns } from "../../../../../core/report/recipe/displaycolumns";
import { TypeformService } from "../../../../../core/services/business/typeform.service";
import { PlanService } from "../../../../../core/services/business/plan.service";
import {
	PerfilEnum,
	RolePermission,
} from "../../../../../core/models/security/perfil.enum";
import { UserDTO } from "../../../../../core/models/security/dto/user-dto";
import {
	NutritionInfoFactory,
	NutritionInfoService,
} from "../../../../../core/services/business/nutritioninfo.service";
import { APP_CONFIG } from "../../../../../config/app.config";
import { RecipeItem } from "../../../../../core/models/business/recipeitem";
import { PdfComponent } from "../../../components/pdf/pdf.component";
import { PdfService } from "../../../components/pdf/pdf.service";
import { FinancialService } from "../../../../../core/services/business/financial.service";
import { FinancialHistoryDTO } from "../../../../../core/models/business/financial-history";
import * as moment from "moment";
import { MultilinesChartComponent } from "../../../../partials/content/widgets/charts/multilines-chart/multilines-chart.component";
import { FinancialHistory } from "../../../../../core/models/business/financial-history";
import { Financial, FinancialFixedCostCalculationType } from "../../../../../core/models/business/financial";
import { IngredientHistory } from "../../../../../core/models/business/dto/ingredient-history";
import { IngredientHistoryService } from "../../../../../core/services/business/ingredient-history.service";
import { NutritionalInfoPipe } from "../../../../../pipes/nutritional-info.pipe";
import { SpinnerButtonOptions } from "../../../../partials/content/general/spinner-button/button-options.interface";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { DeviceDetectorService } from "ngx-device-detector";
import { ModalFixedCostsComponent } from "../../../components/recipe-costs/modal-fixed-costs/modal-fixed-costs.component";
import { ModalVariableCostsComponent } from "../../../components/recipe-costs/modal-variable-costs/modal-variable-costs.component";
import { FixedCostService } from "../../../../../core/services/business/fixedcost.service";
import {
	FixedCost,
	RecipeFixedCost,
} from "../../../../../core/models/fixedcost";
import { VariableCostService } from "../../../../../core/services/business/variablecost.service";
import {
	PercentCostType,
	RecipeVariableCost,
	VariableCost,
} from "../../../../../core/models/variablecost";
import { CurrencyPipe } from "@angular/common";
import swal, { SweetAlertOptions } from "sweetalert2";
import { Options } from "@angular-slider/ngx-slider";
import { FixedSpecificCost, SpecificCostType } from "../../../../../core/models/business/fixed-specific-cost";
import { FixedSpecificCostService } from "../../../../../core/services/business/fixed-specific-cost.service";
import { calculateFixedSpecificCostPrice } from "../../../components/recipe-costs/modal-fixed-costs/calculate-fixed-specific-cost-price";
import { DialogRecipeComponent } from "../../../tutorials/recipe/dialog-recipe/dialog-recipe.component";
import { DialogRecipeYieldsComponent } from "../../../tutorials/recipe/dialog-recipe-yields/dialog-recipe-yields.component";
import { DialogRecipeTotalWeightComponent } from "../../../tutorials/recipe/dialog-recipe-total-weight/dialog-recipe-total-weight.component";
import { DialogRecipeIngredientAddComponent } from "../../../tutorials/recipe/dialog-recipe-ingredient-add/dialog-recipe-ingredient-add.component";
import { DialogRecipeIngredientWeightComponent } from "../../../tutorials/recipe/dialog-recipe-ingredient-weight/dialog-recipe-ingredient-weight.component";
import { DialogRecipeIngredientMultiplierComponent } from "../../../tutorials/recipe/dialog-recipe-ingredient-multiplier/dialog-recipe-ingredient-multiplier.component";
import { DialogRecipeUseAmountComponent } from "../../../tutorials/recipe/dialog-recipe-use-amount/dialog-recipe-use-amount.component";
import { DialogRecipeCorrectionFactorComponent } from "../../../tutorials/recipe/dialog-recipe-correction-factor/dialog-recipe-correction-factor.component";
import { DialogRecipeBuyPricingComponent } from "../../../tutorials/recipe/dialog-recipe-buy-pricing/dialog-recipe-buy-pricing.component";
import { DialogRecipeCompoundIngredientUseAmountComponent } from "../../../tutorials/recipe/dialog-recipe-compound-ingredient-use-amount/dialog-recipe-compound-ingredient-use-amount.component";
import { DialogRecipeCompoundIngredientBuyPricingComponent } from "../../../tutorials/recipe/dialog-recipe-compound-ingredient-buy-pricing/dialog-recipe-compound-ingredient-buy-pricing.component";
import { DialogRecipeCompoundIngredientNutritionalInstructionComponent } from "../../../tutorials/recipe/dialog-recipe-compound-ingredient-nutritional-instruction/dialog-recipe-compound-ingredient-nutritional-instruction.component";
import { DialogRecipeNutritionalInstructionComponent } from "../../../tutorials/recipe/dialog-recipe-nutritional-instruction/dialog-recipe-nutritional-instruction.component";
import { DialogRecipePreparationMethodComponent } from "../../../tutorials/recipe/dialog-recipe-preparation-method/dialog-recipe-preparation-method.component";
import { DialogRecipeFinancialTotalCostComponent } from "../../../tutorials/recipe/dialog-recipe-financial-total-cost/dialog-recipe-financial-total-cost.component";
import { DialogRecipeFinancialUnitCostComponent } from "../../../tutorials/recipe/dialog-recipe-financial-unit-cost/dialog-recipe-financial-unit-cost.component";
import { DialogRecipeFinancialIngredientsComponent } from "../../../tutorials/recipe/dialog-recipe-financial-ingredients/dialog-recipe-financial-ingredients.component";
import { DialogRecipeFinancialVariableCostComponent } from "../../../tutorials/recipe/dialog-recipe-financial-variable-cost/dialog-recipe-financial-variable-cost.component";
import { DialogRecipeFinancialFixedCostComponent } from "../../../tutorials/recipe/dialog-recipe-financial-fixed-cost/dialog-recipe-financial-fixed-cost.component";
import { DialogRecipeFinancialSalePriceComponent } from "../../../tutorials/recipe/dialog-recipe-financial-sale-price/dialog-recipe-financial-sale-price.component";
import { DialogRecipeFinancialMarkupComponent } from "../../../tutorials/recipe/dialog-recipe-financial-markup/dialog-recipe-financial-markup.component";
import { DialogRecipeFinancialChartComponent } from "../../../tutorials/recipe/dialog-recipe-financial-chart/dialog-recipe-financial-chart.component";
import { DialogRecipeFinancialProfitMarginComponent } from "../../../tutorials/recipe/dialog-recipe-financial-profit-margin/dialog-recipe-financial-profit-margin.component";
import { DialogRecipeFinancialChartLegendComponent } from "../../../tutorials/recipe/dialog-recipe-financial-chart-legend/dialog-recipe-financial-chart-legend.component";
import { DialogRecipePdfRecipeComponent } from "../../../tutorials/recipe/dialog-recipe-pdf-recipe/dialog-recipe-pdf-recipe.component";
import { DialogRecipeShareRecipeComponent } from "../../../tutorials/recipe/dialog-recipe-share-recipe/dialog-recipe-share-recipe.component";
import { DialogRecipeHistoryComponent } from "../../../tutorials/recipe/dialog-recipe-history/dialog-recipe-history.component";
import { DialogRecipeNewComponent } from "../../../tutorials/recipe/dialog-recipe-new/dialog-recipe-new.component";
import { DialogRecipeDeleteComponent } from "../../../tutorials/recipe/dialog-recipe-delete/dialog-recipe-delete.component";
import { DialogRecipeEditComponent } from "../../../tutorials/recipe/dialog-recipe-edit/dialog-recipe-edit.component";
import { DialogRecipeNutritionalInfoComponent } from "../../../tutorials/recipe/dialog-recipe-nutritional-info/dialog-recipe-nutritional-info.component";
import { DialogSuportComponent } from "../../../tutorials/suport/dialog-suport/dialog-suport.component";

export interface FinancialChartData {
	profits: number[];
	expenses: number[];
	labels: string[];
	ready: boolean;
}

export enum TypeOfCostSelected {
	UNIT = "UNIT",
	TOTAL = "TOTAL",
}

const truncate = (value: number) => Math.trunc(value * 100) / 100;

@Component({
	selector: "m-recipe",
	templateUrl: "./recipe.component.html",
	styleUrls: ["./recipe.component.scss"],
})
export class RecipeComponent
	extends CpBaseComponent
	implements OnInit, OnDestroy {
	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: "primary",
		spinnerColor: "accent",
		fullWidth: false,
		mode: "indeterminate",
	};
	private chartData: any;

	ingredientDraggable: boolean;
	showHomeMeasureUnit: boolean;

	recipe: Recipe;
	user: User;
	private _currentUser: UserDTO;
	categories: RecipeCategory[] = [];
	units: Unit[] = [];
	incomeUnits: Unit[] = [];
	recipeWeightUnits: Unit[] = [];
	unitsAbbreviated: Unit[] = [];
	linguagem: string = "pt";

	ingredients: RecipeIngredient[] = [];
	ingredientsQuery: (Ingredient | Recipe)[] = [];

	ingredientInfoRef: MatDialogRef<IngredientInfoComponent>;
	modalFixedCostsRef: MatDialogRef<ModalFixedCostsComponent>;
	modalVariableCostsRef: MatDialogRef<ModalVariableCostsComponent>;
	formReceita: FormGroup;
	steps: FormArray;

	reportOptions: RecipeReportOptions;
	selectedColumns: any[] = [];

	recipePhotoUpdated: boolean = false;
	baseUrl: string = APP_CONFIG.S3_RECIPE_URL;

	titleModal: String;
	cifrao: string;
	nutritionalInfoPermission: boolean = false;
	private financialAnalysisChartData: any;

	photo: string;
	itens: RecipeItem[] = [];

	recipes: Recipe[] = [];

	fixedCosts: FixedCost[] = [];
	variableCosts: VariableCost[] = [];

	@ViewChild("pdf") pdf: PdfComponent;
	@ViewChild("pdfOld") pdfOld: any;
	@ViewChild("chart") profitChart: MultilinesChartComponent;
	@ViewChildren("textItem") textareaList: QueryList<ElementRef>;

	showDialogRecipe = false;
	selectedRecipe: DisplayColumns = {
		general: true,
		ingredients: true,
		steps: true,
		menuItens: false,
		financial: true,
		nutrition: true,
	};

	saveFormSubject: Subject<void> = new Subject<void>();

	initializedDate: Date;

	private recipeDefaultName;

	editingTotalMonthlyBilling: boolean = false;
	editingTotalSalePrice: boolean = true;
	typeOfCostSelected: TypeOfCostSelected = TypeOfCostSelected.TOTAL;

	@ViewChild("editTotalSalePrice") editTotalSalePriceInput: ElementRef;

	salePriceFromTotalCostHasInformedByUser: boolean = false;
	salePriceFromUnitCostHasInformedByUser: boolean = false;

	internalTotalCostPercentageOfNetProfit: number = 0;
	internalUnitCostPercentageOfNetProfit: number = 0;

	value: number = 100;
	options: Options = {
		floor: 0,
		ceil: 1,
		step: 0.01,
		hideLimitLabels: true,
		translate: (value: number): string => `${(value * 100).toFixed(0)}%`,
		// getLegend: () => "Teste",
		// getStepLegend: () => "Barino"
		// getPointerColor: (value: number): string => '',
		// getTickColor: (value: number): string => '#34BFA3',
		// getSelectionBarColor: (value: number): string => '#34BFA3',
		// customPositionToValue
	};

	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _service: RecipeService,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _unitService: UnitService,
		private _localStorage: CpLocalStorageService,
		private _ingredientService: IngredientService,
		private _toast: ToastrService,
		private _dialogIngredientInfo: MatDialog,
		private _dialogCostsInfo: MatDialog,
		private calc: CommonCalcService,
		private userService: UserService,
		private translate: TranslateService,
		private tfService: TypeformService,
		private planService: PlanService,
		private pdfService: PdfService,
		private dragulaService: DragulaService,
		private financialService: FinancialService,
		private ingredientHistoryService: IngredientHistoryService,
		private nutriInfoPipe: NutritionalInfoPipe,
		private deviceDetectorService: DeviceDetectorService,
		private fixedCostService: FixedCostService,
		private variableCostService: VariableCostService,
		private fixedSpecificCostService: FixedSpecificCostService,
		private currencyPipe: CurrencyPipe,
		private dialog: MatDialog
	) {
		super(_loading, _cdr);
		this.fillUser();
		this.reportOptions = new RecipeReportOptions();
		this.reportOptions.setDisplay(this.selectedRecipe);
		const doSave = () => {
			this.save(true);
		};
		this.saveFormSubject.pipe(debounceTime(1000)).subscribe(() => doSave());
		this.translate
			.get("INPUTS.UNTITLED")
			.subscribe((data) => (this.recipeDefaultName = data));
	}

	async ngOnInit() {
		this.getLanguage();
		await this.fetchUnits();
		this.loadRecipeAndBuildForm();
		this.translate.get("MODAL.DELETE_RECIPE3").subscribe((data) => {
			this.titleModal = data;
		});

		this.nutritionalInfoPermission = this.planService.hasPermission(
			RolePermission.NUTRITION_INFO_ENABLED,
			false
		);

		this.initDragula();
	}

	private addFinancialHistory(recipe: Recipe) {
		try {
			let financialHistory: FinancialHistory = {
				totalCost: this.getTotalCost(),
				salePrice: recipe.financial.totalCostValue,
				profit: recipe.financial.totalCostValue - this.getTotalCost(),
				unitCost: 0,
				unitSalePrice: 0,
				unitProfit: 0,
				financial: recipe.financial,
			};

			this.financialService.addFinancialHistory(financialHistory).subscribe(
				(response: ApiResponse) => { },
				(err) => console.warn(err)
			);
		} catch (e) {
			console.warn(e);
		}
	}

	selectCost(type: TypeOfCostSelected) {
		this.typeOfCostSelected = type;
		this.generateChartData();
	}

	editTotalSalePrice() {
		this.editingTotalSalePrice = true;
		setTimeout(() => {
			this.editTotalSalePriceInput.nativeElement.focus();
			this.editTotalSalePriceInput.nativeElement.click();
			// mobile handlers
			this.editTotalSalePriceInput.nativeElement.dispatchEvent(
				new Event("touchstart")
			);
			this.editTotalSalePriceInput.nativeElement.setSelectionRange(9999, 9999);
		}, 10);
	}

	getTotalFixedCosts(typeOfCost?: TypeOfCostSelected) {
		const { fixedCostCalculationType, fixedCostPercentage } = this.formReceita.value.financial
		const calculationType = fixedCostCalculationType || FinancialFixedCostCalculationType.GENERAL

		if (calculationType === FinancialFixedCostCalculationType.GENERAL) {
			const total = this.recipe.fixedCosts
				.map((item) => item.fixedCost.price)
				.reduce((a, b) => a + b, 0);
			return total;
		} else if (calculationType === FinancialFixedCostCalculationType.PERCENTAGE) {
			return this.getCMV(typeOfCost) * (fixedCostPercentage / 100) || 0
		} else if (calculationType === FinancialFixedCostCalculationType.SPECIFIC) {
			const total = this.recipe.fixedSpecificCosts
				.filter(item => item.checked)
				.map(item => calculateFixedSpecificCostPrice(item))
				.reduce((a, b) => a + b, 0);

			if ((typeOfCost || this.typeOfCostSelected) === TypeOfCostSelected.UNIT) {
				return total / this.getRendimento();
			}
			return total;
		}
	}

	onUserChangeSlider() {
		const forceUpdatePrice = true;
		this.recipe.totalCostPercentageOfNetProfit = this.internalTotalCostPercentageOfNetProfit;
		this.recipe.unitCostPercentageOfNetProfit = this.internalUnitCostPercentageOfNetProfit;
		this.calculateSuggestedPrice(forceUpdatePrice);
		setTimeout(() => this.save(true), 1000);
	}

	calculateSuggestedPrice(forceUpdatePrice?: boolean) {
		let suggedtedSalePrice = 0;

		if (FinancialFixedCostCalculationType.GENERAL === this.formReceita.value.financial.fixedCostCalculationType) {
			const percentageOfFixedCosts = this.getFixedCostsPercentage() / 100;

			// CV (PORCENTAGEM DO CUSTO VARIÁVEL)
			const percentageOfVariableCosts =
				this.recipe.variableCosts
					.filter((item) => {
						return (
							item.variableCost.priceUnit.uuid === PERCENT_UUID &&
							isRecipeVariableCostActive(item, this.typeOfCostSelected) &&
							item.variableCost.percentCostType === PercentCostType.SALE_PRICE
						);
					})
					.map((item) => item.variableCost.priceUnitQuantity)
					.reduce((a, b) => a + b, 0) / 100;

			// LL (PORCENTAGEM DO LUCRO LÍQUIDO)
			const percentageOfNetProfit =
				this.typeOfCostSelected === TypeOfCostSelected.TOTAL
					? this.recipe.totalCostPercentageOfNetProfit
					: this.recipe.unitCostPercentageOfNetProfit;

			// CT (PORGENTAGEM DO CUSTO TOTAL - CT = 1 - (CV + CF + LL))
			const percentageOfTotalCost =
				1 -
				(percentageOfVariableCosts +
					percentageOfFixedCosts +
					percentageOfNetProfit);

			// M (MULTIPLICADOR PARA CALCULAR O PREÇO DE VENDA - M = 1 / CT)
			const multiplier = 1 / percentageOfTotalCost;

			const variableCostsInPrice = this.recipe.variableCosts
				.filter((item) => {
					return (
						(item.variableCost.priceUnit.uuid !== PERCENT_UUID ||
							(item.variableCost.priceUnit.uuid === PERCENT_UUID &&
								item.variableCost.percentCostType ===
								PercentCostType.COST_OF_INGREDIENTS)) &&
						isRecipeVariableCostActive(item, this.typeOfCostSelected)
					);
				})
				.map((item) => {
					if (
						item.variableCost.priceUnit.uuid === PERCENT_UUID &&
						item.variableCost.percentCostType ===
						PercentCostType.COST_OF_INGREDIENTS
					) {
						return this.calc.calcRecipeVariableCostPrice(
							this.typeOfCostSelected,
							item,
							this.getCMV()
						);
					}
					return item.variableCost.price;
				})
				.reduce((a, b) => a + b, 0);

			// V (PREÇO DE VENDA = CUSTO TOTAL * M)
			suggedtedSalePrice =
				(this.getCMV() + variableCostsInPrice) * multiplier;

			console.log({
				CMV: this.getCMV(),
				FIXED_COSTS: this.getTotalFixedCosts(),
				percentageOfVariableCosts,
				variableCostsInPrice,

				CF: percentageOfFixedCosts,
				CV: percentageOfVariableCosts,
				LL: 0.2,
				CT: percentageOfTotalCost,
				M: multiplier,
				V: (this.getTotalIngredients() + variableCostsInPrice) * multiplier,
			});
		} else {
			suggedtedSalePrice = (this.getTotalOtherCosts() + this.getCMV() + this.getTotalFixedCosts()) / (1 - this.getPercentageOfNetProfit());
		}

		if (!isNaN(suggedtedSalePrice) && suggedtedSalePrice > 0) {
			if (
				forceUpdatePrice ||
				(!this.salePriceFromTotalCostHasInformedByUser)
			) {
				if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
					this.formReceita.patchValue(
						{
							financial: {
								totalCostValue: suggedtedSalePrice,
							},
						},
						{
							emitEvent: false,
						}
					);
				}
			}
			if (
				forceUpdatePrice ||
				(!this.salePriceFromUnitCostHasInformedByUser)
			) {
				if (this.typeOfCostSelected === TypeOfCostSelected.UNIT) {
					this.formReceita.patchValue(
						{
							financial: {
								costUnitValue: suggedtedSalePrice,
							},
						},
						{
							emitEvent: false,
						}
					);
					this.onChangeComponent();
				}
			}
		}

		return suggedtedSalePrice;

	}

	updateSalePrice() {
		if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
			this.salePriceFromTotalCostHasInformedByUser = false;
			this.formReceita.patchValue({
				financial: {
					totalCostValue: null,
				},
			});
		} else {
			this.salePriceFromUnitCostHasInformedByUser = false;
			this.formReceita.patchValue({
				financial: {
					costUnitValue: null,
				},
			});
		}
		this.save(true);
	}

	openModalVariableCosts() {
		this.modalVariableCostsRef = this._dialogCostsInfo.open(ModalVariableCostsComponent, {
			data: {
				cifrao: this.cifrao,
				units: this.units,
				totalCost: this.getSalePrice(),
				cmv: this.getCMV(),
				variableCosts: this.variableCosts,
				recipeVariableCosts: this.recipe.variableCosts,
				typeOfCostSelected: this.typeOfCostSelected,
				recipeYield: this.formReceita.value.geral.unityQuantity,
			},
		});
		this.modalVariableCostsRef.afterClosed().subscribe((returnValue) => {
			this.variableCosts = _.sortBy(returnValue.items.variableCosts, [
				function (o) {
					return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				},
			]);
			if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
				this.recipe.variableCosts = returnValue.items.recipeVariableCosts.map(
					(item) => ({
						...item,
						totalCostChecked: item.active,
					})
				);
			} else {
				this.recipe.variableCosts = returnValue.items.recipeVariableCosts.map(
					(item) => ({
						...item,
						unitCostChecked: item.active,
					})
				);
			}
			this.save(true);
		});
	}

	async openModalFixedCosts() {
		const fixedSpecificCostResponse = await this.fixedSpecificCostService
			.get()
			.toPromise();

		const sortedFixedSpecificCosts = _.sortBy(fixedSpecificCostResponse.data, [
			function (o) {
				return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			}
		])

		const mappedRecipeFixedSpecificCosts = this.recipe.fixedSpecificCosts.map((item) => {
			return {
				...item,
				fixedSpecificCost: sortedFixedSpecificCosts.find(s => s.id === item.fixedSpecificCost.id)
			}
		})

		this.modalFixedCostsRef = this._dialogCostsInfo.open(ModalFixedCostsComponent, {
			data: {
				cifrao: this.cifrao,
				units: this.units,
				totalCost: this.getSalePrice(),
				cmv: this.getCMV(),
				fixedCosts: this.fixedCosts,
				recipeFixedCosts: this.recipe.fixedCosts,
				typeOfCostSelected: this.typeOfCostSelected,
				fixedSpecificCosts: sortedFixedSpecificCosts,
				recipeFixedSpecificCosts: mappedRecipeFixedSpecificCosts,
				financial:
					this.formReceita.value.financial,
				recipeId: this.recipe.id
			},
		});
		this.modalFixedCostsRef.afterClosed().subscribe((returnValue) => {
			this.formReceita.patchValue({
				financial: {
					totalMonthlyBilling: returnValue.totalMonthlyBilling,
					fixedCostPercentage: returnValue.fixedCostPercentage,
					fixedCostCalculationType: returnValue.selectedTab
				},
			});
			_.forEach(returnValue.items, (item) => {
				this.fixedCosts.forEach((fc) => {
					if (fc.id === item.id) {
						fc.price = item.price;
						fc.name = item.name;
					}
				});
			});

			const activeItems = returnValue.items.filter(
				(item: any) => item.active
			);
			this.recipe.fixedCosts = [];
			_.forEach(activeItems, (item) => {
				const recipeFixedCosts: RecipeFixedCost = {
					id: item.recipeFixedCostId,
					fixedCost: item,
				};
				this.recipe.fixedCosts.push(recipeFixedCosts);
			});

			this.fixedCosts = _.sortBy(returnValue.items, [
				function (o) {
					return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				},
			]);

			this.recipe.fixedSpecificCosts = returnValue.recipeFixedSpecificCosts.map(item => ({
				...item,
				id: `${item.id}`.includes('temp_') ? null : item.id // remove temp id
			}));

			this.save(true);
		});
	}

	atualFinancial: FinancialHistory;

	checkDeleteRecipeiOS() {
		if (this.deviceDetectorService.os === "iOS") {
			document.getElementById("deleteRecipeMobile").click();
		}
	}

	private reloadProfitChart(recipe: Recipe, changes: Financial) {
		this.atualFinancial = {
			totalCost: this.getTotalCost(),
			salePrice: changes.totalCostValue,
			profit: changes.totalCostValue - this.getTotalCost(),
			unitCost: 0,
			unitSalePrice: 0,
			unitProfit: 0,
			financial: changes,
			inclusion: moment().toDate(),
		};

		let labels: string[] = [];
		let profitsData: number[] = [];
		let expensesData: number[] = [];

		if (!this.financialHistoryData) {
			this.financialHistoryData = [];
		}

		this.financialHistoryData.forEach((dto: FinancialHistoryDTO) => {
			labels.push(moment(dto.inclusion).format("DD/MMM"));
			profitsData.push(dto.profit);
			expensesData.push(dto.totalCost);
		});

		labels.push(moment(this.atualFinancial.inclusion).format("DD/MMM"));
		profitsData.push(this.atualFinancial.profit);
		expensesData.push(this.atualFinancial.totalCost);

		let data: FinancialChartData = {
			labels: labels,
			profits: profitsData,
			expenses: expensesData,
			ready: true,
		};

		this.financialChartData = data;

		this.onChangeComponent();

		if (this.profitChart) {
			this.profitChart.update(data);
		}

		this.onChangeComponent();
	}

	public financialChartData: FinancialChartData = {
		profits: [4.1, 5.9, 4.2, 1.9, 1.9],
		expenses: [6.1, 3.8, 7, 2.1, 6],
		labels: ["text", "text", "text", "text", "text"],
		ready: false,
	};

	financialHistoryData: FinancialHistoryDTO[];

	private updateFinancialChartData(data: FinancialHistoryDTO[]) {
		this.financialHistoryData = data;

		let labels: string[] = [];
		let profitsData: number[] = [];
		let expensesData: number[] = [];

		this.financialHistoryData.forEach((dto: FinancialHistoryDTO) => {
			labels.push(moment(dto.inclusion).format("DD/MMM"));
			profitsData.push(dto.profit);
			expensesData.push(dto.totalCost);
		});

		this.financialChartData.labels = labels;
		this.financialChartData.profits = profitsData;
		this.financialChartData.expenses = expensesData;

		this.financialChartData.ready = true;

		this.onChangeComponent();
	}

	get screenWidth() {
		return +window.innerWidth;
	}

	private loadFinancialHistoryData() {
		if (!this.recipe || !this.recipe.financial) {
			return;
		}

		this.financialService
			.findHistoryByFinancialId(this.recipe.financial.id)
			.subscribe(
				(response: ApiResponse) => {
					this.updateFinancialChartData(response.data);
				},
				(err) => console.warn(err)
			);
	}

	fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user) {
			this.userService.findByIdReduced(this.user.id).subscribe(
				(res) => {
					this._currentUser = res.data;
					this.cifrao = this._currentUser.currency;
					this.showHomeMeasureUnit = this._currentUser.showHomeMeasureUnit;
				},
				(err) => { }
			);
		}
	}

	getLanguage() {
		this.translate.get("TRANSLATOR.LINGUAGEM").subscribe((data) => {
			this.linguagem = data;
			this.fetchCategories();
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		this.destroyDragula();
	}

	initDragula() {
		this.dragulaService.createGroup("INGREDIENTS_DRAGGABLE", {
			direction: "vertical",
			moves: () => {
				return this.ingredientDraggable;
			},
		});
	}

	handleReorderIngredients(ordered: RecipeIngredient[]) {
		ordered.forEach((item, i) => (item.order = i));
		this.ingredients = ordered;
		this.saveFormSubject.next();
	}

	destroyDragula() {
		this.dragulaService.destroy("INGREDIENTS_DRAGGABLE");
	}

	createItem(description: string, order: number): FormGroup {
		return this._formBuilder.group({
			order: [order, [Validators.required]],
			description: [description, [Validators.required]],
		});
	}

	addItem(description: string = ""): void {
		this.steps = this.formReceita.get("steps") as FormArray;
		const item: FormGroup = this.createItem(description, this.steps.length);
		this.steps.push(item);
	}

	removeStep(index: number) {
		const control = this.formReceita.controls["steps"] as FormArray;
		control.removeAt(index);
	}

	doDismiss(event) {
		console.log("não remover ingrediente");
	}

	removeRecipeIngredient(recipeIngredient: RecipeIngredient) {
		this.ingredients = _.filter(this.ingredients, (value, index) => {
			return value != recipeIngredient;
		});

		this.formReceita.patchValue({
			ingredients: this.ingredients,
		});
	}

	onChangeIngredients() {
		this.formReceita.patchValue({
			ingredients: this.ingredients,
		});
		this.saveFormSubject.next();
	}

	getTotalOtherCosts(typeOfCost?: TypeOfCostSelected): number {
		const cost = typeOfCost || this.typeOfCostSelected;

		const getPrice = (recipeVariableCost: RecipeVariableCost) => {
			if (!recipeVariableCost) return 0;
			const amount =
				recipeVariableCost.variableCost.percentCostType ===
					PercentCostType.SALE_PRICE ||
					recipeVariableCost.variableCost.priceUnit.uuid !== PERCENT_UUID
					? this.getSalePrice(typeOfCost)
					: this.getCMV(typeOfCost);

			return this.calc.calcRecipeVariableCostPrice(
				cost,
				recipeVariableCost,
				amount
			);
		};

		const total = this.recipe.variableCosts
			.filter((item) =>
				cost === TypeOfCostSelected.TOTAL
					? item.totalCostChecked
					: item.unitCostChecked
			)
			.map(getPrice)
			.reduce((a, b) => a + b, 0);
		return total;
	}

	private calculateOtherCostsPercentPrice() {
		const costValue = this.formReceita.value.financial.totalCostValue;
		this.itens.forEach((item) => {
			if (item.unitUsed.uuid === PERCENT_UUID) {
				item.price = costValue * (item.unityQuantityUsed / 100);
			}
		});
	}

	save = _.throttle(async (automatic) => {
		await this.handleSave(automatic);
	}, 2000);

	private async handleSave(automatic?: boolean) {
		if (!automatic) {
			this.spinner.active = true;

			this._loading.show();
		} else {
			if (this.formReceita.value.geral.recipeCategory == -1) {
				return;
			}
		}

		this.formReceita.patchValue({
			user: this._localStorage.getLoggedUser(),
		});

		if (this.ingredientHistoryList && this.ingredientHistoryList.length > 0) {
			this.saveIngredientHistory(this.ingredientHistoryList);
		}

		if (this.recipe && this.recipe.id) {
			this.updateRecipe(automatic);
		} else {
			await this.createUserIngredients();
			this.createRecipe(automatic);
		}
	}

	private async createUserIngredients() {
		try {
			let order: number = 0;

			const promises = _.map(this.ingredients, (ri: RecipeIngredient) => {
				ri.order = order++;

				if (_.isNil(ri.ingredient.id)) {
					return this._ingredientService.insert(ri.ingredient).toPromise();
				} else {
					return this._ingredientService.update(ri.ingredient).toPromise();
				}
			});

			const results = await Promise.all(promises);

			const ingredients = _.map(results, (apiresp: ApiResponse) => {
				return apiresp.data;
			});

			this.ingredients = this.ingredients.map((value, i) => {
				value.ingredient = ingredients[i];
				return value;
			});

			this.formReceita.patchValue({
				ingredients: this.ingredients,
			});
		} catch (e) {
			console.log(e);
		}
	}

	onPhotoChange(base64Content: any) {
		this.photo = base64Content;
		this.recipePhotoUpdated = true;
		this.saveFormSubject.next();
	}

	private async updateRecipe(automatic?: boolean) {
		this.formReceita.addControl("id", new FormControl(this.recipe.id, []));

		this.formReceita.value.itens = this.itens;

		const imageDto: any = {
			content: this.photo,
		};

		if (!automatic) {
			this._loading.show();
		}

		const updateNewIngredients = (ingredients: RecipeIngredient[]) => {
			this.ingredients.forEach(ingredient => {
				if (ingredients) {
					const updated = ingredients.find(i => i.ingredient.name === ingredient.ingredient.name)
					ingredient.ingredient.id = updated.ingredient.id
				}
			})
			this.formReceita.patchValue({
				ingredients: this.ingredients
			});
		}

		if (this.recipePhotoUpdated) {
			this._service.uploadPhoto(this.recipe.id, imageDto).subscribe(
				(response: ApiResponse) => {
					try {
						if (response && response.data && response.data.key) {
							this.formReceita.controls.geral.patchValue({
								photoUrl: this.baseUrl + response.data.key,
							});
						} else {
							this._toast.warning(
								"Falha ao tentar salvar a imagem da receita. Tente novamente mais tarde."
							);
							this._loading.hide();
							return;
						}
					} catch (e) {
						console.warn(e.message);
					}

					let recipe: any = this.formReceita.value;

					recipe.name = this.formReceita.value.geral.name;
					recipe.description = this.formReceita.value.geral.description;
					recipe.photoUrl = this.formReceita.value.geral.photoUrl;
					recipe.portionName = this.formReceita.value.geral.portionName;
					recipe.portionWeight = this.formReceita.value.geral.portionWeight;
					recipe.totalWeight = this.formReceita.value.geral.totalWeight;
					recipe.portions = this.formReceita.value.geral.portions;
					recipe.preparationTime = this.formReceita.value.geral.preparationTime;
					recipe.recipeCategory = this.formReceita.value.geral.recipeCategory;

					recipe.unityQuantity = this.formReceita.value.geral.unityQuantity;
					recipe.unit = this.formReceita.value.geral.unit;

					recipe.recipeWeight = this.formReceita.value.geral.reci;
					recipe.fixedCosts = this.recipe.fixedCosts;
					recipe.variableCosts = this.recipe.variableCosts;
					recipe.totalCostPercentageOfNetProfit =
						this.recipe.totalCostPercentageOfNetProfit;
					recipe.unitCostPercentageOfNetProfit =
						this.recipe.unitCostPercentageOfNetProfit;

					if (_.isNil(recipe.name)) {
						this.formReceita.value.name = this.recipeDefaultName;
					}

					delete recipe.geral;

					if (this.recipe.financial.id) {
						recipe.financial.id = this.recipe.financial.id;
					}

					this._service.update(recipe).subscribe(
						(response: ApiResponse) => {
							this._loading.hide();

							this.addFinancialHistory(response.data.recipe);

							updateNewIngredients(response.data.newIngredients);

							this.recipePhotoUpdated = false;

							if (!automatic) {
								this._toast.success(Messages.SUCCESS);
								this._router.navigate([CpRoutes.RECIPES]);
							}
						},
						(error) => {
							console.warn(error);
							this._loading.hide();
						}
					);
				},
				(err) => console.warn(err)
			);
		} else {
			let recipe: any = this.formReceita.value;

			recipe.name = this.formReceita.value.geral.name;
			recipe.description = this.formReceita.value.geral.description;
			recipe.photoUrl = this.formReceita.value.geral.photoUrl;
			recipe.portionName = this.formReceita.value.geral.portionName;
			recipe.portionWeight = this.formReceita.value.geral.portionWeight;
			recipe.totalWeight = this.formReceita.value.geral.totalWeight;
			recipe.portions = this.formReceita.value.geral.portions;
			recipe.preparationTime = this.formReceita.value.geral.preparationTime;
			recipe.recipeCategory = this.formReceita.value.geral.recipeCategory;

			recipe.unityQuantity = this.formReceita.value.geral.unityQuantity;
			recipe.unit = this.formReceita.value.geral.unit;
			recipe.recipeWeight = this.formReceita.value.geral.recipeWeight;
			recipe.recipeWeightUnit = this.formReceita.value.geral.recipeWeightUnit;
			recipe.fixedCosts = this.recipe.fixedCosts;
			recipe.variableCosts = this.recipe.variableCosts;
			recipe.fixedSpecificCosts = this.recipe.fixedSpecificCosts;
			recipe.totalCostPercentageOfNetProfit =
				this.recipe.totalCostPercentageOfNetProfit;
			recipe.unitCostPercentageOfNetProfit =
				this.recipe.unitCostPercentageOfNetProfit;

			if (_.isNil(recipe.name)) {
				this.formReceita.value.name = this.recipeDefaultName;
			}

			delete recipe.geral;

			if (this.recipe.financial.id) {
				recipe.financial.id = this.recipe.financial.id;
			}

			this._service.update(recipe).subscribe(
				(response: ApiResponse) => {
					this._loading.hide();

					this.addFinancialHistory(response.data.recipe);

					updateNewIngredients(response.data.newIngredients);
					if (!automatic) {
						this._toast.success(Messages.SUCCESS);
						this._router.navigate([CpRoutes.RECIPES]);
					}
				},
				(error) => {
					this._loading.hide();
				}
			);
		}
	}

	getCMV(typeOfCostSelected?) {
		const selectedCost = typeOfCostSelected || this.typeOfCostSelected;
		let cmv = this.getTotalIngredients();
		if (selectedCost === TypeOfCostSelected.UNIT) {
			cmv = this.getTotalIngredients() / this.getRendimento();
		}
		return this.getAmountBasedOnRecipeYield(cmv);
	}

	getPercentageOfNetProfit() {
		if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
			return this.recipe.totalCostPercentageOfNetProfit;
		}
		return this.recipe.unitCostPercentageOfNetProfit;
	}

	calcProfit() {
		try {
			return this.getSalePrice() -
				this.getCMV() -
				this.getFixedCostsBasedOnSalePrice() -
				this.getTotalOtherCosts();
		} catch (e) {
			console.warn(e);
			return 0;
		}
	}

	private async createRecipe(automatic?: boolean) {
		if (this.recipePhotoUpdated) {
			const imageDto: any = {
				content: this.photo,
			};

			this._service.uploadRecipePhoto(imageDto).subscribe(
				(response: ApiResponse) => {
					try {
						if (response && response.data && response.data.key) {
							this.formReceita.controls.geral.patchValue({
								photoUrl: this.baseUrl + response.data.key,
							});
						} else {
							this._toast.warning(
								"Falha ao tentar salvar a imagem da receita. Tesnte novamente mais tarde."
							);
							this._loading.hide();
							return;
						}

						this.formReceita.value.itens = this.itens;

						let recipe: any = this.formReceita.value;

						recipe.name = this.formReceita.value.geral.name;
						recipe.description = this.formReceita.value.geral.description;
						recipe.photoUrl = this.formReceita.value.geral.photoUrl;
						recipe.portionName = this.formReceita.value.geral.portionName;
						recipe.portionWeight = this.formReceita.value.geral.portionWeight;
						recipe.totalWeight = this.formReceita.value.geral.totalWeight;
						recipe.portions = this.formReceita.value.geral.portions;
						recipe.preparationTime =
							this.formReceita.value.geral.preparationTime;
						recipe.recipeCategory = this.formReceita.value.geral.recipeCategory;

						recipe.unityQuantity = this.formReceita.value.geral.unityQuantity;
						recipe.unit = this.formReceita.value.geral.unit;

						recipe.recipeWeight = this.formReceita.value.geral.recipeWeight;
						recipe.recipeWeightUnit =
							this.formReceita.value.geral.recipeWeightUnit;

						delete recipe.geral;

						if (_.isNil(recipe.name)) {
							this.formReceita.value.name = this.recipeDefaultName;
						}
						this._service.insert(recipe).subscribe(
							(response: ApiResponse) => {
								const tfc: TyperformCount = this.tfService.getTotalRecipesDone(
									this.user
								);
								tfc.count = tfc.count + 1;
								this.tfService.setTotalRecipesDone(tfc);

								this.recipe = response.data;

								this.addFinancialHistory(this.recipe);

								if (automatic) {
									this._router.navigate([CpRoutes.RECIPE, response.data.id]);
								} else {
									this._loading.hide();
									this._toast.success(Messages.SUCCESS);
									this._router.navigate([CpRoutes.RECIPES]);
								}
							},
							(error) => {
								this._loading.hide();
							}
						);
					} catch (e) {
						console.warn(e.message);
					}
				},
				(err) => console.warn(err)
			);
		} else {
			this.formReceita.value.itens = this.itens;

			let recipe: any = this.formReceita.value;

			recipe.name = this.formReceita.value.geral.name;
			recipe.description = this.formReceita.value.geral.description;
			recipe.photoUrl = this.formReceita.value.geral.photoUrl;
			recipe.portionName = this.formReceita.value.geral.portionName;
			recipe.portionWeight = this.formReceita.value.geral.portionWeight;
			recipe.totalWeight = this.formReceita.value.geral.totalWeight;
			recipe.portions = this.formReceita.value.geral.portions;
			recipe.preparationTime = this.formReceita.value.geral.preparationTime;
			recipe.recipeCategory = this.formReceita.value.geral.recipeCategory;

			recipe.unityQuantity = this.formReceita.value.geral.unityQuantity;
			recipe.unit = this.formReceita.value.geral.unit;

			recipe.recipeWeight = this.formReceita.value.geral.recipeWeight;
			recipe.recipeWeightUnit = this.formReceita.value.geral.recipeWeightUnit;

			delete recipe.geral;

			if (_.isNil(recipe.name)) {
				this.formReceita.value.name = this.recipeDefaultName;
			}

			this._service.insert(recipe).subscribe(
				(response: ApiResponse) => {
					const tfc: TyperformCount = this.tfService.getTotalRecipesDone(
						this.user
					);
					tfc.count = tfc.count + 1;
					this.tfService.setTotalRecipesDone(tfc);

					this.recipe = response.data;

					this.addFinancialHistory(this.recipe);

					if (automatic) {
						this._router.navigate([CpRoutes.RECIPE, response.data.id]);
					} else {
						this._loading.hide();
						this._toast.success(Messages.SUCCESS);
						this._router.navigate([CpRoutes.RECIPES]);
					}
				},
				(error) => {
					this._loading.hide();
				}
			);
		}
	}

	cancel() {
		this._router.navigate([CpRoutes.RECIPES]);
	}

	private ingredientHistoryList: IngredientHistory[];

	async saveIngredientHistory(list: IngredientHistory[]) {
		this.ingredientHistoryService.add(list);
	}

	addHistory(recipeIngredient: RecipeIngredient) {
		try {
			let history: IngredientHistory = {
				ingredient: recipeIngredient.ingredient,
				price: recipeIngredient.ingredient.purchasePrice.price,
				unit: recipeIngredient.ingredient.purchasePrice.unit,
				unityQuantity: recipeIngredient.ingredient.purchasePrice.unityQuantity,
			};

			if (!this.ingredientHistoryList) {
				this.ingredientHistoryList = [];
			}

			let index = _.findIndex(
				this.ingredientHistoryList,
				(h: IngredientHistory) => {
					if (recipeIngredient.ingredient.id) {
						return h.ingredient.id == recipeIngredient.ingredient.id;
					}

					return h.ingredient.name == recipeIngredient.ingredient.name;
				}
			);

			if (index > -1) {
				this.ingredientHistoryList[index] = history;
			} else {
				if (recipeIngredient.ingredient.id) {
					this.ingredientHistoryList.push(history);
				}
			}
		} catch (e) {
			console.warn(e.message);
		}
	}

	setIngredientInfo(index: number) {
		this.ingredientInfoRef = this._dialogIngredientInfo.open(
			IngredientInfoComponent,
			{
				data: {
					recipeIngredient: this.ingredients[index],
				},
				panelClass: "cpPanelOverflowRecipe",
			}
		);

		this.ingredientInfoRef.afterClosed().subscribe((ingredientInfoData) => {
			if (!ingredientInfoData || !ingredientInfoData.recipeIngredient) {
				return;
			}

			if (ingredientInfoData.viewRecipe === true) {
				// this._router.navigateByUrl(CpRoutes.RECIPE + ingredientInfoData.recipeIngredient.ingredient.recipeCopiedId);
				return;
			} else if (ingredientInfoData.exclude === true) {
				this.removeRecipeIngredient(ingredientInfoData.recipeIngredient);
				return;
			} else {
				this.ingredients[index] = ingredientInfoData.recipeIngredient;

				this.addHistory(ingredientInfoData.recipeIngredient);

				this.formReceita.patchValue({
					ingredients: this.ingredients,
				});
			}

			this.onChangeComponent();

			this.saveFormSubject.next();
		});

		this.onChangeComponent();
	}

	getAmountBasedOnRecipeYield(total: number): number {
		let amount = total;
		if (
			this.formReceita.value.geral &&
			this.formReceita.value.geral.unityQuantity &&
			this.formReceita.value.ingredientsYield
		) {
			amount =
				(this.formReceita.value.ingredientsYield /
					this.formReceita.value.geral.unityQuantity) *
				amount;
		}
		return amount;
	}

	private getSalePrice(typeOfCost?: TypeOfCostSelected) {
		let salePrice = this.formReceita.value.financial.totalCostValue;
		const selectedCost = typeOfCost || this.typeOfCostSelected;
		if (selectedCost === TypeOfCostSelected.UNIT) {
			salePrice = this.formReceita.value.financial.costUnitValue;
		}
		return salePrice || 0;
	}

	getPercentageBasedOnSalePrice(amount: number) {
		const result = this.round((amount * 100) / this.getSalePrice());
		return isNaN(result) || !isFinite(result) ? 0 : result;
	}

	getFixedCostsPercentage() {
		const fixedCosts = this.getTotalFixedCosts();
		if (FinancialFixedCostCalculationType.GENERAL === this.formReceita.value.financial.fixedCostCalculationType) {
			const totalMonthlyBilling =
				this.formReceita.value.financial.totalMonthlyBilling;
			if (!totalMonthlyBilling || !fixedCosts) return 0;
			return (fixedCosts * 100) / totalMonthlyBilling;
		}
		return (fixedCosts * 100) / this.getSalePrice()
	}

	getFixedCostsBasedOnSalePrice(typeOfCost?: TypeOfCostSelected) {
		if (FinancialFixedCostCalculationType.GENERAL === this.formReceita.value.financial.fixedCostCalculationType) {
			const salePrice = this.getSalePrice(typeOfCost);
			if (!salePrice) return 0;
			return salePrice * (this.getFixedCostsPercentage() / 100);
		}
		return this.getTotalFixedCosts(typeOfCost);
	}

	getTotalIngredients(): number {
		return this.calc.totalRecipeIngredients(this.ingredients);
	}

	calcIngredientPrice(recipeIngredient: RecipeIngredient) {
		return this.calc.calcIngredientPrice(recipeIngredient);
	}

	calcIngredientAmount(recipeIngredient: RecipeIngredient) {
		if (recipeIngredient.ingredient.recipeCopiedId != null) {
			return 1;
		} else {
			return recipeIngredient.amount;
		}
	}

	getTotalCost(): number {
		return (
			this.getAmountBasedOnRecipeYield(this.getTotalIngredients()) +
			this.getTotalOtherCosts(TypeOfCostSelected.TOTAL) +
			this.getFixedCostsBasedOnSalePrice(TypeOfCostSelected.TOTAL)
		);
	}

	getUnitCost(): number {
		let rendimento: number = this.getRendimento();

		const totalCost =
			this.getAmountBasedOnRecipeYield(this.getTotalIngredients()) /
			rendimento +
			this.getTotalOtherCosts(TypeOfCostSelected.UNIT) +
			this.getFixedCostsBasedOnSalePrice(TypeOfCostSelected.UNIT);

		return totalCost;
	}

	private round = (num: any) => Math.round(num * 100) / 100;

	private formatMarkup = (value: any) => {
		const splitted = value.toString().split(".");
		if (splitted[1]) {
			if (splitted[1].length >= 2) {
				return Number(value).toFixed(2);
			}
			return Number(value).toFixed(1);
		} else {
			return Number(value).toFixed(1);
		}
	};

	private getTotalCostMarkup() {
		const recipe = this.formReceita.value;
		if (recipe && recipe.financial) {
			const costValue = this.formReceita.value.financial.totalCostValue;
			let totalCostPerc = 0.0;
			if (costValue && costValue > 0) {
				totalCostPerc =
					this.formReceita.value.financial.totalCostValue / this.getTotalCost();
			}

			if (isNaN(totalCostPerc) || !isFinite(totalCostPerc)) {
				totalCostPerc = 0;
			}

			return this.formatMarkup(totalCostPerc);
		}
		return 0;
	}

	private getUnitCostMarkup() {
		const recipe = this.formReceita.value;

		if (recipe && recipe.financial) {
			const costUnitValue = this.formReceita.value.financial.costUnitValue;
			let costUnitPerc = 0.0;

			if (costUnitValue && costUnitValue > 0) {
				costUnitPerc = costUnitValue / this.getUnitCost();
			}

			if (isNaN(costUnitPerc) || !isFinite(costUnitPerc)) {
				costUnitPerc = 0;
			}

			return this.formatMarkup(costUnitPerc);
		}
		return 0;
	}

	getMarkup() {
		if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
			return this.getTotalCostMarkup();
		} else {
			return this.getUnitCostMarkup();
		}
	}

	onBlurCostValue() {
		this.salePriceFromTotalCostHasInformedByUser = true;
		this.editingTotalSalePrice = false;
		const profitPercent = this.getPercentageBasedOnSalePrice(this.calcProfit());
		this.recipe.totalCostPercentageOfNetProfit = profitPercent / 100
		this.internalTotalCostPercentageOfNetProfit = Math.trunc(this.recipe.totalCostPercentageOfNetProfit * 100) / 100
		this.calculateSuggestedPrice();
		setTimeout(() => this.save(true), 1000);
	}

	onBlurCostUnitValue() {
		this.editingTotalSalePrice = false;
		this.salePriceFromUnitCostHasInformedByUser = true;
		const profitPercent = this.getPercentageBasedOnSalePrice(this.calcProfit());
		this.recipe.unitCostPercentageOfNetProfit = profitPercent / 100;
		this.internalUnitCostPercentageOfNetProfit = Math.trunc(this.recipe.unitCostPercentageOfNetProfit * 100) / 100
		this.calculateSuggestedPrice();
		setTimeout(() => this.save(true), 1000);
	}

	onChangeCostValue() {
		this.formReceita.patchValue({
			financial: {
				totalCostPerc: this.getTotalCostMarkup(),
			},
		});
		this.getTotalCost();
		this.onChangeComponent();
		this.calculateOtherCostsPercentPrice();
	}

	private getRendimento(): number {
		if (!this.formReceita.value.geral) {
			return 0;
		}

		if (this.formReceita.value.ingredientsYield) {
			return this.formReceita.value.ingredientsYield;
		}

		return this.formReceita.value.geral.unityQuantity
			? this.formReceita.value.geral.unityQuantity
			: 1;
	}

	onChangeCostUnitValue() {
		this.formReceita.patchValue({
			financial: {
				costUnitPerc: this.getUnitCostMarkup(),
			},
		});
		this.onChangeComponent();
	}

	delete() {
		this._loading.show();

		this._service.delete(this.user.id, this.recipe.id).subscribe(
			(apiResponse) => {
				this._loading.hide();
				this._toast.success(Messages.SUCCESS);
				this._router.navigate([CpRoutes.RECIPES]);
			},
			(error) => {
				this._loading.hide();
			}
		);
	}

	private loadRecipeAndBuildForm() {
		this._route.params.subscribe((params) => {
			const id = params["id"];

			if (!isNaN(id) && !_.isNil(id)) {
				this._loading.show();

				this._service.getById(id).subscribe(
					async (apiResponse) => {

						const fixedCostResponse = await this.fixedCostService
							.get()
							.toPromise();
						this.fixedCosts = _.sortBy(fixedCostResponse.data, [
							function (o) {
								return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
							},
						]);

						const variableCostResponse = await this.variableCostService
							.get()
							.toPromise();
						this.variableCosts = _.sortBy(variableCostResponse.data, [
							function (o) {
								return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
							},
						]);

						const recipe: Recipe = apiResponse.data;

						this.internalTotalCostPercentageOfNetProfit = recipe.totalCostPercentageOfNetProfit;
						this.internalUnitCostPercentageOfNetProfit = recipe.unitCostPercentageOfNetProfit;

						if (
							!_.isNil(recipe.financial.costUnitValue) &&
							recipe.financial.costUnitValue !== 0
						) {
							this.salePriceFromTotalCostHasInformedByUser = true;
						}
						if (
							!_.isNil(recipe.financial.totalCostValue) &&
							recipe.financial.totalCostValue !== 0
						) {
							this.salePriceFromTotalCostHasInformedByUser = true;
						}

						const emptyRecipeNames = ["Untitled", "Sin titulo", "Sem título"];

						if (emptyRecipeNames.includes(recipe.name)) {
							recipe.name = null;
						}

						if (!_.isNil(recipe.unit)) {
							if ([1, 2].includes(recipe.unit.id)) {
								recipe.recipeWeight = recipe.unityQuantity;
								recipe.recipeWeightUnit = recipe.unit;

								recipe.unityQuantity = 0;
								recipe.unit = null;
							}
						}

						for (const ingredient of recipe.ingredients) {
							if (!_.isNil(ingredient.ingredient.recipeCopiedId)) {
								const { data } = await this._service
									.getById(ingredient.ingredient.recipeCopiedId)
									.toPromise();
								this.recipes.push(data);
							}
						}

						// if (recipe && !_.isNil(recipe.ingredients) && recipe.ingredients.length > 0) {
						// 	recipe.ingredients = _.orderBy(recipe.ingredients, ['inclusion'], ['asc']);
						// }

						this.ingredients = recipe.ingredients;
						this.ingredients = _.orderBy(this.ingredients, "order", ["asc"]);

						// verifica se deve calcular nutrition info

						for (const ingredient of this.ingredients) {
							if (ingredient.ingredient.recipeCopiedId) {
								const response = await this._service
									.getById(ingredient.ingredient.recipeCopiedId)
									.toPromise();
								const recipe: Recipe = response.data;

								if (ingredient.nutritionInfo) {
									ingredient.nutritionInfo = NutritionInfoFactory.reset(
										ingredient.nutritionInfo
									);

									ingredient.nutritionInfo.recipe = recipe;

									NutritionInfoFactory.calculate(
										this.nutriInfoPipe,
										recipe,
										ingredient.nutritionInfo
									);
								}
							}
						}

						this.itens = recipe.itens;
						this.itens = _.orderBy(this.itens, "order", ["asc"]);

						this.createForm(recipe);

						if (this.screenWidth < 768) {
							setTimeout(() => {
								this._loading.hide();
							}, 1000);
						} else {
							this._loading.hide();
						}

						setTimeout(() => {
							this.formReceita.patchValue({
								ingredients: this.ingredients,
							});
							this.resizeTextarea();
						}, 200);

						this.initializedDate = new Date();

						// DEBUG
						// setTimeout(() => {
						// 	this.openModalFixedCosts();
						// }, 1000);
					},
					(error) => {
						this._loading.hide();
					}
				);
			} else {
				this.createForm();
			}
		});
	}

	private resizeTextarea() {
		this.textareaList.forEach((item) => {
			const element = item.nativeElement;
			element.style.height = "";
			let aditional = 0;
			if (+window.innerWidth <= 768) {
				aditional = 5;
			}
			element.style.height = element.scrollHeight + aditional + "px";
		});
	}

	private createForm(recipe?: Recipe) {
		const getDefaultLabelValueBasedOnLanguage = () => {
			if (this.linguagem !== "pt") {
				return true;
			}
			return false;
		};

		const getLabelValue = (value, defaultValue) => {
			if (_.isNil(value)) {
				return defaultValue;
			}
			return value;
		};

		this.formReceita = this._formBuilder.group({
			ingredientsYield: [recipe ? recipe.ingredientsYield : null, []],
			user: [null, []],
			steps: this._formBuilder.array([]),
			ingredients: [recipe ? recipe.ingredients : [], []],
			itens: this._formBuilder.array([]),
			financial: this._formBuilder.group({
				totalCostValue: [recipe ? recipe.financial.totalCostValue : 0, []],
				totalCostPerc: [recipe ? recipe.financial.totalCostPerc : 0, []],
				costUnitValue: [recipe ? recipe.financial.costUnitValue : 0, []],
				costUnitPerc: [recipe ? recipe.financial.costUnitPerc : 0, []],
				totalMonthlyBilling: [
					recipe ? recipe.financial.totalMonthlyBilling : 0,
					[],
				],
				fixedCostPercentage: [recipe ? recipe.financial.fixedCostPercentage : 0],
				fixedCostCalculationType: [recipe ? recipe.financial.fixedCostCalculationType : 0]
			}),
			label: this._formBuilder.group({
				id: [recipe && recipe.label ? recipe.label.id : null, []],
				allergens: [recipe && recipe.label ? recipe.label.allergens : [], []],
				weight: [recipe && recipe.label ? recipe.label.weight : null, []],
				portion: [recipe && recipe.label ? recipe.label.portion : null, []],
				measure: [recipe && recipe.label ? recipe.label.measure : null, []],
				servingsPerContainers: [
					recipe && recipe.label ? recipe.label.servingsPerContainers : null,
					[],
				],
				gluten: [recipe && recipe.label ? recipe.label.gluten : null, []],
				lactose: [recipe && recipe.label ? recipe.label.lactose : null, []],
				kcal: [
					recipe && recipe.label
						? getLabelValue(recipe.label.kcal, true)
						: true,
					[],
				],
				carbohydrates: [
					recipe && recipe.label
						? getLabelValue(recipe.label.carbohydrates, true)
						: true,
					[],
				],
				fibers: [
					recipe && recipe.label
						? getLabelValue(recipe.label.fibers, true)
						: true,
					[],
				],
				protein: [
					recipe && recipe.label
						? getLabelValue(recipe.label.protein, true)
						: true,
					[],
				],
				totalFat: [
					recipe && recipe.label
						? getLabelValue(recipe.label.totalFat, true)
						: true,
					[],
				],
				saturatedFat: [
					recipe && recipe.label
						? getLabelValue(recipe.label.saturatedFat, true)
						: true,
					[],
				],
				transFat: [
					recipe && recipe.label
						? getLabelValue(recipe.label.transFat, true)
						: true,
					[],
				],
				sodium: [
					recipe && recipe.label
						? getLabelValue(recipe.label.sodium, true)
						: true,
					[],
				],
				cholesterol: [
					recipe && recipe.label
						? recipe.label.cholesterol
						: getDefaultLabelValueBasedOnLanguage(),
					[],
				],
				monounsatured: [
					recipe && recipe.label ? recipe.label.monounsatured : false,
					[],
				],
				polyunsatured: [
					recipe && recipe.label ? recipe.label.polyunsatured : false,
					[],
				],
				calcium: [
					recipe && recipe.label
						? recipe.label.calcium
						: getDefaultLabelValueBasedOnLanguage(),
					[],
				],
				magnesium: [
					recipe && recipe.label ? recipe.label.magnesium : false,
					[],
				],
				manganese: [
					recipe && recipe.label ? recipe.label.manganese : false,
					[],
				],
				phosphorus: [
					recipe && recipe.label ? recipe.label.phosphorus : false,
					[],
				],
				iron: [
					recipe && recipe.label
						? recipe.label.iron
						: getDefaultLabelValueBasedOnLanguage(),
					[],
				],
				potassium: [
					recipe && recipe.label
						? recipe.label.potassium
						: getDefaultLabelValueBasedOnLanguage(),
					[],
				],
				copper: [recipe && recipe.label ? recipe.label.copper : false, []],
				zinc: [recipe && recipe.label ? recipe.label.zinc : false, []],
				retinol: [recipe && recipe.label ? recipe.label.retinol : false, []],
				vitaminARAE: [
					recipe && recipe.label ? recipe.label.vitaminARAE : false,
					[],
				],
				vitaminD: [
					recipe && recipe.label
						? recipe.label.vitaminD
						: getDefaultLabelValueBasedOnLanguage(),
					[],
				],
				thiamine: [recipe && recipe.label ? recipe.label.thiamine : false, []],
				riboflavin: [
					recipe && recipe.label ? recipe.label.riboflavin : false,
					[],
				],
				pyridoxine: [
					recipe && recipe.label ? recipe.label.pyridoxine : false,
					[],
				],
				niacin: [recipe && recipe.label ? recipe.label.niacin : false, []],
				vitaminB6: [
					recipe && recipe.label ? recipe.label.vitaminB6 : false,
					[],
				],
				vitaminB12: [
					recipe && recipe.label ? recipe.label.vitaminB12 : false,
					[],
				],
				vitaminC: [recipe && recipe.label ? recipe.label.vitaminC : false, []],
				lipids: [recipe && recipe.label ? recipe.label.lipids : false, []],
				ingredients: [
					recipe && recipe.label ? recipe.label.ingredients : [],
					[],
				],
				totalSugars: [
					recipe && recipe.label ? recipe.label.totalSugars : true,
					[],
				],
				addedSugars: [
					recipe && recipe.label ? recipe.label.addedSugars : true,
					[],
				],
			}),
		});

		this.formReceita.controls.steps.valueChanges.subscribe((change) => {
			this._route.params.subscribe((params) => {
				const isEditing = !!params["id"];
				if (!isEditing) {
					this.saveFormSubject.next();
				} else {
					if (!this.initializedDate) return;
					const seconds = Math.abs(
						(new Date().getTime() - this.initializedDate.getTime()) / 1000
					);
					if (seconds > 2) {
						this.saveFormSubject.next();
					}
				}
			});
		});

		this.formReceita.controls.financial.valueChanges.subscribe((change) => {
			this.reloadProfitChart(this.formReceita.value, change);
		});

		this.formReceita.controls.ingredients.valueChanges.subscribe((change) => {

			this.onChangeCostValue();
			this.onChangeCostUnitValue();

			this.generateChartData();

			this.generateIngredientsChartData();

			this.calculateSuggestedPrice(false);
		});

		this.formReceita.controls.itens.valueChanges.subscribe((change) => {
			this.onChangeCostValue();
			this.onChangeCostUnitValue();

			this.generateChartData();
		});

		if (!_.isNil(recipe) && recipe.steps.length > 0) {
			recipe.steps.forEach((step) => {
				this.addItem(step.description);
			});
		} else {
			this.addItem();
		}

		this.recipe = recipe;

		this.pdfRecipe = recipe;
		//@ts-ignore
		this.pdfRecipe.type = "recipe";
		this.reportOptions.setItem(this.recipe);
		this.generateChartData();

		this.loadFinancialHistoryData();
	}

	onChangeGeralInfo(formGroupGeral: FormGroup) {
		this.onChangeCostValue();
		this.onChangeCostUnitValue();
		this.generateChartData();
		this.updateRecipeWeight();
		this.updateRecipeYield();
		this.updateVariableCosts();
		this.saveFormSubject.next();
	}

	private updateVariableCosts() {
		if (this.formReceita.value.geral.unityQuantity) {
			const recipeYield = this.formReceita.value.geral.unityQuantity;
			const variableCosts = [
				...this.recipe.variableCosts,
				...this.variableCosts,
			];
			variableCosts.forEach((variableCost: any) => {
				if (recipeYield === Number(variableCost.unitCostUnityQuantityUsed)) {
					variableCost.unitCostUnityQuantityUsed =
						variableCost.unitCostUnityQuantityUsed / recipeYield;
				}
			});
		}
	}

	private updateRecipeYield() {
		if (this.formReceita.value.geral.unityQuantity) {
			this.formReceita.patchValue({
				ingredientsYield: this.formReceita.value.geral.unityQuantity,
			});
		}
	}

	private updateRecipeWeight() {
		if (this.formReceita.value.geral.recipeWeightUnit) {
			// gramas ou kg preenche o campo de peso da receita automaticamente com o rendimento
			const unitId = this.formReceita.value.geral.recipeWeightUnit.id;
			if (unitId === 1) {
				//gramas
				this.formReceita.patchValue({
					label: {
						weight: this.formReceita.value.geral.recipeWeight,
					},
				});
			} else if (unitId === 2) {
				// kg
				this.formReceita.patchValue({
					label: {
						weight: this.formReceita.value.geral.recipeWeight * 1000,
					},
				});
			}
		}
	}

	private generateIngredientsChartData(ingredients?: RecipeIngredient[]) {
		if (!ingredients) {
			ingredients = this.ingredients;
		}

		const data: number[] = [];
		const labels: string[] = [];

		const salePrice = this.getSalePrice();
		const costs =
			this.getTotalOtherCosts() +
			this.getTotalFixedCosts() +
			this.getTotalIngredients();
		const profit = salePrice - costs;

		const getPercent = (amount: number) =>
			salePrice === 0 ? 0 : (amount / salePrice) * 100;

		if (profit > 0) {
			data.push(profit);
			labels.push(`Lucro (${getPercent(profit).toFixed(0)}%)`);
		}

		_.forEach(ingredients, (ri: RecipeIngredient) => {
			const price: number = this.calcIngredientPrice(ri);
			const porcent: number = getPercent(price);
			data.push(price);
			labels.push(ri.ingredient.name + " (" + porcent.toFixed(0) + "%)");
		});

		_.forEach(
			this.recipe.variableCosts,
			(recipeVariableCost: RecipeVariableCost) => {
				const price = this.calc.calcRecipeVariableCostPrice(
					this.typeOfCostSelected,
					recipeVariableCost,
					salePrice
				);
				data.push(price);
				const porcent = getPercent(price);
				labels.push(
					recipeVariableCost.variableCost.name +
					" (" +
					porcent.toFixed(0) +
					"%)"
				);
			}
		);

		_.forEach(this.recipe.fixedCosts, (recipeFixedCost: RecipeFixedCost) => {
			const price = recipeFixedCost.fixedCost.price;
			data.push(price);
			const porcent = getPercent(price);
			labels.push(
				recipeFixedCost.fixedCost.name + " (" + porcent.toFixed(0) + "%)"
			);
		});

		this.chartData = {
			labels: labels,
			data: data,
		};

		try {
			if (ingredients.length == 0) {
				this.chartData = {};
			}
		} catch (e) {
			console.warn(e.message);
		}
	}

	getCMVTooltip() {
		const getPercent = (number: number) =>
			truncate((number * 100) / this.getSalePrice());
		let text = "";
		this.ingredients
			.map((item) => ({
				...item,
				price:
					this.typeOfCostSelected === TypeOfCostSelected.TOTAL
						? this.calc.calcIngredientPrice(item)
						: this.calc.calcIngredientPrice(item) / this.getRendimento(),
			}))
			.sort((a, b) => b.price - a.price)
			.forEach((ingredient) => {
				text += `${ingredient.ingredient.name} ${this.currencyPipe.transform(
					ingredient.price,
					this.cifrao
				)} (${getPercent(ingredient.price)}%)\n`;
			});
		return text;
	}

	getVariableCostsTooltip() {
		const getPercent = (number: number) =>
			truncate((number * 100) / this.getSalePrice());
		const getPrice = (recipeVariableCost) =>
			this.calc.calcRecipeVariableCostPrice(
				this.typeOfCostSelected,
				recipeVariableCost,
				this.getSalePrice()
			);
		let text = "";

		this.recipe.variableCosts
			.filter((item) =>
				isRecipeVariableCostActive(item, this.typeOfCostSelected)
			)
			.map((item) => ({
				...item,
				price: getPrice(item),
			}))
			.sort((a, b) => b.price - a.price)
			.forEach((recipeVariableCost) => {
				text += `${recipeVariableCost.variableCost.name
					} ${this.currencyPipe.transform(
						recipeVariableCost.price,
						this.cifrao
					)} (${getPercent(recipeVariableCost.price)}%)\n`;
			});
		return text;
	}

	getFixedCostsTooltip() {
		const getPercent = (number: number) =>
			truncate((number * 100) / this.getTotalFixedCosts());

		let text = "";

		this.recipe.fixedCosts
			.map((item) => {
				const proportionalPrice =
					this.getFixedCostsBasedOnSalePrice() *
					(getPercent(item.fixedCost.price) / 100);
				return {
					...item,
					percent: truncate((proportionalPrice * 100) / this.getSalePrice()),
					proportionalPrice,
				};
			})
			.sort((a, b) => b.percent - a.percent)
			.forEach((item) => {
				text += `${item.fixedCost.name} ${this.currencyPipe.transform(
					item.proportionalPrice,
					this.cifrao
				)} (${item.percent}%)\n`;
			});

		return text;
	}

	private generateChartData(ingredients?: RecipeIngredient[]) {
		if (!ingredients) {
			ingredients = this.ingredients;
		}

		const salePrice = this.getSalePrice();
		const profit = this.calcProfit();

		const getPercent = (value) =>
			salePrice === 0 ? 0 : Number((value / salePrice) * 100).toFixed(2);

		this.financialAnalysisChartData = {
			labels: [
				`CMV (${getPercent(this.getCMV())}%)`,
				`Custos var. (${getPercent(this.getTotalOtherCosts())}%)`,
				`Custos fixos (${getPercent(this.getFixedCostsBasedOnSalePrice())}%)`,
			],
			data: [
				this.getCMV(),
				this.getTotalOtherCosts(),
				this.getFixedCostsBasedOnSalePrice(),
			],
		};

		if (profit > 0) {
			this.financialAnalysisChartData.labels.push(
				`Lucro (${getPercent(profit)}%)`
			);
			this.financialAnalysisChartData.data.push(profit);
		}

		try {
			if (ingredients.length == 0 && (!this.itens || this.itens.length == 0)) {
				this.financialAnalysisChartData = {};
			}
		} catch (e) {
			console.warn(e.message);
		}
	}

	private fetchCategories() {
		this._service.getCategoriesByUserLanguage(this.linguagem).subscribe(
			(apiResponse: ApiResponse) => {
				const categories: RecipeCategory[] = apiResponse.data;
				const usedCategories = categories.filter((c) => c.quantityUsed > 0);
				if (usedCategories.length > 0) {
					this.categories = _.orderBy(categories, "quantityUsed", ["desc"]);
				} else {
					this.categories = categories;
				}
			},
			(apiResponse: ApiResponse) => { }
		);
	}

	get getUnit() {
		return this.incomeUnits.find(
			(unit) => unit.id === this.formReceita.value.geral.unit.id
		).name;
	}

	private async fetchUnits() {
		this._unitService.getReduced().subscribe(
			(apiResponse: ApiResponse) => {
				this.units = apiResponse.data;
				this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
				this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
				this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
				this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
				this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
				this.units[5].name = "INGREDIENT.UNIDADE.TXT6";
				this.units[6].name = "INGREDIENT.UNIDADE.TXT7";

				this.incomeUnits = [
					this.units[6],
					this.units[4],
					this.units[5],
					this.units[3],
					this.units[2],
				];
				this.recipeWeightUnits = [this.units[0], this.units[1]];

				try {
					const form = this.formReceita.value;

					if (_.isNil(form.geral.unit)) {
						this.formReceita.patchValue({
							geral: {
								unit: this.units[6],
							},
						});
					}

					if (_.isNil(form.geral.recipeWeightUnit)) {
						this.formReceita.patchValue({
							geral: {
								recipeWeightUnit: this.units[0],
							},
						});
					}
				} catch (e) {
					console.warn(e.message);
				}

				this.fetchUnitsAbbreviated();
			},
			(apiResponse: ApiResponse) => {
				console.log(apiResponse);
			}
		);
	}

	private fetchUnitsAbbreviated() {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				this.units.forEach(
					(x, i) => (x.abbreviation = apiResponse.data[i].name)
				);
			},
			(apiResponse: ApiResponse) => { }
		);
	}

	private inputToFocus: any;

	@ViewChildren("inputToFocus") set inputF(inputF: any) {
		this.inputToFocus = inputF;

		try {
			if (!this.inputToFocus.last.nativeElement.value) {
				this.inputToFocus.last.nativeElement.focus();
			}
		} catch (e) { }
	}

	pdfRecipe: Recipe;

	get isBeta(): boolean {
		if (this.user.perfis.includes(PerfilEnum.USER_BETA)) {
			return true;
		}
		return false;
	}

	async gerarPdf() {
		const { data: count } = await this.pdfService.count().toPromise();

		if (count > 0) {
			if (!this.planService.hasPermission(RolePermission.PDF_CREATION)) {
				return;
			}
		}

		this.pdfRecipe = this.formReceita.value;
		this.pdfRecipe.name =
			this.formReceita.value.geral.name || this.recipeDefaultName;
		this.pdfRecipe.description = this.formReceita.value.geral.description;
		this.pdfRecipe.photoUrl = this.formReceita.value.geral.photoUrl;
		this.pdfRecipe.portionName = this.formReceita.value.geral.portionName;
		this.pdfRecipe.portionWeight = this.formReceita.value.geral.portionWeight;
		this.pdfRecipe.totalWeight = this.formReceita.value.geral.totalWeight;
		this.pdfRecipe.portions = this.formReceita.value.geral.portions;
		this.pdfRecipe.preparationTime =
			this.formReceita.value.geral.preparationTime;
		this.pdfRecipe.recipeCategory = this.formReceita.value.geral.recipeCategory;

		this.pdfRecipe.unityQuantity = this.formReceita.value.geral.unityQuantity;
		this.pdfRecipe.unit = this.formReceita.value.geral.unit;
		this.pdfRecipe.recipeWeight = this.formReceita.value.geral.recipeWeight;
		this.pdfRecipe.recipeWeightUnit =
			this.formReceita.value.geral.recipeWeightUnit;
		this.pdfRecipe.variableCosts = this.recipe.variableCosts;
		this.pdfRecipe.fixedCosts = this.recipe.fixedCosts;

		//@ts-ignore
		this.pdfRecipe.type = "recipe";

		const modal = this.pdfService.openConfig();

		modal.beforeClosed().subscribe(() => this._loading.show());

		modal.afterClosed().subscribe(async (response: any) => {
			if (response == PdfService.PDF_GENERATE) {
				let recipeName = this.recipe.name || this.recipeDefaultName;

				await new Promise((r) => setTimeout(r, 1000));

				this.pdf.save("recipemaster - Receita " + recipeName + ".pdf");

				this._loading.hide();
			}
		});
	}

	confirmPdf() {
		this.reportOptions.setDisplay(this.selectedRecipe);
		this.pdfOld.refresh(this.reportOptions);
		this.pdfOld.save("recipemaster - Receita " + this.recipe.name + ".pdf");
		this.showDialogRecipe = false;
	}

	toggleIngredientDraggable() {
		this.ingredientDraggable = !this.ingredientDraggable;
	}

	async toggleHomeMeasureUnit() {
		this.userService.toggleHomeMeasureUnit(this.user.id).toPromise();
		this.showHomeMeasureUnit = !this.showHomeMeasureUnit;
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
			recipeTutorial: DialogRecipeComponent,
			recipeIngredient: DialogRecipeIngredientAddComponent,
			recipeIngredientMultiplier: DialogRecipeIngredientMultiplierComponent,
			recipeFinancial: DialogRecipeFinancialTotalCostComponent
		}

		const dialogComponent = optionsDialog[type];
		this._dialogIngredientInfo.open(dialogComponent, dialogConfig);
	}
}

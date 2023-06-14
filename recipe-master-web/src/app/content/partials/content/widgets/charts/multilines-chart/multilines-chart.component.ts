import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { TranslateService }                                from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, ChartType }          from 'chart.js';
import { Color, BaseChartDirective }                       from 'ng2-charts';
import { FinancialChartData } from '../../../../../pages/business/recipe/recipe/recipe.component';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../../../core/models/user';
@Component({
	selector: 'm-multilines-chart',
	templateUrl: './multilines-chart.component.html',
	styleUrls: ['./multilines-chart.component.scss']
})
export class MultilinesChartComponent implements OnInit, OnChanges {

	@Input() labels: string[] = [];
	@Input() profitsData: number[] = [];
	@Input() expensesData: number[] = [];

	@ViewChild('canvas') canvas: ElementRef;
	@ViewChild(BaseChartDirective) chart: BaseChartDirective;

	public titlePage: string;

	public lineChartType: ChartType = 'line';
	public lineChartColors: Color[] = [];
	public lineChartData: ChartDataSets[] = [];
	public lineChartLabels: string[] = [];
	public lineChartOptions: (ChartOptions & { annotation: any });

	private _currentUser: User;
	private cifrao : String;

	constructor(
		private translate: TranslateService,
		private _localStorage: CpLocalStorageService,) {

			this.fillUser();
		}

	update(data: FinancialChartData) {

		let auxLucro: string;
		let auxCusto: string;
		this.translate.get('RECIPE.CHAR_TXT5').subscribe(data => auxCusto = data);
		this.translate.get('RECIPE.CHAR_TXT6').subscribe(data => auxLucro = data);

		this.lineChartLabels = [];
		this.lineChartData = [];

		this.lineChartLabels.length = 0;
		this.lineChartData.length = 0;

		this.labels = data.labels;
		this.expensesData = data.expenses;
		this.profitsData = data.profits;

		this.lineChartLabels = data.labels;
		this.lineChartData = [
			{ data: data.profits, label: auxLucro },
			{ data: data.expenses, label: auxCusto },
		];

		this.chart.chart.config.data.labels = this.lineChartLabels;
		this.chart.chart.config.data.datasets = this.lineChartData;

		this.chart.chart.update();
	}

	ngOnChanges(){
		
	}

	ngOnInit() {

		let auxLucro: string;
		let auxCusto: string;

		this.translate.get('RECIPE.CHAR_TXT3').subscribe(data => this.titlePage = data);
		this.translate.get('RECIPE.CHAR_TXT5').subscribe(data => auxCusto = data);
		this.translate.get('RECIPE.CHAR_TXT6').subscribe(data => auxLucro = data);

		this.lineChartLabels = this.labels;
		this.lineChartData = [
			{ data: this.profitsData, label: auxLucro },
			{ data: this.expensesData, label: auxCusto },
		];

		this.setLineChartColors();
	}

	fillUser() {
		this._currentUser = this._localStorage.getLoggedUser();
		if (this._currentUser) {
			this.cifrao = this._localStorage.getCurrency();
    	}

		if(typeof(this.cifrao) !== typeof(undefined) && typeof(this.cifrao) !== typeof(null)){
			this.lineChartOptions = this.returnConst();
		}
	}

	returnConst(): (ChartOptions & { annotation: any }){

		var lineChartOptionsDefault: (ChartOptions & { annotation: any }) = {
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						maxTicksLimit: 5,
						fontSize: 10,
						fontColor: '#A3A3A3'
					}
				}],
				xAxes: [{
					ticks: {
						fontSize: 10,
						fontColor: '#A3A3A3'
					}
				}]
			},
			tooltips: {
				mode: 'nearest',
				intersect: false,
				custom: function(tooltipModel) {
		
					if (tooltipModel.dataPoints) {
						const { datasetIndex } = tooltipModel.dataPoints[0];
						if (datasetIndex === 0) {
							tooltipModel.backgroundColor = '#34BFA3';
						} if (datasetIndex === 1) {
							tooltipModel.backgroundColor = '#FD305C';
						}
					}
		
				},
				callbacks: {
					title: (tooltipItem, data) => {
						return '';
					},
					label: (tooltipItem, data) => {
						const dataset = data.datasets[tooltipItem.datasetIndex];
                        const currentValue = dataset.data[tooltipItem.index]
						const { datasetIndex } = tooltipItem;
						const { label } = data.datasets[datasetIndex];
						const cifrao = this._localStorage.getCurrency();
						
						return `${label} ${cifrao} ${currentValue.toFixed(2)}`;
					},
					labelColor: (tooltipItem, chart) => {
						return {
							borderColor: '#FD305C',
							backgroundColor: '#FD305C'
						};
					}
				},
				// backgroundColor: '#FD305C',
				titleFontSize: 12,
				titleFontColor: '#ffffff',
				bodyFontColor: '#ffffff',
				bodyFontSize: 12,
				displayColors: false,
				yPadding: 4,
				xPadding: 10,
				cornerRadius: 10
			}
		};

		return lineChartOptionsDefault;
	}

	setLineChartColors() {
		const gradientExpense = this.canvas.nativeElement.getContext('2d').createLinearGradient(51, 0, 0, 294);
		gradientExpense.addColorStop(0, 'rgba(251, 138, 101, 0.5)'); // top
		gradientExpense.addColorStop(1, 'rgba(250, 78, 109, 0.5)'); // bottom

		const gradientProfit = this.canvas.nativeElement.getContext('2d').createLinearGradient(51, 0, 0, 294);
		gradientProfit.addColorStop(0, 'rgba(17, 153, 142, 0.65)'); // top
		gradientProfit.addColorStop(1, 'rgba(56, 239, 125, 0.65)'); // bottom

		this.lineChartColors = [
			{ // Lucro
				backgroundColor: gradientProfit
			},
			{ // Custo
				backgroundColor: gradientExpense,
			},
		];
	}

}

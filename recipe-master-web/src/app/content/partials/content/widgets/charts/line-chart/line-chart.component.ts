import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective, Color }                                           from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { IngredientCategory } from '../../../../../../core/models/business/ingredientcategory';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Ingredient } from '../../../../../../core/models/business/ingredient';
import { IngredientHistoryDTO } from '../../../../../../core/models/business/dto/ingredient-history-dto';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../../../core/models/user';
import { IngredientService } from '../../../../../../core/services/business/ingredient.service';

export const StopColorsDefault:any = { start: `rgba(142, 158, 171, 0.7)`, stop: `rgba(238, 242, 243, 0.7)`};

export const StopColors = {
	100: (opacity:number = 0.7) => { return {start: `rgba(238, 156, 167, ${opacity})`, stop: `rgba(255, 221, 225, ${opacity})`}; },
	101: (opacity:number = 0.7) => { return {start: `rgba(0, 180, 219, ${opacity})`, stop: `rgba(0, 131, 176, ${opacity})`}; },
	102: (opacity:number = 0.7) => { return {start: `rgba(237, 33, 58, ${opacity})`, stop: `rgba(147, 41, 30, ${opacity})`}; },
	103: (opacity:number = 0.7) => { return {start: `rgba(167, 55, 55, ${opacity})`, stop: `rgba(122, 40, 40, ${opacity})`}; },
	104: (opacity:number = 0.7) => { return {start: `rgba(191, 16, 16, ${opacity})`, stop: `rgba(87, 6, 6, ${opacity})`}; },
	105: (opacity:number = 0.7) => { return {start: `rgba(148, 0, 211, ${opacity})`, stop: `rgba(75, 0, 130, ${opacity})`}; },
	106: (opacity:number = 0.7) => { return {start: `rgba(183, 152, 145, ${opacity})`, stop: `rgba(148, 113, 107, ${opacity})`}; },
	107: (opacity:number = 0.7) => { return {start: `rgba(0, 61, 77, ${opacity})`, stop: `rgba(15, 167, 128, ${opacity})`}; },
	108: (opacity:number = 0.7) => { return {start: `rgba(142, 158, 171, ${opacity})`, stop: `rgba(238, 242, 243, ${opacity})`}; },
	109: (opacity:number = 0.7) => { return {start: `rgba(242, 153, 74, ${opacity})`, stop: `rgba(242, 201, 76, ${opacity})`}; },
	110: (opacity:number = 0.7) => { return {start: `rgba(242, 112, 156, ${opacity})`, stop: `rgba(255, 148, 114, ${opacity})`}; },
	111: (opacity:number = 0.7) => { return {start: `rgba(96, 56, 19, ${opacity})`, stop: `rgba(178, 159, 148, ${opacity})`}; },
	112: (opacity:number = 0.7) => { return {start: `rgba(255, 224, 0, ${opacity})`, stop: `rgba(121, 159, 12, ${opacity})`}; },
	113: (opacity:number = 0.7) => { return {start: `rgba(9, 30, 58, ${opacity})`, stop: `rgba(47, 128, 237, ${opacity})`}; },
	114: (opacity:number = 0.7) => { return {start: `rgba(230, 92, 0, ${opacity})`, stop: `rgba(249, 212, 35, ${opacity})`}; },
	115: (opacity:number = 0.7) => { return {start: `rgba(12, 115, 87, ${opacity})`, stop: `rgba(91, 40, 3, ${opacity})`}; },
	116: (opacity:number = 0.7) => { return {start: `rgba(234, 205, 163, ${opacity})`, stop: `rgba(214, 174, 123, ${opacity})`}; },
	117: (opacity:number = 0.7) => { return {start: `rgba(17, 153, 142, ${opacity})`, stop: `rgba(56, 239, 125, ${opacity})`}; }
};
@Component({
	selector: 'm-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {

	@ViewChild('canvas') canvas: ElementRef;
	@ViewChild(BaseChartDirective) chart: BaseChartDirective;

	@Input() priceHistory:IngredientHistoryDTO[];
	@Input() category: IngredientCategory;
	@Input() opacity:number = 0.7;
	@Input() ingredient:Ingredient;

	public lineChartOptions: (ChartOptions & { annotation: any });
	public lineChartType: string = 'line';
	public lineChartColors: Color[] = [];
	public lineChartLabels: string[] = [];
	public lineChartData: ChartDataSets[] = [];

	_currentUser: User;
	cifrao: string;

	constructor(
		private _localStorage: CpLocalStorageService,
		private _ingredientService: IngredientService,) {

		this.fillUser();
	}

	ngOnChanges(changes:SimpleChanges) {
		if(changes.priceHistory){
			this.update();
		}
	}

	ngOnInit() {

		const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(150, 0, 150, 200);

		let colors;
		if (!this.category) {
			colors = StopColorsDefault;
		} else {
			colors = StopColors[this.category.id]?StopColors[this.category.id](this.opacity):StopColorsDefault;
		}

		gradient.addColorStop(1, colors.start);
		gradient.addColorStop(0, colors.stop);

		this.lineChartColors = [{
			backgroundColor: gradient
		}];

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

	update(){
		let chartData:ChartDataSets[] = [];
		let chartLabels:string[] = [];

		_.each(this.priceHistory, (h:IngredientHistoryDTO) => {
			chartLabels.push(moment(h.inclusion).format("DD/MM"));
			chartData.push(h.price);
		});

		this.lineChartData = chartData;
		this.lineChartLabels = chartLabels;

		this.chart.data = this.lineChartData;
		this.chart.labels = this.lineChartLabels;
		this.chart.chart.update();
	}

	returnConst(): (ChartOptions & { annotation: any }) {

		var LineChartOptionsDefault: (ChartOptions & { annotation: any }) = {
			responsive: true,
			maintainAspectRatio: false,
			defaultFontSize: 4,
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
				callbacks: {
					label: (tooltipItem, data) => {
						const dataset = data.datasets[tooltipItem.datasetIndex];
						const currentValue = dataset.data[tooltipItem.index];
						const cifrao = this._localStorage.getCurrency();
						return `${cifrao} ${currentValue.toFixed(2)}`;
					},
					labelColor: (tooltipItem, chart) => {
						return {
							borderColor: '#FD305C',
							backgroundColor: '#FD305C'
						};
					}
				},
				bodyFontColor: '#ffffff',
				bodyFontSize: 12,
				displayColors: false,
				yPadding: 4,
				xPadding: 10,
				cornerRadius: 10
			}
		};

		return LineChartOptionsDefault;
	}
}

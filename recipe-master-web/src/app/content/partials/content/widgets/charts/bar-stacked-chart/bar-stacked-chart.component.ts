import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import { BaseChartDirective, Color } from 'ng2-charts';

import { UserService } from '../../../../../../core/auth/user.service';
import { UserDTO } from '../../../../../../core/models/security/dto/user-dto';
import { User } from '../../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';

declare interface ChartDataSet {
	label:string;
	data:number[];
	xAxisID:string;
	backgroundColor:string;
};

@Component({
	selector: 'm-bar-stacked-chart',
	templateUrl: './bar-stacked-chart.component.html',
	styleUrls: ['./bar-stacked-chart.component.scss'],
})
export class BarStackedChartComponent implements OnInit, AfterViewInit {
	@Input() labels: any[] = [
		'Receita 1;Curva A', 'Receita 2;Curva A', 'Receita 3;Curva A', 'Receita 4;Curva B', 'Receita 5;Curva B',
		'Receita 6;Curva B', 'Receita 7;Curva B', 'Receita 8;Curva B', 'Receita 9;Curva B', 'Receita 10;Curva B',
		'Receita 11;Curva C', 'Receita 12;Curva C', 'Receita 13;Curva C', 'Receita 14;Curva C', 'Receita 15;Curva C',
	];
    @Input() data: ChartDataSet[] = [
	    { label: 'CMV', data: [500, 500, 480, 460, 440, 420, 400, 380, 360, 340, 320, 300, 280, 260, 240], backgroundColor: '#D6E9C6', xAxisID: 'xAxis1' },
	    { label: 'Outros custos', data: [100, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 40, 35, 30], backgroundColor: '#FAEBCC', xAxisID: 'xAxis1' },
	    { label: 'Impostos', data: [100, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 40, 35, 30], backgroundColor: '#EBCCD1', xAxisID: 'xAxis1' },
	    { label: 'Lucro liquido', data: [300, 280, 260, 240, 220, 200, 190, 180, 160, 140, 130, 120, 100, 90, 80], backgroundColor: '#EBCCD1', xAxisID: 'xAxis1' },
    ];
	@Input() title: string = 'RECIPE.CHAR_TXT1';
	@ViewChild(BaseChartDirective)

	public baseChart: BaseChartDirective;
    public chartType: string = 'bar';
	public txt1Grafs: string = 'RECIPE.CHAR_TXT2';
	public cifrao: string = 'R$';
	public options: any;
	public colors: Color[] = [
		{ backgroundColor: '#FD305C' }, { backgroundColor: '#FF7D53' }, { backgroundColor: '#020D21' },
		{ backgroundColor: '#34BFA3' }, { backgroundColor: '#AEB1B8' }
	];

	private _currentUser: User;
	private user: UserDTO;
	private lastLabel: string;

	constructor (
		private _userService: UserService,
        private _cpLocalStorageService: CpLocalStorageService,
        private _cp: CurrencyPipe
	) {
		this.fillUser();
	 }

	ngOnInit () { }

	private getTooltipLegendInfo(text: string, id: string) {
		const html = `
			<i  class="far fa-question-circle"
				title="{{text}}"
				id="{{id}}"
				[ngbPopover]="popContent"
				placement="bottom"
				triggers="mouseenter click"
				[autoClose]="true">
			</i>
		`;
		return html.replace('{{text}}', text).replace('{{id}}', id)
	}

	private injectLegendHtml() {
		let legend = this.baseChart.chart.generateLegend();

		const cmv = this.getTooltipLegendInfo('Custo dos ingredientes', 'cmvTooltip');
		const custosDiretos = this.getTooltipLegendInfo('Outros custos da receita', 'custosDiretos');
		const custosIndiretos = this.getTooltipLegendInfo('Outros custos do cardápio', 'custosIndiretos');

		legend = legend.replace('CMV', `CMV ${cmv}`)
		legend = legend.replace('Custos diretos', `Custos diretos ${custosDiretos}`)
		legend = legend.replace('Custos indiretos', `Custos indiretos ${custosIndiretos}`)

		document.getElementById('bar-legend').innerHTML = legend;
	}

	ngAfterViewInit() {
		this.injectLegendHtml();
	}

	fillUser() {
        this._currentUser = this._cpLocalStorageService.getLoggedUser();

		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
					this.user = res.data;
					this.cifrao = this.user.currency || 'R$';
				}, err => {});
        }

        this.options = {
	        layout: {
		        padding: {
			        left: 0,
			        right: 0,
			        top: 0,
			        bottom: 0
		        }
	        },
            legend: {
	        	display: false
            },
            responsive: true,
            maintainAspectRatio: false,
	        scales: {
		        xAxes: [
			        {
				        stacked: true,
				        id: 'xAxis1',
				        type: 'category',
				        gridLines: {
					        drawOnChartArea: false,
				        },
				        ticks: {
					        callback: function(label) {
						        let month = label.split(';')[0];
						        let year = label.split(';')[1];
						        return month;
					        }
				        }
			        },
			        {
				        stacked: true,
				        position: 'top',
				        id: 'xAxis2',
				        type: 'category',
				        gridLines: {
					        drawOnChartArea: true,
				        },
				        ticks: {
					        padding: 0,
					        maxRotation: 0,
					        autoSkip: false,
					        callback: (value) => {
						        const month = value.split(';')[0];
						        const year = value.split(';')[1];
						        if (this.lastLabel !== year) {
							        this.lastLabel = year;
							        return year;
						        } else {
							        return undefined;
						        }
					        }
				        }
			        }],
		        yAxes: [{
			        stacked: true,
			        ticks: {
				        beginAtZero: true
			        }
		        }]
	        },
            tooltips: {
                callbacks: {
										title: (tooltipItem, data) => {
											const dataset = data.datasets[tooltipItem[0].datasetIndex];
											return dataset.label
										},
                    label: (tooltipItem, data) => {
                        const dataset = data.datasets[tooltipItem.datasetIndex];

												let total = 0;

												data.datasets.forEach(ds => {
													const value = ds.data[tooltipItem.index] > 0 ? ds.data[tooltipItem.index] : ds.data[tooltipItem.index]*-1
													total += value;
												})

                        let currentValue = dataset.data[tooltipItem.index];
												if (currentValue < 0) {
													currentValue = currentValue * -1
												}

												const percentOponTotal = (currentValue * 100) / total;

                        const cifrao = this._currentUser && this._currentUser.currency ? this._currentUser.currency : 'R$';
                        const valor = this._cp.transform(currentValue.toFixed(2), cifrao, true, '1.2-2', 'pt-BR');
                        return `${valor} (${percentOponTotal.toFixed(2)}%)`;
                    },
                }
            }
        };
	}

	ngOnChanges(theChanges) {
		if (this.baseChart.chart) {
			setTimeout( () => {
				this.baseChart.ngOnChanges(theChanges.labels);
				this.baseChart.chart.update();
				this.injectLegendHtml();
			}, 100);
		}
	}

}

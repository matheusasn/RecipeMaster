import { Component, OnInit, Input, ViewChild, HostListener, AfterViewInit, SimpleChanges } from '@angular/core';
import { CurrencyPipe }              from '@angular/common';
import { BaseChartDirective, Color } from 'ng2-charts';

import { User }                          from '../../../../../../core/models/user';
import { UserDTO }                       from '../../../../../../core/models/security/dto/user-dto';
import { UserService }                   from '../../../../../../core/auth/user.service';
import { CpLocalStorageService }         from '../../../../../../core/services/common/cp-localstorage.service';
import { StopColors, StopColorsDefault } from '../line-chart/line-chart.component';

@Component({
	selector: 'm-doughnut-chart',
	templateUrl: './doughnut-chart.component.html',
	styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit, AfterViewInit {
	@Input() identifier: string;
	@Input() labels: string[] = [];
	@Input() data: number[] = [];
	@Input() titleGrafs: string = 'RECIPE.CHAR_TXT1';
	@ViewChild(BaseChartDirective)
	public baseChart: BaseChartDirective;
	public doughnutChartType: string = 'doughnut';
	public txt1Grafs: string = 'RECIPE.CHAR_TXT2';
	public cifrao: string;
	public options: any;
	public colors: Color[] = [
		{
			backgroundColor: [
				'#FD305C',
				'#FD6485',
				'#FE97AD',
				'#FFCBD6',

				'#FF7D53',
				'#FF9E7E',
				'#FFBEA9',
				'#FFDFD4',

				'#34BFA3',
				'#67CFBA',
				'#99DFD1',
				'#CCEFE8',

				'#716ACA',
				'#948FD7',
				'#B8B4E4',
				'#DBDAF2',

				'#0F1924',
				'#4B5262',
				'#AEB1B8',
				'#E4E5E7',
			]
		}
	];

	private _currentUser: User;
	private user: UserDTO;

	constructor (
		private _userService: UserService,
        private _cpLocalStorageService: CpLocalStorageService,
        private _cp: CurrencyPipe
	) {
		this.fillUser();
	 }

	ngOnInit () { }

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		const { innerWidth } = event.target;
		this.updateChartResponsive(innerWidth);
	}

	ngAfterViewInit() {
		document.getElementById(this.identifier).innerHTML = this.baseChart.chart.generateLegend();
	}

	updateChartResponsive(width: number) {
		if (width <= 768 && this.baseChart.options.legend.position === 'right') {
			this.baseChart.options.legend.position = 'bottom';
			this.baseChart.ngOnChanges(this.baseChart.options);
			this.baseChart.chart.update();
		} else if (width > 768 && this.baseChart.options.legend.position === 'bottom') {
			this.baseChart.options.legend.position = 'right';
			this.baseChart.ngOnChanges(this.baseChart.options);
			this.baseChart.chart.update();
		}
	}

	fillUser() {
        this._currentUser = this._cpLocalStorageService.getLoggedUser();

		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
					this.user = res.data;
					this.cifrao = this.user.currency;
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
	            // position: window.innerWidth > 768 ? 'right' : 'bottom',
	            // align: 'left',
				// labels: { padding: 12 }
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                intersect: false,
                callbacks: {
                    label: (tooltipItem, data) => {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const currentValue = dataset.data[tooltipItem.index];
                        const cifrao = this._cpLocalStorageService.getCurrency();
                        const valor = `${cifrao} ${currentValue.toFixed(2)}`;
                        return valor;
                    },
                    title: function(tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            }
        };
	}

	ngOnChanges(theChanges) {
		if (this.baseChart.chart) {
			setTimeout( () => {
				this.baseChart.chart.config.data.labels = this.labels;
				this.baseChart.chart.update();
				document.getElementById(this.identifier).innerHTML = this.baseChart.chart.generateLegend();
			}, 100);
		}
	}

	// events
	chartClicked (e: any): void {
	}

	chartHovered (e: any): void {
	}

}

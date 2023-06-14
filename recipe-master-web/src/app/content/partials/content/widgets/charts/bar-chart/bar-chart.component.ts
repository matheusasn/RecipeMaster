import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Color } from 'ng2-charts';

@Component({
	selector: 'm-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

	@Input() title: string = "";
	@Input() barChartLabels: string[] = [];
	@Input() barChartData: any[] = [];

	@ViewChild(BaseChartDirective)
	public baseChart: BaseChartDirective;

	public barChartOptions: any = {
		scaleShowVerticalLines: true,
		responsive: true,
    scales: {
      xAxes: [{
        ticks: {
					fontSize: 12,
        }
      }],
			yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    maintainAspectRatio: true
	};

	public barChartType: string = 'bar';
	public barChartLegend: boolean = false;
	public colors: Color[] = [
		{ backgroundColor: '#4B5262' }
	];

	constructor () { }

	ngOnInit () {
	}

	// events
	chartClicked (e: any): void {
	}

	chartHovered (e: any): void {
	}

	ngOnChanges(theChanges) {
		if (this.baseChart.chart) {
			setTimeout( () => {
				this.baseChart.chart.config.data.labels = this.barChartLabels;
				this.baseChart.chart.update();
			}, 100);
		}
	}

}

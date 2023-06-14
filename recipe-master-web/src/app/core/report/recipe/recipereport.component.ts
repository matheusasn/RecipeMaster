import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {PDFExportComponent} from '@progress/kendo-angular-pdf-export';
import {RecipeReportOptions} from './recipereportoptions';
import {defineFont} from '@progress/kendo-drawing/pdf';
import {RecipeIngredient} from '../../models/business/recipeingredient';
import * as _ from 'lodash';
import {CommonCalcService} from '../../services/business/common-calc.service';
import {BaseChartDirective} from 'ng2-charts';
import localeBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { CARD_TYPE } from '../../models/common/card-type';
import { UserDTO } from '../../models/security/dto/user-dto';
import { User } from '../../models/user';
import { UserService } from '../../auth/user.service';
import { CpLocalStorageService } from '../../services/common/cp-localstorage.service';
registerLocaleData(localeBr, 'pt');
import { APP_CONFIG } from '../../../config/app.config';
import { PACKAGE } from '../../constants/endpoints';
import { MenuIngredient } from '../../models/business/menuingredient';

@Component({
	selector: 'recipe-report',
	templateUrl: './recipereport.component.html',
	styleUrls: ['./recipereport.component.scss']
})
export class RecipeReportComponent implements OnInit {
	@ViewChild('pdf') pdf: PDFExportComponent;
	recipeReportOptions: RecipeReportOptions;
	columnSize: number;
	colors = ['#FFCAA8', '#FFB37B', '#FC986E', '#FC8654',
		'#FA7472', '#F55A57', '#FF4A62', '#F24159',
		'#CA3649'];

	angles = [];
	series: any[] = [{data: []}];
	tableGraph: any[][];
	public doughnutChartType: string = 'doughnut';
	options: any = {
		legend: {
			position: 'bottom'
		},
		responsive: true,
		maintainAspectRatio: false
	};
	@ViewChild(BaseChartDirective)
	public baseChart: BaseChartDirective;
	@Input('ReportOptions')
	set reportOptions(value: RecipeReportOptions) {
		if (value) {
			this.refresh(value);
		}
	}
	@Input() type:CARD_TYPE = CARD_TYPE.RECEITA;
	cifrao: String = 'R$';
	user: UserDTO;
	private _currentUser: User;
	photoUrl:string = '/assets/app/media/img/products/product1.jpg';


	constructor(
		private calc: CommonCalcService,
		private _userService: UserService,
		private _cpLocalStorageService: CpLocalStorageService
	) {
		this.columnSize = 4;
		this.recipeReportOptions = new RecipeReportOptions();
		this.generateSeries();
		this.fillUser();
	}

	fillUser() {
		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
					this.user = res.data;
					this.cifrao = this.user.currency || 'RS';
				}, err => {
				});
		}
	}

	ngOnInit(): void {
	}

	save(filename: string) {
		this.pdf.saveAs(filename);
	}

	getColumnSize(offset: number): number {
		return Math.trunc(100 / this.columnSize) * offset;
	}

	drawChart() {
		const canvas: HTMLCanvasElement = (<HTMLCanvasElement>document.getElementById('canvas'));
		if (canvas) {
			const ctx = canvas.getContext('2d');

			// Base offset distance of 10
			const offset = 0;
			let beginAngle = 0;
			let endAngle = 0;

			// Used to calculate the X and Y offset
			let offsetX, offsetY, medianAngle;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fill();

			for (let i = 0; i < this.angles.length; i = i + 1) {
				beginAngle = endAngle;
				endAngle = endAngle + this.angles[i];

				// The medium angle is the average of two consecutive angles
				medianAngle = (endAngle + beginAngle) / 2;

				// X and Y calculations
				offsetX = Math.cos(medianAngle) * offset;
				offsetY = Math.sin(medianAngle) * offset;

				ctx.beginPath();
				ctx.fillStyle = this.series[0].data[i].color;

				// Adding the offsetX and offsetY to the center of the arc
				ctx.moveTo(140 + offsetX, 140 + offsetY);
				ctx.arc(140 + offsetX, 140 + offsetY, 140, beginAngle, endAngle);
				ctx.lineTo(140 + offsetX, 140 + offsetY);
				ctx.fill();
			}

			if (this.angles.length > 0) {
				ctx.beginPath();
				ctx.fillStyle = '#FFFFFF';
				ctx.arc(140, 140, 70, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}

	getFormatValue(value: number, style: string, digits: number = 2): string {
		let aux: number = value;

		if (!value) {
			aux = 0;
		}

		return Number(aux).toLocaleString('pt-br',
			{style: style, currency: 'BRL', maximumFractionDigits: digits, minimumFractionDigits: digits});
	}

	generateSeries() {
		this.series = [{data: []}];
		this.tableGraph = [];
		this.angles = [];

		if (this.recipeReportOptions.recipe && this.recipeReportOptions.recipe.ingredients) {

            let ingredients: any[] = this.recipeReportOptions.recipe.ingredients;

			const total = ingredients.length;

            let totalValue:number = this.getTotalIngredients(ingredients);
            let auxTableLine = [];

            _.forEach(ingredients, (ri:RecipeIngredient, i:number) => {
                let price:number = this.calcIngredientPrice(ri);
                let porcent:number = (price/totalValue)*100;

                const auxData:any = {
					category: ri.ingredient.name,
					value: price,
					color: this.colors[Math.round(this.colors.length / total) * i],
					percent: porcent.toFixed(2)
                };

                this.angles.push(Math.PI * (price / totalValue) * 2);

				if (i % 2 === 0 && i > 0) {
					this.tableGraph.push(auxTableLine);
					auxTableLine = [];
				}

				this.series[0].data.push(auxData);
				auxTableLine.push(auxData);

            });

            this.tableGraph.push(auxTableLine);

        }

    }

	private generateChartData(ingredients) {

		const data: number[] = [];
		const labels: string[] = [];

		const total = this.getTotalIngredients(ingredients);

		_.forEach(ingredients, (ri: RecipeIngredient) => {
			const price: number = this.calcIngredientPrice(ri);
			const porcent: number = (price / total) * 100;
			data.push(price);
			labels.push(ri.ingredient.name + ' (' + porcent.toFixed(0) + '%)');
		});

	}

	private async loadPhoto() {

		try {

			let photoUrl = this.recipeReportOptions.recipe.photoUrl;

			photoUrl = photoUrl.replace(/^.*[\\\/]/, '');

			let bucket:string = "/menu";

			if( this.type == CARD_TYPE.RECEITA ) {
				bucket = "/recipe";
			}

			this.photoUrl = `${APP_CONFIG.BASE_FULL_URL}${PACKAGE.STORAGE}${bucket}/${photoUrl}`;

		}
		catch(e) {
			console.warn(e.message);
		}

	}

	refresh(value: RecipeReportOptions) {
		this.recipeReportOptions = null;
		this.recipeReportOptions = value;

		this.loadPhoto();

		defineFont({
			roboto: 'assets/fonts/Roboto/Roboto-Regular.ttf'
		});

		this.columnSize = 0;
		if (this.recipeReportOptions.getDisplay().ingredients) {
			this.columnSize += 1;
		}
		if (this.recipeReportOptions.getDisplay().financial || this.recipeReportOptions.getDisplay().nutrition) {
			this.columnSize += 1;
		}
		if (this.recipeReportOptions.getDisplay().steps) {
			this.columnSize += 1;
		}
		if (this.recipeReportOptions.getDisplay().menuItens) {
			this.columnSize += 1;
		}
		if (this.recipeReportOptions.getDisplay().general) {
			this.columnSize += 1;
		}

		this.generateSeries();
		if (this.recipeReportOptions.recipe) {
			this.generateChartData(this.recipeReportOptions.recipe.ingredients);
		}
		this.drawChart();
	}

	calcIngredientPrice(recipeIngredient: RecipeIngredient) {
		return this.calc.calcIngredientPrice(recipeIngredient);
	}

	getTotalIngredients(ingredients: RecipeIngredient[]): number {
		return this.calc.totalRecipeIngredients(ingredients);
	}

}

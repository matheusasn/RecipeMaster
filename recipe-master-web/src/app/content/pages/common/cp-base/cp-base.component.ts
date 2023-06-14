import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { CPPagination } from '../../../../core/models/common/cp-pagination';
import { ApiResponse } from '../../../../core/models/api-response';
import * as _ from 'lodash';

@Component({
    selector: 'm-cp-base',
    templateUrl: './cp-base.component.html',
    styleUrls: ['./cp-base.component.scss']
})
export class CpBaseComponent implements OnInit {

    formGroup: FormGroup;

    pagination: CPPagination = new CPPagination();

    private _alertSubscription: Subscription;

    constructor(
        protected _loading: CpLoadingService,
		protected _cdr: ChangeDetectorRef
    ) {
        this._alertSubscription = this._loading.loadingHideEvent.subscribe( () => {
            try {
                this._cdr.detectChanges();
            }
            catch(e) {
                console.warn(e.message);
            }
        });
    }

    ngOnInit() {
    }


	ngOnDestroy(): void {
        this._alertSubscription.unsubscribe();
    }

    protected fillPaginationWithApiResponse(apiResponse: ApiResponse) {
        this.pagination = {
            currentPage: apiResponse.currentPage,
            itensPerPage: apiResponse.itensPerPage,
            totalPages: apiResponse.totalPages
        };
    }

    protected getFieldErrors(fieldName: string) {
        return this.getField(fieldName).errors;
    }

    protected getField(fieldName: string) {
        return this.formGroup.get(fieldName);
    }

    compareSelect(value1: any, value2: any): boolean {
        return value1 && value2 ? value1.id === value2.id : value1 === value2;
    }

    compareCurrency(value1: any, value2: any): boolean {
        return value1 === value2;
    }

    protected onChangeComponent() {
        this._cdr.detectChanges();
    }

    getColorIngredientCategory(index: number, ingredients: any) {
		let styles;
        let idIngredientCategory = undefined;
        let deg;
        let width;
        let opacity = 1;
        let defaultColor = '#FFFFFF'

        if(index != null){
            if(!_.isNil(ingredients[index].ingredient.ingredientCategory)) {
                idIngredientCategory = ingredients[index].ingredient.ingredientCategory.id;
            }
            deg = '0deg';
            width = '1%';
        }else {
            if(!_.isNil(ingredients.ingredient.ingredientCategory)) {
                idIngredientCategory = ingredients.ingredient.ingredientCategory.id;
            }
            deg = '90deg';
            width = '170px';
        }

		switch (idIngredientCategory) {
			case 100: //Aves
				styles = {
                    'background': 'linear-gradient('+deg+', #EE9CA7 0%, #FFDDE1 100%)',
                    'color': '#B25454',
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 101: //Bebidas
				styles = {
                    'background': 'linear-gradient('+deg+', #00B4DB 0%, #0083B0 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 102: //Carnes
				styles = {
                    'background': 'linear-gradient('+deg+', #ED213A 0%, #93291E 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 103: //Doces e químicos
				styles = {
                    'background': 'linear-gradient('+deg+', #A73737 0%, #7A2828 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 104: //Embutidos
				styles = {
                    'background': 'linear-gradient('+deg+', #BF1010 0%, #570606 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 105: //Frutas
				styles = {
                    'background': 'linear-gradient('+deg+', #9400D3 0%, #4B0082 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 106: //Grãos e cereais
				styles = {
                    'background': 'linear-gradient('+deg+', #B79891 0%, #94716B 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 107: //Hortaliças
				styles = {
                    'background': 'linear-gradient('+deg+', #003D4D 0%, #0FA780 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 108: //Laticínios e ovos
				styles = {
                    'background': 'linear-gradient('+deg+', #8E9EAB 0%, #EEF2F3 100%)',
                    'color': '#727E88',
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 109: //Massas e pães
				styles = {
                    'background': 'linear-gradient('+deg+', #F2994A 0%, #F2C94C 100%, #F2C94C 100%)',
                    'color': '#AA6A2E',
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 110: //Molhos
				styles = {
                    'background': 'linear-gradient('+deg+', #F2709C 0%, #FF9472 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 111: //Oleaginosas e sementes
				styles = {
                    'background': 'linear-gradient('+deg+', #603813 0%, #B29F94 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 112: //Óleos, vinagres e gorduras
				styles = {
                    'background': 'linear-gradient('+deg+', #FFE000 0%, #799F0C 100%)',
                    'color': '#788940',
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 113: //Peixes e mariscos
				styles = {
                    'background': 'linear-gradient('+deg+', #091E3A 0%, #2F80ED 50%, #2D9EE0 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 114: //Queijos
				styles = {
                    'background': 'linear-gradient('+deg+', #E65C00 0%, #F9D423 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 115: //Temperos e condimentos
				styles = {
                    'background': 'linear-gradient('+deg+', #0C7357 0%, #5B2803 100%)',
                    'color': defaultColor,
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 116: //Farinha
				styles = {
                    'background': 'linear-gradient('+deg+', #EACDA3 0%, #D6AE7B 100%)',
                    'color': '#956831',
                    'width': width,
                    'opacity': opacity
				}
				break;
			case 117: //Legumes e verduras
				styles = {
					'background': 'linear-gradient('+deg+', #11998E 2.27%, #38EF7D 97.73%)',
                    'width': width,
                    'opacity': opacity,
										'color': defaultColor
				}
				break;
			default:
				styles = {
					'background-color': '#c8c8c8',
                    'width': width,
                    'opacity': opacity
				}
				break;
		}

		return styles;
    }

    protected getColorGraphic(idIngredientCategory): String {
        let color;

        switch (idIngredientCategory) {
			case 100: //Aves
				color = "#EE9CA7";
				break;
			case 101: //Bebidas
                color = "#00B4DB";
				break;
			case 102: //Carnes
                color = "#ED213A";
				break;
			case 103: //Doces e químicos
                color = "#A73737";
				break;
			case 104: //Embutidos
                color = "#BF1010";
				break;
			case 105: //Frutas
                color = "#9400D3";
				break;
			case 106: //Grãos e cereais
                color = "#B79891";
				break;
			case 107: //Hortaliças
                color = "#003D4D";
				break;
			case 108: //Laticínios e ovos
                color = "#8E9EAB";
				break;
			case 109: //Massas e pães
                color = "#F2994A";
				break;
			case 110: //Molhos
                color = "#F2709C";
				break;
			case 111: //Oleaginosas e sementes
                color = "#603813";
				break;
			case 112: //Óleos, vinagres e gorduras
                color = "#FFE000";
				break;
			case 113: //Peixes e mariscos
                color = "#091E3A";
				break;
			case 114: //Queijos
                color = "#E65C00";
				break;
			case 115: //Temperos e condimentos
                color = "#0C7357";
				break;
			case 116: //Farinha
                color = "#EACDA3";
				break;
			case 117: //Legumes e verduras
                color = "#11998E";
				break;
			default:
                color = "#c8c8c8";
				break;
		}

		return color;
    }

}

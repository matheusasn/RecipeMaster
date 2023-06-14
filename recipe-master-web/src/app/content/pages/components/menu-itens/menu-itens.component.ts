import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../../../../core/models/business/menu';
import { RecipeIngredient } from '../../../../core/models/business/recipeingredient';
import { CommonCalcService } from '../../../../core/services/business/common-calc.service';
import { MenuItem } from '../../../../core/models/business/menuitem';

@Component({
  selector: 'cp-menu-itens',
  templateUrl: './menu-itens.component.html',
  styleUrls: ['./menu-itens.component.scss']
})
export class MenuItensComponent implements OnInit {

  @Input() menu: Menu;
  
  constructor(private calc: CommonCalcService) { }

  ngOnInit() {
  }

  calcMenuItemPrice(menuItem: MenuItem) {
		return this.calc.calcMenuItemPrice(menuItem);
  }
  
}

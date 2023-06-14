import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../../../../../core/models/business/recipe';

@Component({
  selector: 'm-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {

  @Input() recipe: Recipe;
  
  constructor() { }

  ngOnInit() {
  }

}

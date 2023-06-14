import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'm-cp-nutritional-info-item',
  templateUrl: './cp-nutritional-info-item.component.html',
  styleUrls: ['./cp-nutritional-info-item.component.scss']
})
export class CpNutritionalInfoItemComponent implements OnInit {

  @Input() label:string = "N/I";
  @Input() value:number = 0;
  @Input() unitLabel:string;

  constructor( private translate: TranslateService) { }

  ngOnInit() {}

}

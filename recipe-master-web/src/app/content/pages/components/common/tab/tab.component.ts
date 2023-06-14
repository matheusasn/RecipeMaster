import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTab]'
})
export class TabDirective {
  @Input('appTab') id: number;

  constructor(public el: ElementRef) { }

}

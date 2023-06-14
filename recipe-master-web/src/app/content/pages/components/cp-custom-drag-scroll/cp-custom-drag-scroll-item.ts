import { Directive, ElementRef, Input, HostBinding, Inject } from '@angular/core';

@Directive({
  selector: '[cp-custom-drag-scroll-item]'
})
export class CpCustomDragScrollItemDirective {
  @HostBinding('style.display')
  display = 'inline-block';

  @Input('drag-disabled')
  get dragDisabled() { return this._dragDisabled; }
  set dragDisabled(value: boolean) { this._dragDisabled = value; }

  _dragDisabled = false;

  _elementRef: ElementRef;

  constructor(
    @Inject(ElementRef) elementRef: ElementRef,
  ) {
    this._elementRef = elementRef;
  }
}

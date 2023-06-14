import { Directive, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {

    @Output() clickOutside = new EventEmitter<boolean>();
    target1: String = "<div class=\"m-stack__item m-topbar__nav-wrapper";
    target2: String = "<img _ngcontent-c4=\"\" alt=\"\" class=\"m--marginless m--img-centered profile-pic\" src=\"assets/avatar.png\">";
    targetOrigin: String;
    clickedInside: boolean;

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(target) {
        this.clickedInside = !this.elementRef.nativeElement.contains(target);

        if(target.outerHTML.substring(0, 4) == "<div"){
            this.targetOrigin = target.outerHTML.substring(0, 47);
        }else{
            this.targetOrigin = target.outerHTML;
        }
        
        if(this.target1 == this.targetOrigin || this.target2 == this.targetOrigin){
            this.clickedInside = false;
        }

        this.clickOutside.emit(this.clickedInside);
    }
}

import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CpCustomDragScrollComponent } from "../../../components/cp-custom-drag-scroll/cp-custom-drag-scroll.component";

@Component({
	selector: 'm-public-recipes-carousel',
	templateUrl: './public-recipes-carousel.html',
	styleUrls: ['./public-recipes-carousel.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PublicRecipesCarouselComponent implements OnInit {

	private isScrolling = false;

	@Input() carousel: any;
	@Input() carouselIndex: number;

	reachedLeftBound = false;
	reachedRightBound = false;

	@ViewChild('customDragScroll', {read: CpCustomDragScrollComponent}) customDragScroll: CpCustomDragScrollComponent;

	constructor() {
	}

	ngOnInit(): void {}

	handleDragStart() {
		this.isScrolling = true;
	}

	handleDragEnd() {
		this.isScrolling = false;
	}

	handleRecipeClick(recipe: any) {
		if (!this.isScrolling) {
			recipe.checked = !recipe.checked;
		}
	}

	get screenWidth() {
		return +window.innerWidth
	}

	onReachesLeftBound(value: boolean) {
		this.reachedLeftBound = value;
	}

	onReachesRightBound(value: boolean) {
		this.reachedRightBound = value;
	}

	onButtonRightClick() {
		this.customDragScroll.moveRight()
	}

	onButtonLeftClick() {
		this.customDragScroll.moveLeft()
	}

}

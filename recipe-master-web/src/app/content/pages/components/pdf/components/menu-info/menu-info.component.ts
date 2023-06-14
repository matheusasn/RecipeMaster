import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { APP_CONFIG } from '../../../../../../config/app.config';
import { PACKAGE } from '../../../../../../core/constants/endpoints';
import { Menu } from '../../../../../../core/models/business/menu';
import { Recipe } from '../../../../../../core/models/business/recipe';

@Component({
  selector: 'm-menu-info',
  templateUrl: './menu-info.component.html',
  styleUrls: ['./menu-info.component.scss']
})
export class MenuInfoComponent implements OnInit {

  backgroundImage:any;
  defaultBackgroundImage = 'assets/app/no-menu-image.png';

  @Input()
  menu: Menu;
  @Input()
  showPhoto:boolean = true;
  @ViewChild('mainContainer') mainContainer:ElementRef;

  constructor() { }

  ngOnInit() {
  }

	ngOnChanges(changes:SimpleChanges) {
		if (this.menu && this.menu.photoUrl) {
			this.loadPhoto();
		} else {
			this.backgroundImage = null;
		}
  }

  get size():number {

    try {
      return this.mainContainer.nativeElement.offsetHeight;
    }
    catch(e){
      console.warn(e);
    }

    return 0;

  }

		private async loadPhoto() {

		try {
			let photoUrl = this.menu.photoUrl;

			photoUrl = photoUrl.replace(/^.*[\\\/]/, '');

			let bucket:string = "/menu";

			this.backgroundImage = `${APP_CONFIG.BASE_FULL_URL}${PACKAGE.STORAGE}${bucket}/${photoUrl}`;

		}
		catch(e) {
			console.warn(e.message);
		}

	}

}

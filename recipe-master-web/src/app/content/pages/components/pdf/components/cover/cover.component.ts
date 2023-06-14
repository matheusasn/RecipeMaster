import { Component, Input, OnInit } from '@angular/core';
import { APP_CONFIG } from '../../../../../../config/app.config';
import { PACKAGE } from '../../../../../../core/constants/endpoints';

@Component({
  selector: 'm-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {

  @Input() logoUrl:string;
	@Input() type: string;

  constructor() { }

  ngOnInit() {

  }

	ngOnChanges() {
    this.loadPhoto();
	}

  private async loadPhoto() {

		try {

			let photoUrl = this.logoUrl;

			photoUrl = photoUrl.replace(/^.*[\\\/]/, '');

			let bucket:string = "/pdf";

			this.logoUrl = `${APP_CONFIG.BASE_FULL_URL}${PACKAGE.STORAGE}${bucket}/${photoUrl}`;

		}
		catch(e) {
			console.warn(e.message);
		}

	}

}

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'm-another-app-to-foreign-users',
  templateUrl: './another-app-to-foreign-users.component.html',
  styleUrls: ['./another-app-to-foreign-users.component.scss']
})
export class AnotherAppToForeignUsersComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {}

	showNewApp() {
		const appUrl = 'https://play.google.com/store/apps/details?id=com.app.recipemasterapp.eua.eur';
		this.document.location.href = appUrl;
	}

}

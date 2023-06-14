import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SubheaderService } from '../../../core/metronic/services/layout/subheader.service';

@Component({
	selector: 'm-subheader',
	templateUrl: './subheader.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubheaderComponent implements OnInit {
	constructor(public subheaderService: SubheaderService) {}

	ngOnInit(): void {}
}

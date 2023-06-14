import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutConfig } from '../../../config/layout';
import { LayoutConfigService } from '../../../core/metronic/services/layout-config.service';
import { ClassInitService } from '../../../core/metronic/services/class-init.service';
import { LayoutConfigStorageService } from '../../../core/metronic/services/layout-config-storage.service';

@Component({
	selector: 'm-builder',
	templateUrl: './builder.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent implements OnInit {
	@Input() model: any;
	@ViewChild('builderForm') form: NgForm;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private classInitService: ClassInitService,
		private layoutConfigStorageService: LayoutConfigStorageService
	) {
		this.layoutConfigService.onLayoutConfigUpdated$.subscribe(config => {
			this.model = config.config;
		});
	}

	ngOnInit(): void {}

	submitPreview(form: NgForm): void {
		this.layoutConfigService.setModel(new LayoutConfig(this.model));
	}

	resetPreview(event: Event): void {
		event.preventDefault();
		this.layoutConfigStorageService.resetConfig();
		location.reload();
	}
}

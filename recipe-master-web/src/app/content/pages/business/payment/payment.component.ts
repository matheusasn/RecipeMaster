import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent  extends CpBaseComponent implements OnInit {

	hasDiscount: boolean = false;

  constructor( _cdr: ChangeDetectorRef,	_loading: CpLoadingService, private route: ActivatedRoute ) {
		super(_loading, _cdr);

		this.route.queryParams.subscribe(params => {
			this.hasDiscount = params['discount']
		})
  }

  ngOnInit() {}

}

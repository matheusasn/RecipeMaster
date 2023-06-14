import { TestBed } from '@angular/core/testing';

import { PurchaseListService } from './purchase-list.service';

describe('PurchaseListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseListService = TestBed.get(PurchaseListService);
    expect(service).toBeTruthy();
  });
});

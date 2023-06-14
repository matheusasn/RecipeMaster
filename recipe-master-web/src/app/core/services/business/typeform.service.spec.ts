import { TestBed } from '@angular/core/testing';

import { TypeformService } from './typeform.service';

describe('TypeformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeformService = TestBed.get(TypeformService);
    expect(service).toBeTruthy();
  });
});

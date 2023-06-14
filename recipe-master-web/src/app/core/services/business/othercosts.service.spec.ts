import { TestBed } from '@angular/core/testing';

import { OthercostsService } from './othercosts.service';

describe('OthercostsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OthercostsService = TestBed.get(OthercostsService);
    expect(service).toBeTruthy();
  });
});

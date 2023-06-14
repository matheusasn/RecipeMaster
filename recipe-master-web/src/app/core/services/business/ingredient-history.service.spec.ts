import { TestBed } from '@angular/core/testing';

import { IngredientHistoryService } from './ingredient-history.service';

describe('IngredientHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IngredientHistoryService = TestBed.get(IngredientHistoryService);
    expect(service).toBeTruthy();
  });
});

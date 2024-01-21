import { TestBed } from '@angular/core/testing';

import { GeotabApiService } from './geotab-api.service';

describe('GeotabApiService', () => {
  let service: GeotabApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeotabApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

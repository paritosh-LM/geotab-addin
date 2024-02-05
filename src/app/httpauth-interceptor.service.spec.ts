import { TestBed } from '@angular/core/testing';

import { HTTPAuthInterceptorService } from './httpauth-interceptor.service';

describe('HTTPAuthInterceptorService', () => {
  let service: HTTPAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HTTPAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

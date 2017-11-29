import { TestBed, inject } from '@angular/core/testing';

import { RetialerService } from './retialer.service';

describe('RetialerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetialerService]
    });
  });

  it('should be created', inject([RetialerService], (service: RetialerService) => {
    expect(service).toBeTruthy();
  }));
});

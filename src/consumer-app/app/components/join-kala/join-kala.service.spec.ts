import { TestBed, inject } from '@angular/core/testing';

import { JoinKalaService } from '../../services/join-kala.service';

describe('JoinKalaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JoinKalaService]
    });
  });

  it('should be created', inject([JoinKalaService], (service: JoinKalaService) => {
    expect(service).toBeTruthy();
  }));
});

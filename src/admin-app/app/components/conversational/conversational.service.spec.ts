import { TestBed, inject } from '@angular/core/testing';

import { ConversationalService } from './conversational.service';

describe('ConversationalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationalService]
    });
  });

  it('should be created', inject([ConversationalService], (service: ConversationalService) => {
    expect(service).toBeTruthy();
  }));
});

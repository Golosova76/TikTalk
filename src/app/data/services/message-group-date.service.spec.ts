import { TestBed } from '@angular/core/testing';

import { MessageGroupDateService } from './message-group-date.service';

describe('MessageGroupDateService', () => {
  let service: MessageGroupDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageGroupDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SnortAlertsService } from './snort-alerts.service';

describe('SnortAlertsService', () => {
  let service: SnortAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnortAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

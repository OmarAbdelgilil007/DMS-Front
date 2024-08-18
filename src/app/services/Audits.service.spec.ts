/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditsService } from './Audits.service';

describe('Service: Audits', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditsService]
    });
  });

  it('should ...', inject([AuditsService], (service: AuditsService) => {
    expect(service).toBeTruthy();
  }));
});

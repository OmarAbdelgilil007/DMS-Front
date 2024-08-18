/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoginLogsService } from './loginLogs.service';

describe('Service: LoginLogs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginLogsService]
    });
  });

  it('should ...', inject([LoginLogsService], (service: LoginLogsService) => {
    expect(service).toBeTruthy();
  }));
});

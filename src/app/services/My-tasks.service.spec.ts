/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyTasksService } from './My-tasks.service';

describe('Service: MyTasks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyTasksService]
    });
  });

  it('should ...', inject([MyTasksService], (service: MyTasksService) => {
    expect(service).toBeTruthy();
  }));
});

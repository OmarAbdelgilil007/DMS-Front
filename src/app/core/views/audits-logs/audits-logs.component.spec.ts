import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsLogsComponent } from './audits-logs.component';

describe('AuditsLogsComponent', () => {
  let component: AuditsLogsComponent;
  let fixture: ComponentFixture<AuditsLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditsLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditsLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

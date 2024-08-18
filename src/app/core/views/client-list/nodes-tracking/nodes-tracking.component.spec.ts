import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesTrackingComponent } from './nodes-tracking.component';

describe('NodesTrackingComponent', () => {
  let component: NodesTrackingComponent;
  let fixture: ComponentFixture<NodesTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodesTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodesTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

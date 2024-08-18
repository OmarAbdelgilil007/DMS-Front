import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNameComponent } from './confirm-name.component';

describe('ConfirmNameComponent', () => {
  let component: ConfirmNameComponent;
  let fixture: ComponentFixture<ConfirmNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrimDeleteNodeComponent } from './confrim-delete-node.component';

describe('ConfrimDeleteNodeComponent', () => {
  let component: ConfrimDeleteNodeComponent;
  let fixture: ComponentFixture<ConfrimDeleteNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfrimDeleteNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfrimDeleteNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

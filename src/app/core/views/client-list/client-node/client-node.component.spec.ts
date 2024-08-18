import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNodeComponent } from './client-node.component';

describe('ClientNodeComponent', () => {
  let component: ClientNodeComponent;
  let fixture: ComponentFixture<ClientNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

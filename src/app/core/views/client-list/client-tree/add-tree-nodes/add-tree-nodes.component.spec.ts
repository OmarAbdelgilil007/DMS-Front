import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreeNodesComponent } from './add-tree-nodes.component';

describe('AddTreeNodesComponent', () => {
  let component: AddTreeNodesComponent;
  let fixture: ComponentFixture<AddTreeNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTreeNodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

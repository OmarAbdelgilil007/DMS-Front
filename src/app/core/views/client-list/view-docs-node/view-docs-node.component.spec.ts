import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocsNodeComponent } from './view-docs-node.component';

describe('ViewDocsNodeComponent', () => {
  let component: ViewDocsNodeComponent;
  let fixture: ComponentFixture<ViewDocsNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocsNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDocsNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

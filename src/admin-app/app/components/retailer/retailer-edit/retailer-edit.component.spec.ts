import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerEditComponent } from './retailer-edit.component';

describe('RetailerEditComponent', () => {
  let component: RetailerEditComponent;
  let fixture: ComponentFixture<RetailerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

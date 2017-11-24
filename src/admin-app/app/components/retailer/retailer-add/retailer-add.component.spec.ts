import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerAddComponent } from './retailer-add.component';

describe('RetailerAddComponent', () => {
  let component: RetailerAddComponent;
  let fixture: ComponentFixture<RetailerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

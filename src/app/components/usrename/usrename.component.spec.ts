import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrenameComponent } from './usrename.component';

describe('UsrenameComponent', () => {
  let component: UsrenameComponent;
  let fixture: ComponentFixture<UsrenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsrenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

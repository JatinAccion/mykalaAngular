import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerInterestComponent } from './consumer-interest.component';

describe('ConsumerInterestComponent', () => {
  let component: ConsumerInterestComponent;
  let fixture: ComponentFixture<ConsumerInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

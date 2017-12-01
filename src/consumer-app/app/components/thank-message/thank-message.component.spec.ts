import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankMessageComponent } from './thank-message.component';

describe('ThankMessageComponent', () => {
  let component: ThankMessageComponent;
  let fixture: ComponentFixture<ThankMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

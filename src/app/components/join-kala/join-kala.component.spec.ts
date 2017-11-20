import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinKalaComponent } from './join-kala.component';

describe('JoinKalaComponent', () => {
  let component: JoinKalaComponent;
  let fixture: ComponentFixture<JoinKalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinKalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinKalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

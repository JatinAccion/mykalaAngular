import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step4Component implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
  }

  prev() {
    this.route.navigate(['/getoffer', 'step3']);
  };

  next() {
    console.log("Confirmed:::::::::::::::::")
  };

}

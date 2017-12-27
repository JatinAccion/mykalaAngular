import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step2Component implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
  };

  prev() {
    this.route.navigate(['/getoffer', 'step1']);
  };

  next(){
    this.route.navigate(['/getoffer', 'step3']);
  };

}

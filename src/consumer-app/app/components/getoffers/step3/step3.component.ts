import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GetOfferModal } from '../getOffer.modal';
import { OfferInfo3 } from '../steps.modal';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step3Component implements OnInit {

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
  }

  prev() {
    this.route.navigate(['/getoffer', 'step2']);
  };

  next() {
    this.route.navigate(['/getoffer', 'step4']);
  };

}

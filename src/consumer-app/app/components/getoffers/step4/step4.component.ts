import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GetOfferModal } from '../getOffer.modal';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step4Component implements OnInit {
  Step1Data;
  Step2Data;
  Step3Data;
  Step4Summary: any;

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    if (window.localStorage['GetOfferStep_1'] != undefined) this.Step1Data = JSON.parse(window.localStorage['GetOfferStep_1']);
    if (window.localStorage['GetOfferStep_2'] != undefined) this.Step2Data = JSON.parse(window.localStorage['GetOfferStep_2']);
    if (window.localStorage['GetOfferStep_3'] != undefined) this.Step3Data = JSON.parse(window.localStorage['GetOfferStep_3']);
    this.Step4Summary = { ...this.Step1Data[0], ...this.Step3Data[0] };
    console.log(this.Step4Summary)
  }

  prev() {
    this.route.navigate(['/getoffer', 'step3']);
  };

  next() {
    console.log("Confirmed:::::::::::::::::")
  };

}
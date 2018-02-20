import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { GetOfferService } from '../../../services/getOffer.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step2Component implements OnInit {
  pageLabel: string;
  headerMessage: string;
  GetOfferStep_2: any;

  constructor(
    private route: Router,
    public core: CoreService,
    private getoffers: GetOfferService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    this.pageLabel = 'We just need a few details about what\'s most important to you';
    this.core.pageLabel(this.pageLabel);
    if (window.localStorage['GetOfferStep_2'] != undefined) this.GetOfferStep_2 = JSON.parse(window.localStorage['GetOfferStep_2'])
    this.getofferSubCategory(this.GetOfferStep_2)
  };

  getofferSubCategory(GetOfferStep_1Data) {
    this.getoffers.getofferSubCategory(GetOfferStep_1Data).subscribe(res => {
      console.log(res);
    });
  }

  skip() {
    localStorage.removeItem('GetOfferStep_2');
    this.route.navigate(['/getoffer', 'step3']);
  }

  prev() {
    this.route.navigate(['/getoffer', 'step1']);
  };

  next() {
    this.route.navigate(['/getoffer', 'step3']);
  };

}

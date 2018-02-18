import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { GetOfferModal } from '../../../../../models/getOffer.modal';
import { GetOfferService } from '../../../services/getOffer.service';
import { OfferInfo4 } from '../../../../../models/steps.modal';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step4Component implements OnInit {
  pageLabel: string;
  headerMessage: string;
  loader: boolean = false;
  Step1Data;
  Step2Data;
  Step3Data;
  Step4Summary: any; // Contains Selections from Step 1 to Step 4
  Step4Modal = new OfferInfo4(); // Contains Step 4 Request Modal
  userData: any;

  constructor(
    private route: Router,
    public core: CoreService,
    private getOffer: GetOfferService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    this.pageLabel = 'You\'re almost done! Please confirm that we got everything right';
    this.core.pageLabel(this.pageLabel);
    if (window.localStorage['GetOfferStep_1'] != undefined) this.Step1Data = JSON.parse(window.localStorage['GetOfferStep_1']);
    if (window.localStorage['GetOfferStep_2'] != undefined) this.Step2Data = JSON.parse(window.localStorage['GetOfferStep_2']);
    if (window.localStorage['GetOfferStep_3'] == "") {
      this.Step3Data = "";
      this.Step4Summary = { ...this.Step1Data[0], ...this.Step3Data };
    }
    else if (window.localStorage['GetOfferStep_3'] != undefined) {
      this.Step3Data = JSON.parse(window.localStorage['GetOfferStep_3']);
      this.Step4Summary = { ...this.Step1Data[0], ...this.Step3Data[0] };
    }
    if (window.localStorage['userInfo'] != undefined) this.userData = JSON.parse(window.localStorage['userInfo']);
    console.log(this.Step4Summary)
  }

  prev() {
    this.route.navigate(['/getoffer', 'step3']);
  };

  next() {
    var current = new Date();
    var currentDay = current.getDate()
    var currentMonth = current.getMonth() + 1
    var currentYear = current.getFullYear()
    var forThreeDays = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
    var futureDay = forThreeDays.getDate()
    var futureMonth = forThreeDays.getMonth() + 1
    var futureYear = forThreeDays.getFullYear()
    this.loader = true;
    this.Step4Modal.placeName = this.Step4Summary.place.name;
    this.Step4Modal.categoryName = this.Step4Summary.category.name;
    this.Step4Modal.subCategoryName = this.Step4Summary.subCategory.name;
    this.Step4Modal.deliveryMethod = this.Step4Summary.delivery;
    this.Step4Modal.deliveryLocation = this.Step4Summary.location;
    this.Step4Modal.price.minPrice = this.Step4Summary.priceRange.minPrice;
    this.Step4Modal.price.maxPrice = this.Step4Summary.priceRange.maxPrice;
    this.Step4Modal.startDate = current;
    this.Step4Modal.endDate = forThreeDays;
    this.Step4Modal.typeName = new Array<any>();
    for (var i = 0; i < this.Step4Summary.type.length; i++) this.Step4Modal.typeName.push(this.Step4Summary.type[i].name);
    if (this.userData == undefined) {
      this.Step4Modal.emailId = '';
      this.Step4Modal.userId = '';
    }
    else {
      this.Step4Modal.emailId = this.userData.emailId;
      this.Step4Modal.userId = this.userData.userId;
    }
    this.getOffer.confirmOffer(this.Step4Modal).subscribe(res => {
      this.loader = false;
      localStorage.removeItem("GetOfferStep_1");
      localStorage.removeItem("GetOfferStep_3");
      window.localStorage['getOffers'] = JSON.stringify(res);
      this.route.navigateByUrl("/myoffer")
    });
  };

}

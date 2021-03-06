import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
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
  step2DataArr = [];
  @ViewChild('confirmOfferModal') confirmOfferModal: ElementRef;
  confirmValidationMsg = { label: '', message: '' };
  isFromES: boolean = false;

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
    window.localStorage['esKeyword'] != undefined ? this.isFromES = true : this.isFromES = false;
    if (window.localStorage['GetOfferStep_1'] != undefined) this.Step1Data = JSON.parse(window.localStorage['GetOfferStep_1']);
    if (window.localStorage['GetOfferStep_2'] != undefined) {
      this.Step2Data = JSON.parse(window.localStorage['GetOfferStep_2']);
      for (var keys in this.Step2Data.attributes) {
        this.step2DataArr.push({
          key: keys,
          values: this.Step2Data.attributes[keys]
        })
      }
    }
    if (window.localStorage['GetOfferStep_2'] == "") {
      this.Step2Data = "";
      this.Step4Summary = { ...this.Step1Data[0] };
    }
    if (window.localStorage['GetOfferStep_3'] == "") {
      this.Step3Data = "";
      this.Step4Summary = { ...this.Step1Data[0], ...this.Step2Data, ...this.Step3Data };
    }
    else if (window.localStorage['GetOfferStep_3'] != undefined) {
      this.Step3Data = JSON.parse(window.localStorage['GetOfferStep_3']);
      this.Step4Summary = { ...this.Step1Data[0], ...this.Step2Data, ...this.Step3Data[0] };
    }
    if (window.localStorage['userInfo'] != undefined) this.userData = JSON.parse(window.localStorage['userInfo']);
  }

  prev() {
    this.route.navigate(['/getoffer', 'step3']);
  };

  confirmUser() {
    window.localStorage['tbnAfterLogin'] = window.location.hash.split("#")[1];
    this.route.navigateByUrl('/login')
  }

  next() {
    if (window.localStorage['token'] == undefined) {
      this.confirmValidationMsg.label = "login";
      this.confirmValidationMsg.message = "You must be logged in to check the avilable offers! \n\n Do you want to login now ?"
      this.core.openModal(this.confirmOfferModal);
    }
    else {
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
      if (this.Step4Summary.priceRange != undefined) {
        this.Step4Modal.price.minPrice = this.Step4Summary.priceRange.minPrice;
        this.Step4Modal.price.maxPrice = this.Step4Summary.priceRange.maxPrice;
      }
      this.Step4Modal.startDate = current;
      this.Step4Modal.endDate = forThreeDays;
      if (this.Step4Summary.attributes == undefined) {
        let attr = { Type: [] };
        for (var i = 0; i < this.Step4Summary.type.length; i++) {
          attr.Type.push(this.Step4Summary.type[i].name)
        }
        this.Step4Modal.attributes = attr;
      }
      else this.Step4Modal.attributes = this.Step4Summary.attributes;
      this.Step4Modal.productType = this.Step4Summary.productType;
      // this.Step4Modal.typeName = new Array<any>();
      // for (var i = 0; i < this.Step4Summary.type.length; i++) this.Step4Modal.typeName.push(this.Step4Summary.type[i].name);
      if (this.userData == undefined) {
        this.Step4Modal.emailId = '';
        this.Step4Modal.userId = '';
      }
      else {
        this.Step4Modal.emailId = this.userData.emailId;
        this.Step4Modal.userId = this.userData.userId;
      }
      if (window.localStorage['offerIdForEdit'] != undefined) {
        this.Step4Modal.startDate = null;
        this.Step4Modal.endDate = null;
        this.Step4Modal.offerId = window.localStorage['offerIdForEdit']
        this.Step4Modal.consumerExist = true;
      }
      this.getOffer.confirmOffer(this.Step4Modal).subscribe(res => {
        this.loader = false;
        if (res.getOffersResponse == null || res.getOffersResponse.length == 0 || res.getOffersResponse == undefined) {
          this.confirmValidationMsg.label = "noOffer";
          this.confirmValidationMsg.message = "Sorry, but we don't have offer matches for you";
          this.core.openModal(this.confirmOfferModal);
        }
        else {
          localStorage.removeItem("GetOfferStep_1");
          localStorage.removeItem("GetOfferStep_2");
          localStorage.removeItem("GetOfferStep_3");
          window.localStorage['getOffers'] = JSON.stringify(res);
          localStorage.removeItem("offerIdForEdit");
          this.route.navigateByUrl("/myoffer")
        }
      }, (err) => {
        this.loader = false;
      });
    }
  };

}

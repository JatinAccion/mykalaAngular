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
  getObjectFromOrder = [];
  Step2SelectedValues = []

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
    if (window.localStorage['GetOfferStep_2Request'] != undefined) this.GetOfferStep_2 = JSON.parse(window.localStorage['GetOfferStep_2Request'])
    this.getofferSubCategory(this.GetOfferStep_2)
  };

  getofferSubCategory(GetOfferStep_1Data) {
    this.getoffers.getofferSubCategory(GetOfferStep_1Data).subscribe(res => {
      this.getObjectFromOrderNo(res)
    });
  }

  getObjectFromOrderNo(res) {
    let order; let keyword; let getObjectFromOrder = []; let values: any;
    let resAttribute = res.attributes;
    let resMetaData = res.attributes_orders.attributes_metadata;
    for (var key in resMetaData) search(resMetaData[key].order, resMetaData);
    function search(nameKey, myObject) {
      for (var key in myObject) {
        if (myObject[key].order === nameKey) {
          order = myObject[key];
          keyword = key;
          pushData(order, keyword);
        }
      }
    }
    function pushData(order, keyword) {
      getObjectFromOrder.push({
        key: keyword,
        order: order
      });
    }
    for (var i = 0; i < getObjectFromOrder.length; i++) {
      for (var key in resAttribute) if (getObjectFromOrder[i].key === key) getObjectFromOrder[i].values = resAttribute[key];
    }
    for (var i = 0; i < getObjectFromOrder.length; i++) {
      if (getObjectFromOrder[i].values === undefined) getObjectFromOrder.splice(i, 1);
    }
    this.getObjectFromOrder = getObjectFromOrder;
    this.getObjectFromOrder.splice(this.getObjectFromOrder.length - 1, 1)
    this.getObjectFromOrder.splice(0, 1);
  }

  select(offer, values, e) {
    if (offer.order.multiSelect == "Y") {
      e.currentTarget.className = "categ_outline_red mr-3 mb-3";
      for (var i = 0; i < this.Step2SelectedValues.length; i++) {
        if (this.Step2SelectedValues[i].length == 0) this.Step2SelectedValues.splice(i, 1);
        else if (this.Step2SelectedValues[i].values == values) {
          this.Step2SelectedValues.splice(i, 1);
          e.currentTarget.className = "categ_outline_gray mr-3 mb-3";
          return false;
        }
      }
      this.Step2SelectedValues.push({
        key: offer.key,
        values: values
      });
    }
    else {
      console.log("No")
    }

  }

  skip() {
    localStorage.removeItem('GetOfferStep_2');
    this.route.navigate(['/getoffer', 'step3']);
  }

  prev() {
    this.route.navigate(['/getoffer', 'step1']);
  };

  next() {
    window.localStorage['GetOfferStep_2'] = JSON.stringify(this.Step2SelectedValues)
    this.route.navigate(['/getoffer', 'step3']);
  };

}

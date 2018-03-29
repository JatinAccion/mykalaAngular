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
  GetOfferStep_2PS: any;
  getObjectFromOrder = [];
  Step2SelectedValues = [];
  fromAPI: boolean = false;
  lastValueForAPI: string;
  noFilterValue: string;

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
    if (window.localStorage['GetOfferStep_2Request'] != undefined) {
      this.GetOfferStep_2 = JSON.parse(window.localStorage['GetOfferStep_2Request']);
      this.GetOfferStep_2PS = JSON.parse(window.localStorage['GetOfferStep_2Request']);
    }
    this.getofferSubCategory(this.GetOfferStep_2)
  };

  getofferSubCategory(GetOfferStep_1Data) {
    this.getoffers.getofferSubCategory(GetOfferStep_1Data).subscribe(res => {
      this.GetOfferStep_2.attributes = {};
      this.getObjectFromOrderNo(res)
    });
  }

  getObjectFromOrderNo(res) {
    let order; let keyword; let getObjectFromOrder = []; let values: any; let withValues = [];
    let resAttribute = res.attributes;
    let resMetaData = res.attributes_orders.attributes_metadata;
    for (var key in resMetaData) search(resMetaData[key].order, resMetaData);
    function search(nameKey, myObject) {
      for (var key in myObject) {
        if (myObject[key].Page != "1") {
          if (myObject[key].order === nameKey) {
            order = myObject[key];
            keyword = key;
            pushData(order, keyword);
          }
        }
      }
    }
    function pushData(order, keyword) {
      getObjectFromOrder.push({
        key: keyword,
        order: order,
        orderNo: order.order
      });
    }
    //Assigning Values
    for (var i = 0; i < getObjectFromOrder.length; i++) {
      for (var key in resAttribute) if (getObjectFromOrder[i].key === key) getObjectFromOrder[i].values = resAttribute[key];
    }
    //Splicing the Objects without Values
    for (var i = 0; i < getObjectFromOrder.length; i++) {
      if (getObjectFromOrder[i].values != undefined) withValues.push(getObjectFromOrder[i]);
    }
    //Filtering the Array Based on Filter Key as Yes
    this.sort(withValues)
    getObjectFromOrder = [];

    for (var i = 0; i < withValues.length; i++) {
      getObjectFromOrder.push(withValues[i]);
      if (this.noFilterValue != withValues[i].key) {
        if (withValues[i].order.Filter == 'Y') {
          this.noFilterValue = withValues[i].key;
          break;
        }
      }
    }
    //Filter data from internal API response
    if (this.fromAPI) {
      let a = this.getObjectFromOrder;
      let b = getObjectFromOrder
      let onlyInA = a.filter(this.compare(b));
      let onlyInB = b.filter(this.compare(a));
      let result = onlyInA.concat(onlyInB);
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          this.getObjectFromOrder.push(result[i])
        }
      }
      else {
        for (var key in this.GetOfferStep_2PS.attributes) {
          for (var i = 0; i < getObjectFromOrder.length; i++) {
            if (this.lastValueForAPI != getObjectFromOrder[i].key) {
              if (key == getObjectFromOrder[i].key) getObjectFromOrder.splice(i, 1);
            }
            else getObjectFromOrder.splice(i, 1);
          }
        }
        for (var j = 0; j < getObjectFromOrder.length; j++) {
          let newObj = getObjectFromOrder[j];
          for (var k = 0; k < this.getObjectFromOrder.length; k++) {
            let oldObj = this.getObjectFromOrder[k];
            if (this.lastValueForAPI != oldObj.key) {
              if (newObj.key == oldObj.key) {
                this.getObjectFromOrder.splice(k, 1, newObj)
              }
            }
          }
        }
      }
      this.sort(this.getObjectFromOrder)
      this.fromAPI = false;
    }
    //Filter data from internal API response
    else {
      this.getObjectFromOrder = getObjectFromOrder;
    }
  }

  sort(arr) {
    arr.sort(function (a, b) {
      var keyA = parseFloat(a.orderNo),
        keyB = parseFloat(b.orderNo);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }

  compare(otherArray) {
    return function (current) {
      return otherArray.filter(function (other) {
        return other.key == current.key
      }).length == 0;
    }
  }

  select(offer, values, e) {
    let addSelected: boolean = false;
    if (offer.order.multiSelect == "Y") {
      if (e.currentTarget.className == 'categ_outline_gray mr-3 mb-3') {
        e.currentTarget.className = "categ_outline_red mr-3 mb-3";
        this.Step2SelectedValues.push({
          key: offer.key,
          values: values
        });
      }
      else {
        for (var i = 0; i < this.Step2SelectedValues.length; i++) {
          if (this.Step2SelectedValues[i].length == 0) this.Step2SelectedValues.splice(i, 1);
          else if (this.Step2SelectedValues[i].values == values) {
            this.Step2SelectedValues.splice(i, 1);
            e.currentTarget.className = "categ_outline_gray mr-3 mb-3";
            return false;
          }
        }
      }
      window.localStorage['s2SValues'] = JSON.stringify(this.Step2SelectedValues)
      let s2SValuesFinal = [];
      let s2SValues = JSON.parse(window.localStorage['s2SValues']);
      s2SValues.forEach(function (value) {
        var existing = s2SValuesFinal.filter(function (v, i) {
          return v.key == value.key;
        });
        if (existing.length) {
          var existingIndex = s2SValuesFinal.indexOf(existing[0]);
          s2SValuesFinal[existingIndex].values = s2SValuesFinal[existingIndex].values.concat(value.values);
        } else {
          if (typeof value.values == 'string')
            value.values = [value.values];
          s2SValuesFinal.push(value);
        }
      });
      localStorage.removeItem("s2SValues");
      for (var i = 0; i < s2SValuesFinal.length; i++) {
        this.GetOfferStep_2PS.attributes[s2SValuesFinal[i].key] = s2SValuesFinal[i].values
      }
      console.log(s2SValuesFinal);
      console.log(this.GetOfferStep_2PS)
    }
    //else {
    if (offer.order.Filter == "Y") {
      addSelected = true;
      let elements = e.currentTarget.parentElement.children;
      for (var i = 0; i < elements.length; i++) elements[i].className = "categ_outline_gray mr-3 mb-3";
      e.currentTarget.className = "categ_outline_red mr-3 mb-3";
    }
    if (addSelected) {
      this.GetOfferStep_2.attributes[offer.key] = [];
      this.GetOfferStep_2.attributes[offer.key].push(values);
      this.GetOfferStep_2PS.attributes[offer.key] = [];
      this.GetOfferStep_2PS.attributes[offer.key].push(values);
      this.lastValueForAPI = offer.key;
      console.log("Request::::", this.GetOfferStep_2)
      console.log("History", this.GetOfferStep_2PS)
      this.getoffers.getofferSubCategory(this.GetOfferStep_2).subscribe(res => {
        this.fromAPI = true;
        this.GetOfferStep_2.attributes = {};
        this.getObjectFromOrderNo(res);
      });
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
    window.localStorage['GetOfferStep_2'] = JSON.stringify(this.GetOfferStep_2PS)
    this.route.navigate(['/getoffer', 'step3']);
  };

}

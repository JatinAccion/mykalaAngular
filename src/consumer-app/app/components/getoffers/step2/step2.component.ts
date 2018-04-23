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
    getObjectFromOrder = withValues;

    //getObjectFromOrder = [];

    /*for (var i = 0; i < withValues.length; i++) {
      getObjectFromOrder.push(withValues[i]);
      if (this.noFilterValue != withValues[i].key) {
        if (withValues[i].order.Filter == 'Y') {
          this.noFilterValue = withValues[i].key;
          break;
        }
      }
    }*/

    //Filter data from internal API response
    if (this.fromAPI) {
      for (var i = 0; i < this.getObjectFromOrder.length; i++) {
        if (this.lastValueForAPI == this.getObjectFromOrder[i].key) {
          while ((i + 1) < this.getObjectFromOrder.length) this.getObjectFromOrder.pop();
          break;
        }
      }
      //If data is already selected before the API calls
      for (var i = 0; i < getObjectFromOrder.length; i++) {
        for (var j = 0; j < this.Step2SelectedValues.length; j++) {
          if (getObjectFromOrder[i].key == this.Step2SelectedValues[j].key) {
            delete this.Step2SelectedValues[j];
            this.Step2SelectedValues = this.Step2SelectedValues.filter(function (item) {
              return item !== undefined;
            });
          }
        }
      }

      //If data is already selected before the API calls
      for (var i = 0; i < getObjectFromOrder.length; i++) {
        this.getObjectFromOrder.push(getObjectFromOrder[i])
      }

      /*let a = this.getObjectFromOrder;
      let b = getObjectFromOrder
      let onlyInA = a.filter(this.compare(b));
      let onlyInB = b.filter(this.compare(a));
      let result = onlyInA.concat(onlyInB);
      result = result.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.key === thing.key
        ))
      )
      let c = this.getObjectFromOrder;
      let d = result
      let onlyInC = c.filter(this.finalCompare(d));
      let onlyInD = d.filter(this.finalCompare(c));
      let final = onlyInC.concat(onlyInD);
      if (final.length > 0) {
        for (var i = 0; i < final.length; i++) {
          this.getObjectFromOrder.push(final[i])
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
      }*/
      this.sort(this.getObjectFromOrder)
      this.fromAPI = false;
      this.OtherOptionAvailable('fromAPI');
    }
    //Filter data from internal API response
    else {
      this.getObjectFromOrder = getObjectFromOrder;
      this.OtherOptionAvailable('fromCommon')
    }
    this.showHideElements()
  }

  showHideElements() {
    for (var i = 0; i < this.getObjectFromOrder.length; i++) {
      let elements = this.getObjectFromOrder[i];
      if (elements.values.length > 5) this.getObjectFromOrder[i].hideRemaining = true;
    }
  }

  filterShowHide(offer) {
    if (offer.hideRemaining) {
      let elements = document.getElementsByClassName(`${offer.orderNo}`);
      for (var i = 0; i < elements.length; i++) {
        if (i > 4) elements[i].classList.add("d-none");
      }
    }
  }

  toggleElements(offer, e) {
    let elements = document.getElementsByClassName(`${offer.orderNo}`);
    if (!offer.hideRemaining) {
      e.currentTarget.innerHTML = "show more +"
      for (var i = 0; i < elements.length; i++) {
        if (i > 4) elements[i].classList.add("d-none");
      }
      offer.hideRemaining = true;
    }
    else {
      e.currentTarget.innerHTML = "show less -"
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("d-none")) elements[i].classList.remove("d-none");
      }
      offer.hideRemaining = false;
    }
  }

  OtherOptionAvailable(from) {
    for (var i = 0; i < this.getObjectFromOrder.length; i++) {
      if (this.getObjectFromOrder[i].values.indexOf("Other") > -1) {
        if (from == 'fromAPI') {
          if (this.getObjectFromOrder[i].otherInput != undefined && !this.getObjectFromOrder[i].otherInput) {
            this.getObjectFromOrder[i].otherInput = false;
          }
        }
        else this.getObjectFromOrder[i].otherInput = false;
      }
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
        return other.key != current.key
      }).length != 0;
    }
  }

  finalCompare(otherArray) {
    return function (current) {
      return otherArray.filter(function (other) {
        return other.key == current.key
      }).length == 0;
    }
  }

  select(offer, values, e) {
    let activate: boolean = true;
    let addSelected: boolean = false;
    if (offer.order.multiSelect == "Y" && offer.order.Filter != "Y") {
      if (e.currentTarget.classList.contains("categ_outline_gray")) {
        //When No Preferences Selected
        if (values == 'No Preference') {
          if (offer.lastSelection == 'Other') {
            delete offer.lastSelection;
            offer.otherInput = false;
          }
          offer.lastSelection = values;
          this.noPreferencesOther(offer, values, 'noPreference')
        }
        //When Other Selected
        else if (values == 'Other') {
          offer.otherInput = true;
          if (offer.lastSelection == 'No Preference') {
            for (var i = 0; i < this.Step2SelectedValues.length; i++) {
              if (this.Step2SelectedValues[i].key == offer.key &&
                this.Step2SelectedValues[i].values == 'No Preference') {
                this.Step2SelectedValues.splice(i, 1);
              }
            }
            delete offer.lastSelection
          }
          offer.lastSelection = values;
          this.noPreferencesOther(offer, values, 'others')
        }
        else {
          if (offer.lastSelection == 'No Preference') {
            if (offer.otherInput) offer.otherInput = false;
            let elements = document.getElementsByClassName(`${offer.key}`);
            for (var i = 0; i < elements.length; i++) {
              elements[i].classList.add("categ_outline_gray");
              elements[i].classList.remove("categ_outline_red");
            }
            this.Step2SelectedValues = this.Step2SelectedValues.filter(function (item) {
              return item !== undefined;
            });
            for (var i = 0; i < this.Step2SelectedValues.length; i++) {
              if (this.Step2SelectedValues[i].key == offer.key &&
                this.Step2SelectedValues[i].values == 'No Preference') {
                this.Step2SelectedValues[i].values = values;
              }
            }
            delete offer.lastSelection
          }
          this.Step2SelectedValues.push({
            key: offer.key,
            values: values
          });
        }
        e.currentTarget.classList.add("categ_outline_red");
        e.currentTarget.classList.remove("categ_outline_gray");
      }
      else {
        for (var i = 0; i < this.Step2SelectedValues.length; i++) {
          if (this.Step2SelectedValues[i].length == 0) this.Step2SelectedValues.splice(i, 1);
          else if (this.Step2SelectedValues[i].values == values) {
            this.Step2SelectedValues.splice(i, 1);
            e.currentTarget.classList.add("categ_outline_gray");
            e.currentTarget.classList.remove("categ_outline_red");
          }
        }
        if (values == 'Other') {
          offer.otherInput = false;
          e.currentTarget.classList.add("categ_outline_gray");
          e.currentTarget.classList.remove("categ_outline_red");
        }
      }
      this.commonAsParent()
    }
    //else {
    if (offer.order.Filter == "Y") {
      if (values == 'No Preference') {
        offer.lastSelection = values;
        this.noPreferencesOther(offer, values, 'noPreference');
        this.GetOfferStep_2.attributes[offer.key] = [];
        this.GetOfferStep_2.attributes[offer.key].push(values);
        this.commonAsParent()
      }
      else {
        addSelected = true;
        //API with Single Select Option
        if (offer.order.multiSelect == "N") {
          let elements = e.currentTarget.parentElement.children;
          for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add("categ_outline_gray")
            elements[i].classList.remove("categ_outline_red")
          }
          e.currentTarget.classList.add("categ_outline_red");
          e.currentTarget.classList.remove("categ_outline_gray");
          this.GetOfferStep_2.attributes[offer.key] = [];
          this.GetOfferStep_2PS.attributes[offer.key] = [];
          this.GetOfferStep_2.attributes[offer.key].push(values);
          this.GetOfferStep_2PS.attributes[offer.key].push(values);
        }
        //API with Multi Select Option
        else {
          window.localStorage['multiSelectAPI'] = true;
          if (this.GetOfferStep_2.attributes[offer.key] == undefined) this.GetOfferStep_2.attributes[offer.key] = [];
          if (this.GetOfferStep_2PS.attributes[offer.key] == undefined) this.GetOfferStep_2PS.attributes[offer.key] = [];
          if (e.currentTarget.classList.contains("categ_outline_red")) {
            activate = false;
            e.currentTarget.classList.remove("categ_outline_red");
            e.currentTarget.classList.add("categ_outline_gray");
            for (var key in this.GetOfferStep_2.attributes) {
              if (key == offer.key) {
                for (var i = 0; i < this.GetOfferStep_2.attributes[key].length; i++) {
                  if (values == this.GetOfferStep_2.attributes[key][i]) {
                    this.GetOfferStep_2.attributes[key].splice(i, 1);
                  }
                }
              }
            }
            for (var key in this.GetOfferStep_2PS.attributes) {
              if (key == offer.key) {
                for (var i = 0; i < this.GetOfferStep_2PS.attributes[key].length; i++) {
                  if (values == this.GetOfferStep_2PS.attributes[key][i]) {
                    this.GetOfferStep_2PS.attributes[key].splice(i, 1);
                  }
                }
              }
            }
          }
          else {
            if (offer.lastSelection == 'No Preference') {
              let elements = document.getElementsByClassName(`${offer.key}`);
              for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add("categ_outline_gray");
                elements[i].classList.remove("categ_outline_red");
              }
              this.Step2SelectedValues = this.Step2SelectedValues.filter(function (item) {
                return item !== undefined;
              });
              for (var i = 0; i < this.Step2SelectedValues.length; i++) {
                if (this.Step2SelectedValues[i].key == offer.key &&
                  (this.Step2SelectedValues[i].values == 'No Preference')) {
                  this.Step2SelectedValues[i].values = values;
                }
              }
              delete offer.lastSelection;
              this.GetOfferStep_2.attributes[offer.key] = [];
              this.GetOfferStep_2PS.attributes[offer.key] = []
            }
            e.currentTarget.classList.add("categ_outline_red");
            e.currentTarget.classList.remove("categ_outline_gray");
            this.GetOfferStep_2.attributes[offer.key].push(values);
            this.GetOfferStep_2PS.attributes[offer.key].push(values);
          }
        }
      }
      if (activate) {
        e.currentTarget.classList.add("categ_outline_red");
        e.currentTarget.classList.remove("categ_outline_gray");
      }
    }
    if (addSelected) {
      this.lastValueForAPI = offer.key;
      this.getoffers.getofferSubCategory(this.GetOfferStep_2).subscribe(res => {
        this.fromAPI = true;
        if (!window.localStorage['multiSelectAPI']) this.GetOfferStep_2.attributes = {};
        localStorage.removeItem("multiSelectAPI");
        this.getObjectFromOrderNo(res);
      });
    }
  }

  commonAsParent() {
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
    this.removeDuplicates(s2SValuesFinal);
    for (var i = 0; i < s2SValuesFinal.length; i++) {
      this.GetOfferStep_2PS.attributes[s2SValuesFinal[i].key] = s2SValuesFinal[i].values
    }
  }

  noPreferencesOther(offer, values, from?: any) {
    let proceed: boolean = false;
    let elements = document.getElementsByClassName(`${offer.key}`);
    for (var key in this.Step2SelectedValues) {
      if (this.Step2SelectedValues[key].key == offer.key) proceed = true;
    }
    if (from != 'others') {
      if (proceed) {
        for (var i = 0; i < this.Step2SelectedValues.length; i++) {
          let item = this.Step2SelectedValues[i];
          if (item.key == offer.key) {
            this.Step2SelectedValues[i].values = values
          }
        }
      }
      else {
        this.Step2SelectedValues.push({
          key: offer.key,
          values: values
        });
      }
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove("categ_outline_red");
        elements[i].classList.add("categ_outline_gray");
      }
    }
    else {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML == 'No Preference') {
          elements[i].classList.remove("categ_outline_red");
          elements[i].classList.add("categ_outline_gray");
          break;
        }
      }
      this.Step2SelectedValues.push({
        key: offer.key,
        values: values
      });
    }
  }

  removeDuplicates(s2SValuesFinal) {
    for (var i = 0; i < s2SValuesFinal.length; i++) {
      let val = Array.from(new Set(s2SValuesFinal[i].values));
      s2SValuesFinal[i].values = val;
    }
  }

  skip() {
    localStorage.removeItem('GetOfferStep_2');
    this.route.navigate(['/getoffer', 'step3']);
  }

  prev() {
    this.route.navigate(['/getoffer', 'step1']);
  };

  getOtherValue() {
    for (var i = 0; i < this.getObjectFromOrder.length; i++) {
      for (var key in this.GetOfferStep_2PS.attributes) {
        if (key == this.getObjectFromOrder[i].key && this.getObjectFromOrder[i].otherInput) {
          if (this.GetOfferStep_2PS.attributes[key].indexOf("Other") > -1 && this.GetOfferStep_2PS.attributes[key].length == 1) {
            this.GetOfferStep_2PS.attributes[key] = [];
          }
          if (this.GetOfferStep_2PS.attributes[key].indexOf("Other") > -1) {
            for (var j = 0; j < this.GetOfferStep_2PS.attributes[key].length; j++) {
              if (this.GetOfferStep_2PS.attributes[key][j] == 'Other') {
                this.GetOfferStep_2PS.attributes[key].splice(j, 1);
                break;
              }
            }
          }
          if (this.GetOfferStep_2PS.attributes[key].indexOf("No Preference") > -1 && this.GetOfferStep_2PS.attributes[key].length == 1) {
            this.GetOfferStep_2PS.attributes[key] = [];
          }
          if (this.GetOfferStep_2PS.attributes[key].indexOf("No Preference") > -1) {
            for (var j = 0; j < this.GetOfferStep_2PS.attributes[key].length; j++) {
              if (this.GetOfferStep_2PS.attributes[key][j] == 'No Preference') {
                this.GetOfferStep_2PS.attributes[key].splice(j, 1);
                break;
              }
            }
          }
          this.GetOfferStep_2PS.attributes[key].push(this.getObjectFromOrder[i].otherInputValue)
        }
      }
    }
  }

  next() {
    this.getOtherValue()
    window.localStorage['GetOfferPrice'] = JSON.stringify(this.getObjectFromOrder);
    window.localStorage['GetOfferStep_2'] = JSON.stringify(this.GetOfferStep_2PS)
    this.route.navigate(['/getoffer', 'step3']);
  };

}

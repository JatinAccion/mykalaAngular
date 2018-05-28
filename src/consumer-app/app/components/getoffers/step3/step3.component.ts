import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetOfferService } from '../../../services/getOffer.service';
import { CoreService } from '../../../services/core.service';
import { GetOfferModal } from '../../../../../models/getOffer.modal';
import { OfferInfo3 } from '../../../../../models/steps.modal';
import { regexPatterns } from '../../../../../common/regexPatterns';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step3Component implements OnInit {
  label: any;
  tooltip: any;
  tooltipEnabled: any;
  pageLabel: string;
  headerMessage: string;
  zipCodeRegex: '^\d{5}(?:[-\s]\d{4})?$';
  getOffer_orderInfo: FormGroup;
  inputNewLocation: boolean;
  fetchGeoCode: string;
  getCSC = [];
  showExistingLocation: boolean = false;
  existingLocation = [];
  loaderLocation: boolean = false;
  Step3Modal = new GetOfferModal();
  Step3SelectedValues = { price: { minPrice: "", maxPrice: "" }, location: [], delivery: "", instruction: "" };
  step2PriceData: any;
  viewSavedData;
  minPrice;
  maxPrice;
  loaderZipcodes: boolean = false;
  zipcodeRequired: boolean = false;
  enterZipcode: boolean = false;
  @ViewChild('selectValidationModal') selectValidationModal: ElementRef;
  validationMsg = { message: '', priceAvailable: false };

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private goService: GetOfferService,
    public core: CoreService
  ) {
    this.label = {
      visible: true,
      format: (value) => {
        return this.format(value);
      },
      position: "top"
    };
    this.tooltip = {
      enabled: true,
      format: (value) => {
        return this.format(value);
      },
      showMode: "always",
      position: "bottom"
    };
    this.tooltipEnabled = {
      enabled: true
    };
  }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    this.pageLabel = 'What\'s your budget and delivery preference for this item?';
    this.core.pageLabel(this.pageLabel);
    if (window.localStorage['GetOfferPrice'] != undefined) {
      let price;
      this.step2PriceData = JSON.parse(window.localStorage['GetOfferPrice']);
      for (var i = 0; i < this.step2PriceData.length; i++) {
        let item = this.step2PriceData[i];
        if (item.key == 'Price') {
          price = item.values;
          break;
        }
      }
      this.minPrice = price[0].split("-")[0];
      this.maxPrice = price[0].split("-")[1];
    }
    if (window.localStorage['userInfo'] === undefined) {
      this.existingLocation = [];
      this.showExistingLocation = false;
    }
    else {
      this.loaderZipcodes = true;
      let userData = JSON.parse(window.localStorage['userInfo'])
      this.existingLocation = [];
      this.goService.getExistingLocations(userData.userId).subscribe(res => {
        for (var i = 0; i < res.length; i++) {
          this.existingLocation.push({
            "zipcode": res[i].zipcode,
            "country": res[i].country,
            "city": res[i].city,
            "state": res[i].state
          });
        }
        this.loaderZipcodes = false;
        this.showExistingLocation = true;
        if (this.viewSavedData != undefined) {
          setTimeout(() => {
            this.getCSC = [];
            let deliveryLocation = document.getElementsByClassName("deliveryLocations")
            for (var i = 0; i < this.viewSavedData[0].location.length; i++) {
              let location = this.viewSavedData[0].location[i];
              for (var j = 0; j < deliveryLocation.length; j++) {
                if (location.zipcode == deliveryLocation[j].innerHTML) {
                  deliveryLocation[j].classList.add("categ_outline_red");
                  deliveryLocation[j].classList.remove("categ_outline_gray");
                  this.getCSC.push({
                    "zipcode": location.zipcode,
                    "country": location.country,
                    "state": location.state
                  });
                  break;
                }
              }
            }
          }, 500)
        }
      });
    }

    this.showExistingLocation = true;
    if (window.localStorage['GetOfferStep_3'] != undefined && window.localStorage['GetOfferStep_3'] != "") {
      this.viewSavedData = JSON.parse(window.localStorage['GetOfferStep_3']);
      for (var i = 0; i < this.viewSavedData.length; i++) {
        this.getOffer_orderInfo = this.formBuilder.group({
          "minPrice": [this.viewSavedData[i].priceRange.minPrice],
          "maxPrice": [this.viewSavedData[i].priceRange.maxPrice],
          "delivery": [this.viewSavedData[i].delivery],
          "zipCode": ['', Validators.compose([Validators.pattern(regexPatterns.zipcodeRegex), Validators.minLength(5), Validators.maxLength(5)])],
          "instruction": [this.viewSavedData[i].instruction]
        });
      }
    }
    else {
      this.getOffer_orderInfo = this.formBuilder.group({
        "minPrice": [this.minPrice],
        "maxPrice": [this.maxPrice],
        "delivery": [''],
        "zipCode": ['', Validators.compose([Validators.pattern(regexPatterns.zipcodeRegex), Validators.minLength(5), Validators.maxLength(5)])],
        "instruction": ['']
      });
    }
  };

  selectAddress(address, e) {
    this.enterZipcode = false;
    this.zipcodeRequired = false;
    this.getCSC = [];
    let elements = document.getElementsByClassName("deliveryLocations");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("categ_outline_red");
      elements[i].classList.add("categ_outline_gray")
    }
    e.currentTarget.classList.add("categ_outline_red");
    e.currentTarget.classList.remove("categ_outline_gray");
    this.getCSC.push({
      "zipcode": address.zipcode,
      "country": address.country,
      "state": address.state
    });
  }

  format(value) {
    return value + "%";
  };

  addNewLocation(e) {
    this.inputNewLocation = !this.inputNewLocation;
    if (this.inputNewLocation) e.currentTarget.innerHTML = "x";
    else {
      e.currentTarget.innerHTML = "+";
      this.enterZipcode = false;
    }
  };

  removeSelectedAddress() {
    let deliveryLocation = document.getElementsByClassName("deliveryLocations")
    for (var i = 0; i < deliveryLocation.length; i++) {
      if (deliveryLocation[i].classList.contains("categ_outline_red")) {
        deliveryLocation[i].classList.remove("categ_outline_red");
        deliveryLocation[i].classList.add("categ_outline_gray");
        break;
      }
    }
  }

  _keuyp(e) {
    this.zipcodeRequired = false;
    this.getCSC = [];
    this.fetchGeoCode = '';
    let input = e.currentTarget;
    this.removeSelectedAddress();
    if (this.getOffer_orderInfo.controls.zipCode.value.length == 5 && regexPatterns.zipcodeRegex.test(this.getOffer_orderInfo.controls.zipCode.value)) {
      this.enterZipcode = false;
      this.loaderLocation = true;
      input.setAttribute('readonly', true);
      this.goService.getLocation(this.getOffer_orderInfo.controls.zipCode.value)
        .subscribe(data => {
          let elements = document.getElementsByClassName("deliveryLocations");
          for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove("categ_outline_red");
            elements[i].classList.add("categ_outline_gray")
          }
          this.loaderLocation = false;
          input.removeAttribute('readonly');
          this.fetchGeoCode = data.results[0].formatted_address;
          this.getCSC.push({
            "zipcode": this.getOffer_orderInfo.controls.zipCode.value.trim(),
            "country": this.fetchGeoCode.split(',')[2].trim(),
            "state": this.fetchGeoCode.split(',')[1].trim().split(" ")[0].trim()
          });
        });
    }
    else {
      this.enterZipcode = true;
    }
  };

  skip() {
    window.localStorage['GetOfferStep_3'] = "";
    this.route.navigate(['/getoffer', 'step4']);
  };

  prev() {
    this.route.navigate(['/getoffer', 'step2']);
  };

  next() {
    if (!this.getOffer_orderInfo.controls.minPrice.value && !this.getOffer_orderInfo.controls.maxPrice.value) {
      this.validationMsg.message = "Min. and max. price range must be at least";
      this.validationMsg.priceAvailable = true;
      this.core.openModal(this.selectValidationModal);
    }
    else if (this.getOffer_orderInfo.controls.minPrice.value < parseFloat(this.minPrice) || !this.getOffer_orderInfo.controls.minPrice.value) {
      this.validationMsg.message = "Please enter a minimum price range of at least";
      this.validationMsg.priceAvailable = true;
      this.core.openModal(this.selectValidationModal);
    }
    else if (this.getCSC.length == 0) {
      this.validationMsg.message = "Please select or enter your delivery Zip Code";
      this.validationMsg.priceAvailable = false;
      this.core.openModal(this.selectValidationModal);
    }
    else {
      if (this.getOffer_orderInfo.controls.delivery.value == "") this.Step3SelectedValues.delivery = "No Preference";
      else this.Step3SelectedValues.delivery = this.getOffer_orderInfo.controls.delivery.value;
      this.Step3SelectedValues.location = this.getCSC;
      this.Step3SelectedValues.price.minPrice = this.getOffer_orderInfo.controls.minPrice.value;
      this.Step3SelectedValues.price.maxPrice = this.getOffer_orderInfo.controls.maxPrice.value;
      this.Step3SelectedValues.instruction = this.getOffer_orderInfo.controls.instruction.value;
      this.Step3Modal.getoffer_3 = new Array<OfferInfo3>();
      this.Step3Modal.getoffer_3.push(new OfferInfo3(this.Step3SelectedValues.price, this.Step3SelectedValues.delivery, this.Step3SelectedValues.instruction, this.Step3SelectedValues.location))
      window.localStorage['GetOfferStep_3'] = JSON.stringify(this.Step3Modal.getoffer_3);
      this.route.navigate(['/getoffer', 'step4']);
    }
  };

}

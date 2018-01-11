import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { GetOfferService } from '../../../services/getOffer.service';
import { CoreService } from '../../../services/core.service';
import { GetOfferModal } from '../../../../../models/getOffer.modal';
import { OfferInfo3 } from '../../../../../models/steps.modal';

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
  Step3SelectedValues = { priceRange: { minPrice: "", maxPrice: "" }, location: [], delivery: "", instruction: "" };
  viewSavedData;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private goService: GetOfferService,
    private core: CoreService
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
    if (window.localStorage['userInfo'] === undefined) this.showExistingLocation = false;
    else {
      this.goService.getExistingLocations().subscribe(res => {
        this.existingLocation.push({
          "zipcode": res.consumerAddress.zipcode,
          "country": res.consumerAddress.country,
          "state": res.consumerAddress.state
        });
        this.showExistingLocation = true;
        console.log(this.existingLocation);
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
          "zipCode": ['', Validators.compose([Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])],
          "instruction": [this.viewSavedData[i].instruction]
        });
      }
    }
    else {
      this.getOffer_orderInfo = this.formBuilder.group({
        "minPrice": ['0'],
        "maxPrice": ['100'],
        "delivery": [''],
        "zipCode": ['', Validators.compose([Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])],
        "instruction": ['']
      });
    }
  };

  format(value) {
    return value + "%";
  };

  addNewLocation(e) {
    this.inputNewLocation = !this.inputNewLocation;
    if (this.inputNewLocation) e.currentTarget.innerHTML = "x";
    else e.currentTarget.innerHTML = "+";
  };

  _keuyp(e) {
    this.getCSC = [];
    this.fetchGeoCode = '';
    let input = e.currentTarget;
    if (this.getOffer_orderInfo.controls.zipCode.value.length == 5) {
      this.loaderLocation = true;
      input.setAttribute('readonly', true);
      this.goService.getLocation(this.getOffer_orderInfo.controls.zipCode.value)
        .subscribe(data => {
          this.loaderLocation = false;
          input.removeAttribute('readonly');
          this.fetchGeoCode = data.results[0].formatted_address;
          console.log(this.fetchGeoCode);
          this.getCSC.push({
            "zipcode": this.getOffer_orderInfo.controls.zipCode.value,
            "country": this.fetchGeoCode.split(',')[2],
            "state": this.fetchGeoCode.split(',')[1].trim().split(" ")[0]
          });
        });
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
    if (this.getCSC.length == 0) this.getCSC = this.existingLocation;
    this.Step3SelectedValues.location = this.getCSC;
    this.Step3SelectedValues.priceRange.minPrice = this.getOffer_orderInfo.controls.minPrice.value;
    this.Step3SelectedValues.priceRange.maxPrice = this.getOffer_orderInfo.controls.maxPrice.value;
    this.Step3SelectedValues.delivery = this.getOffer_orderInfo.controls.delivery.value;
    this.Step3SelectedValues.instruction = this.getOffer_orderInfo.controls.instruction.value;
    this.Step3Modal.getoffer_3 = new Array<OfferInfo3>();
    this.Step3Modal.getoffer_3.push(new OfferInfo3(this.Step3SelectedValues.priceRange, this.Step3SelectedValues.delivery, this.Step3SelectedValues.instruction, this.Step3SelectedValues.location))
    window.localStorage['GetOfferStep_3'] = JSON.stringify(this.Step3Modal.getoffer_3);
    this.route.navigate(['/getoffer', 'step4']);
  };

}

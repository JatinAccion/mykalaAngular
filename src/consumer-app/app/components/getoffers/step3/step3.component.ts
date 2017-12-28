import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetOfferModal } from '../getOffer.modal';
import { OfferInfo3 } from '../steps.modal';
import { GetOfferService } from '../../../services/getOffer.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step3Component implements OnInit {
  zipCodeRegex: '^\d{5}(?:[-\s]\d{4})?$';
  getOffer_orderInfo: FormGroup;
  inputNewLocation: boolean;
  fetchGeoCode: string;
  getCSC = [];
  loaderLocation: boolean = false;
  Step3Modal = new GetOfferModal();
  Step3SelectedValues = { priceRange: { minPrice: "", maxPrice: "" }, location: [], delivery: "", instruction: "" };
  viewSavedData;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private goService: GetOfferService
  ) { }

  ngOnInit() {
    if (window.localStorage['GetOfferStep_3'] != undefined) {
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
        "minPrice": [''],
        "maxPrice": [''],
        "delivery": [''],
        "zipCode": ['', Validators.compose([Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])],
        "instruction": ['']
      });
    }
  };

  addNewLocation(e) {
    this.inputNewLocation = !this.inputNewLocation;
    if (this.inputNewLocation) e.currentTarget.innerHTML = "x";
    else e.currentTarget.innerHTML = "+";
  }

  /*Geocode API Integration*/
  _keuyp(e) {
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
          })
        });
    }
  };

  prev() {
    //this.route.navigate(['/getoffer', 'step2']);
  };

  next() {
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

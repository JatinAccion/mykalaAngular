// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';

import { RetialerService } from '../retialer.service';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import {
  RetialerShippingProfile,
  ShippingDeliveryTier,
  RetailerAddress,
  ShippingLocations,
  ShippingSubLocation,  
  RetailerShippingMethodFee
} from '../../../../../models/retailer-shipping-profile';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';


@Component({
  selector: 'app-retailer-add-shipping',
  templateUrl: './retailer-add-shipping.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddShippingComponent implements OnInit {
  // #region declarations
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  currentOrientation = 'horizontal';
  currentJustify = 'start';
  currentTabIndex = 0;
  @Output() SaveData = new EventEmitter<any>();
  @Input() retailerId: number;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  // #region Shipping
  shippings = new Array<RetialerShippingProfile>();
  shippingFG1 = new FormGroup({});
  shippingFG2 = new FormGroup({});
  shippingFG3 = new FormGroup({});
  step = 1;
  shippingObj = new RetialerShippingProfile();
  errorMsgs = inputValidations;
  saveLoader = true;
  tiers = new Array<ShippingDeliveryTier>();
  modified = true;

  // #endregion Shipping

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
    this.shippingObj = new RetialerShippingProfile();
  }
  ngOnInit() {
    this.addShipping();
    this.shippingObj = this.shippings[0];
    this.setValidators();
  }

  addShipping() {
    if (this.modified) {
      // alert('Please save first');
      const shipping = new RetialerShippingProfile();
      // shipping.shippingProfile.deliveryOption = 'freeshipping';
      shipping.shipLocations.countryName = 'US';
      this.shippings.push(shipping);
    } else {
      this.shippings.push(new RetialerShippingProfile());
    }
  }
  setActiveTab(event) {
    // if (this.modified) {
    //   alert('Please save first');
    //   event.preventDefault();
    // } else {
    this.readShipping();
    this.currentTabIndex = event.nextId.replace('tab-shipping', '');
    this.setShipping();
    // }
  }
  deliveryOptionsChange() {
    switch (this.shippingFG1.controls.deliveryOptions.value) {
      case 'freeshipping':
        this.shippingFG1.controls.tiers = this.formBuilder.array([]);
        break;
      case 'ship_by_size':
        this.shippingFG1.controls.tiers = this.createSizeBasedTiers();
        break;
      case 'ship_by_flat_rate':
      case 'ship_by_price':
      case 'ship_by_weight':
      default:
        this.shippingFG1.controls.tiers = this.formBuilder.array([this.createTier()]);
        break;
    }
  }
  addTier() {
    const tiers = this.shippingFG1.get('tiers') as FormArray;
    let length = 0;
    if (tiers !== null) {
      length = tiers.length;
    }
    tiers.push(this.createTier('Tier' + ++length, length - 1));
  }
  removeTier() {
    const tiers = this.shippingFG1.get('tiers') as FormArray;
    tiers.removeAt(tiers.length - 1);
  }
  createSizeBasedTiers() {
    return this.formBuilder.array([
      this.createTier('Letter', 0),
      this.createTier('Small', 1),
      this.createTier('Medium', 2),
      this.createTier('Large', 3),
      this.createTier('Oversized', 4),
      this.createTier('Irregular', 5),
    ]);
  }
  createTier(tierName?: string, sequence?: number, minValue?: number, maxValue?: number) {
    if (!tierName) { tierName = 'Tier' + 1; }
    return this.formBuilder.group({
      name: [tierName, [Validators.required]],
      sequence: sequence ? sequence : 0,
      min: [minValue ? minValue : 0.00, [Validators.min(0.00), Validators.max(10000.00), Validators.required]],
      max: [maxValue ? maxValue : 0.00, [Validators.min(0.00), Validators.max(10000.00), Validators.required]],
    });
  }
  createShippingMethods(shippingMethodId, shippingName) {
    const fg = this.formBuilder.group({
      shippingMethodId: shippingMethodId,
      shippingName: shippingName,
      selected: false,
      disabled: false,
      charges: this.formBuilder.array([])
    });
    if (this.shippingObj.deliveryTiers !== null) {
      this.shippingObj.deliveryTiers.forEach(ele => {
        (fg.get('charges') as FormArray).push(this.formBuilder.group({
          tierName: ele.tierName,
          charge: [ele.shippingMethod && ele.shippingMethod[shippingMethodId] ? ele.shippingMethod[shippingMethodId].deliveryFee : 0.00
            , [Validators.min(0), Validators.max(10000), Validators.required]],
        }));
      });
    }
    return fg;
  }
  createShippingLocation(locationName, locationType, locationStatus?, locationFee?) {
    return this.formBuilder.group({
      locationName: locationName,
      locationType: locationType,
      locationStatus: locationStatus,
      locationFee: [locationFee, [Validators.min(0), Validators.max(10000), Validators.required]],
    });

  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }
  setValidators() {
    if (this.shippingObj.deliveryTiers.length === 0) {
      const deliveryTier = new ShippingDeliveryTier();
      deliveryTier.tierName = 'Tier' + 1;
      deliveryTier.sequence = 0;
      deliveryTier.minValue = 0;
      deliveryTier.maxValue = 0;
      this.shippingObj.deliveryTiers.push(deliveryTier);
    }
    if (!this.shippingObj.shipLocations.locationInclude || this.shippingObj.shipLocations.locationInclude.length === 0) {
      this.shippingObj.shipLocations.locationInclude = new Array<ShippingSubLocation>();
      const sublocation1 = new ShippingSubLocation();
      sublocation1.locationName = 'Continental US';
      sublocation1.locationType = 'state';
      sublocation1.locationStatus = true;
      sublocation1.locationFee = 0;
      this.shippingObj.shipLocations.locationInclude.push(sublocation1);
      const sublocation2 = new ShippingSubLocation();
      sublocation2.locationName = 'Alaska and Hawaii';
      sublocation2.locationType = 'state';
      sublocation2.locationStatus = true;
      sublocation2.locationFee = 0;
      this.shippingObj.shipLocations.locationInclude.push(sublocation2);
      const sublocation3 = new ShippingSubLocation();
      sublocation3.locationName = 'US Protectorates';
      sublocation3.locationType = 'territory';
      sublocation3.locationStatus = true;
      sublocation3.locationFee = 0;
      this.shippingObj.shipLocations.locationInclude.push(sublocation3);
    }
    this.shippingFG1 = this.formBuilder.group({
      profileName: [this.shippingObj.profileName,
      [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      deliveryOptions: [this.shippingObj.deliveryOption, [Validators.maxLength(255), Validators.required]],
      tiers: this.formBuilder.array([])
    });
    this.shippingObj.deliveryTiers.forEach(ele => {
      (this.shippingFG1.controls.tiers as FormArray).push(this.createTier(ele.tierName, ele.sequence, ele.minValue, ele.maxValue));
    });
    this.setValidatorsFG2();
    this.shippingFG3 = this.formBuilder.group({
      addressLine1: [this.shippingObj.shipOriginAddress.addressLine1, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.shippingObj.shipOriginAddress.addressLine2, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: [this.shippingObj.shipOriginAddress.city, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.shippingObj.shipOriginAddress.state, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.shippingObj.shipOriginAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberValueRegex), Validators.required]],
      countryName: [this.shippingObj.shipLocations.countryName, [Validators.required]],
      locationInclude: this.formBuilder.array([])
    });
    this.shippingObj.shipLocations.locationInclude.forEach(ele => {
      (this.shippingFG3.controls.locationInclude as FormArray).push(this.createShippingLocation(ele.locationName, ele.locationType, ele.locationStatus, ele.locationFee));
    });
    this.shippingFG1.controls.deliveryOptions.valueChanges.subscribe(() => {
      this.deliveryOptionsChange();
    });
    this.shippingFG1.valueChanges.subscribe(() => {
      this.modified = true;
    });
    this.shippingFG2.valueChanges.subscribe(() => {
      this.modified = true;
    });
    this.shippingFG3.valueChanges.subscribe(() => {
      this.modified = true;
    });
  }
  setValidatorsFG2() {
    this.shippingFG2 = this.formBuilder.group({
      shippingMethods: this.formBuilder.array([
        this.createShippingMethods(0, 'Next day: 1 business day shipping'),
        this.createShippingMethods(1, '2 day: 2 business day shipping'),
        this.createShippingMethods(2, 'Express: 3 to 5 business days'),
        this.createShippingMethods(3, 'Standard: 5 to 8 business days'),
        this.createShippingMethods(4, 'Custom')
      ])
    });
  }
  shippingNext() {
    this.step++;
    this.readShipping();
    if (this.step === 2) { this.setValidatorsFG2(); }
    if (this.step === 4) { this.step = 3; }
  }
  shippingBack() {
    this.step--;
    if (this.step === 0) { this.step = 1; }
  }
  saveShipping() {
    this.readShipping();
    this.validatorExt.validateAllFormFields(this.shippingFG1);
    this.validatorExt.validateAllFormFields(this.shippingFG2);
    this.validatorExt.validateAllFormFields(this.shippingFG3);
    if (!this.shippingFG1.valid) { this.step = 1; } else
      if (!this.shippingFG2.valid) { this.step = 2; } else
        if (!this.shippingFG3.valid) { this.step = 3; } else {
          this.readShipping();
          this.saveLoader = true;
          this.retialerService
            .saveShipping(this.shippingObj)
            .then(res => {
              this.shippingObj.retailerId = this.retailerId;
              this.SaveData.emit('tab-Shipping');
              this.modified = false;
              this.alert = {
                id: 1,
                type: 'success',
                message: 'Saved successfully',
                show: true
              };
              this.saveLoader = false;
              return true;
            })
            .catch(err => {
              console.log(err);
              this.alert = {
                id: 1,
                type: 'danger',
                message: 'Not able to Save',
                show: true
              };
            });
        }
    return false;
  }
  readShipping() {
    this.shippingObj.retailerId = this.retailerId;
    this.shippingObj.sequence = this.currentTabIndex;
    this.shippingObj.profileName = this.shippingFG1.value.profileName;
    this.shippingObj.deliveryOption = this.shippingFG1.value.deliveryOptions;
    this.shippingObj.shipOriginAddress = new RetailerAddress();
    this.shippingObj.shipOriginAddress.addressLine1 = this.shippingFG3.value.addressLine1;
    this.shippingObj.shipOriginAddress.addressLine2 = this.shippingFG3.value.addressLine2;
    this.shippingObj.shipOriginAddress.city = this.shippingFG3.value.city;
    this.shippingObj.shipOriginAddress.state = this.shippingFG3.value.state;
    this.shippingObj.shipOriginAddress.zipcode = this.shippingFG3.value.zipcode;

    this.shippingObj.shipLocations = new ShippingLocations();
    this.shippingObj.shipLocations.countryName = this.shippingFG3.value.countryName;
    this.shippingObj.shipLocations.locationInclude = new Array<ShippingSubLocation>();
    (this.shippingFG3.get('locationInclude') as FormArray).controls.forEach(ele => {
      const locationInclude = new ShippingSubLocation();
      locationInclude.locationName = ele.value.locationName;
      locationInclude.locationType = ele.value.locationType;
      locationInclude.locationStatus = ele.value.locationStatus;
      locationInclude.locationFee = ele.value.locationFee;
      this.shippingObj.shipLocations.locationInclude.push(locationInclude);
    });
    this.shippingObj.deliveryTiers = new Array<ShippingDeliveryTier>();
    let tierSequence = 0;
    (this.shippingFG1.get('tiers') as FormArray).controls.forEach(ele => {
      const deliveryTier = new ShippingDeliveryTier();
      deliveryTier.tierName = ele.value.name;
      deliveryTier.minValue = ele.value.min;
      deliveryTier.maxValue = ele.value.max;
      deliveryTier.sequence = tierSequence;
      deliveryTier.shippingMethod = new Array<RetailerShippingMethodFee>();
      (this.shippingFG2.get('shippingMethods') as FormArray).controls.forEach(subElement => {
        const fee = new RetailerShippingMethodFee();
        fee.shipMethodId = subElement.value.shipppingMethodId;
        fee.shipMethodName = subElement.value.shippingName;
        fee.deliveryFee = (subElement.get('charges') as FormArray).length > tierSequence ?
          (subElement.get('charges') as FormArray).at(tierSequence).value.charge : 0;
        deliveryTier.shippingMethod.push(fee);
      });
      this.shippingObj.deliveryTiers.push(deliveryTier);
      tierSequence++;

    });
    this.shippings[this.currentTabIndex] = this.shippingObj;
    return this.shippingObj;
  }
  setShipping() {
    this.shippingObj = this.shippings[this.currentTabIndex];
    this.step = 1;
    this.setValidators();
  }
  paymentOptionClick( $event) {
    $event.stopPropagation();
    return false;
  }
}

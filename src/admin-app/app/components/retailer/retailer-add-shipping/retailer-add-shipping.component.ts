// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';

import { RetialerService } from '../retialer.service';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import {
  RetialerShippingProfile,
  ShippingDeliveryTier,
  ShippingOriginAddress,
  DeliveryLocation,
  Location,
  RetailerDeliveryMethodFee
} from '../../../../../models/retailer-shipping-profile';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';
import { CoreService } from '../../../services/core.service';


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
  @Input() retailerId: string;
  @Input() shippingsData: Array<RetialerShippingProfile>;
  @Output() shippingsDataChange = new EventEmitter<Array<RetialerShippingProfile>>();

  // #region Shipping
  shippings = new Array<RetialerShippingProfile>();
  shippingFG1 = new FormGroup({});
  shippingFG2 = new FormGroup({});
  shippingFG3 = new FormGroup({});
  shippingObj = new RetialerShippingProfile();
  errorMsgs = inputValidations;
  saveLoader = true;
  tiers = new Array<ShippingDeliveryTier>();
  modified = true;
  deliveryMethodCustomName = '';
  // #endregion Shipping

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt,
    private core: CoreService
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
      const shipping = new RetialerShippingProfile();
      shipping.deliveryLocation.countryName = 'USA';
      this.shippings.push(shipping);
    } else {
      const shipping = new RetialerShippingProfile();
      shipping.deliveryLocation.countryName = 'USA';
      this.shippings.push(shipping);
    }
  }
  setActiveTab(event) {
    // if (this.modified) {
    //   alert('Please save first');
    //   event.preventDefault();
    // } else {
    this.readShipping();
    this.currentTabIndex = parseInt(event.nextId.replace('tab-shipping', ''), 2);
    this.setShipping();
    // }
  }
  setShipping() {
    this.shippingObj = this.shippings[this.currentTabIndex];
    // this.shippingObj.step = 1;
    this.setValidators();
  }
  shippingNextProfile() {
    if (this.currentTabIndex + 1 === this.shippings.length) {
      this.ngbTabSet.select('tab-shipping' + 0);
    } else {
      this.ngbTabSet.select('tab-shipping' + (this.currentTabIndex + 1));
    }

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
      selected: shippingName !== 'Custom',
      disabled: false,
      charges: this.formBuilder.array([])
    });
    if (this.shippingObj.deliveryTiers !== null) {
      this.shippingObj.deliveryTiers.forEach(ele => {
        (fg.get('charges') as FormArray).push(this.formBuilder.group({
          tierName: ele.tierName,
          charge: [ele.deliveryMethods && ele.deliveryMethods[shippingMethodId] ? ele.deliveryMethods[shippingMethodId].deliveryFee : 0.00
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

  setValidators() {
    if (this.shippingObj.deliveryTiers.length === 0) {
      const deliveryTier = new ShippingDeliveryTier();
      deliveryTier.tierName = 'Tier' + 1;
      deliveryTier.sequence = 0;
      deliveryTier.minValue = 0;
      deliveryTier.maxValue = 0;
      this.shippingObj.deliveryTiers.push(deliveryTier);
    }
    if (!this.shippingObj.deliveryLocation.locations || this.shippingObj.deliveryLocation.locations.length === 0) {
      this.shippingObj.deliveryLocation.locations = new Array<Location>();
      const sublocation1 = new Location();
      sublocation1.locationName = 'Continental US';
      sublocation1.locationType = 'state';
      sublocation1.locationStatus = true;
      sublocation1.locationFee = 0;
      this.shippingObj.deliveryLocation.locations.push(sublocation1);
      const sublocation2 = new Location();
      sublocation2.locationName = 'Alaska and Hawaii';
      sublocation2.locationType = 'state';
      sublocation2.locationStatus = true;
      sublocation2.locationFee = 0;
      this.shippingObj.deliveryLocation.locations.push(sublocation2);
      const sublocation3 = new Location();
      sublocation3.locationName = 'US Protectorates';
      sublocation3.locationType = 'territory';
      sublocation3.locationStatus = true;
      sublocation3.locationFee = 0;
      this.shippingObj.deliveryLocation.locations.push(sublocation3);
    }
    this.shippingFG1 = this.formBuilder.group({
      shippingProfileName: [this.shippingObj.shippingProfileName,
      [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      deliveryOptions: [this.shippingObj.deliveryOption, [Validators.maxLength(255), Validators.required]],
      tiers: this.formBuilder.array([])
    });
    this.shippingObj.deliveryTiers.forEach(ele => {
      (this.shippingFG1.controls.tiers as FormArray).push(this.createTier(ele.tierName, ele.sequence, ele.minValue, ele.maxValue));
    });
    this.setValidatorsFG2();
    this.shippingFG3 = this.formBuilder.group({
      addressLine1: [this.shippingObj.shippingOriginAddress.addressLine1, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.shippingObj.shippingOriginAddress.addressLine2, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: [this.shippingObj.shippingOriginAddress.city, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.shippingObj.shippingOriginAddress.state, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.shippingObj.shippingOriginAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberValueRegex), Validators.required]],
      countryName: [this.shippingObj.deliveryLocation.countryName, [Validators.required]],
      locations: this.formBuilder.array([])
    });
    this.shippingObj.deliveryLocation.locations.forEach(ele => {
      (this.shippingFG3.controls.locations as FormArray).push(this.createShippingLocation(ele.locationName, ele.locationType, ele.locationStatus, ele.locationFee));
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
    this.readShipping();
    if (this.shippingObj.step === 1) {
      this.validatorExt.validateAllFormFields(this.shippingFG1);
      if (this.shippingFG1.valid) { this.shippingObj.step++; }
    } else if (this.shippingObj.step === 2) {
      this.validatorExt.validateAllFormFields(this.shippingFG2);
      if (this.validateShippingFG2()) { this.shippingObj.step++; } else { this.core.message.info('Atleast one shipping method need to be selected'); }
    }
    // if (this.shippingObj.step === 2) { this.setValidatorsFG2(); }
    if (this.shippingObj.step === 4) { this.shippingObj.step = 3; }
  }
  shippingBack() {
    this.shippingObj.step--;
    if (this.shippingObj.step === 0) { this.shippingObj.step = 1; }
  }
  validateShippingFG2() {
    return (this.shippingFG2.get('shippingMethods') as FormArray).controls.filter(p => p.get('selected').value == true).length > 0;
  }
  saveShipping() {
    this.readShipping();
    this.validatorExt.validateAllFormFields(this.shippingFG1);
    this.validatorExt.validateAllFormFields(this.shippingFG2);
    this.validatorExt.validateAllFormFields(this.shippingFG3);

    if (!this.shippingFG1.valid) { this.shippingObj.step = 1; } else
      if (!this.validateShippingFG2()) { this.shippingObj.step = 2; this.core.message.info('Atleast one shipping method need to be selected') } else
        if (!this.shippingFG3.valid) { this.shippingObj.step = 3; } else {
          this.readShipping();
          this.saveLoader = true;
          this.retialerService
            .saveShipping(this.shippingObj)
            .then(res => {
              this.shippingObj.retailerId = this.retailerId;
              this.SaveData.emit('tab-Shipping');
              this.modified = false;
              this.core.message.success('Shipping Info Saved');
              this.saveLoader = false;
              return true;
            })
            .catch(err => {
              this.core.message.success('Shipping Info Saved');
              this.saveLoader = false;
            });
        }
    return false;
  }
  readShipping() {
    this.shippingObj.retailerId = this.retailerId;
    this.shippingObj.sequence = this.currentTabIndex;
    this.shippingObj.shippingProfileName = this.shippingFG1.value.shippingProfileName;
    this.shippingObj.deliveryOption = this.shippingFG1.value.deliveryOptions;
    this.shippingObj.shippingOriginAddress = new ShippingOriginAddress();
    this.shippingObj.shippingOriginAddress.addressLine1 = this.shippingFG3.value.addressLine1;
    this.shippingObj.shippingOriginAddress.addressLine2 = this.shippingFG3.value.addressLine2;
    this.shippingObj.shippingOriginAddress.city = this.shippingFG3.value.city;
    this.shippingObj.shippingOriginAddress.state = this.shippingFG3.value.state;
    this.shippingObj.shippingOriginAddress.zipcode = this.shippingFG3.value.zipcode;

    this.shippingObj.deliveryLocation = new DeliveryLocation();
    this.shippingObj.deliveryLocation.countryName = this.shippingFG3.value.countryName;
    this.shippingObj.deliveryLocation.locations = new Array<Location>();
    (this.shippingFG3.get('locations') as FormArray).controls.forEach(ele => {
      const locations = new Location();
      locations.locationName = ele.value.locationName;
      locations.locationType = ele.value.locationType;
      locations.locationStatus = ele.value.locationStatus;
      locations.locationFee = ele.value.locationFee;
      this.shippingObj.deliveryLocation.locations.push(locations);
    });
    this.shippingObj.deliveryTiers = new Array<ShippingDeliveryTier>();
    let tierSequence = 0;
    (this.shippingFG1.get('tiers') as FormArray).controls.forEach(ele => {
      const deliveryTier = new ShippingDeliveryTier();
      deliveryTier.tierName = ele.value.name;
      deliveryTier.minValue = ele.value.min;
      deliveryTier.maxValue = ele.value.max;
      deliveryTier.sequence = tierSequence;
      deliveryTier.deliveryMethods = new Array<RetailerDeliveryMethodFee>();
      (this.shippingFG2.get('shippingMethods') as FormArray).controls.forEach(subElement => {
        const fee = new RetailerDeliveryMethodFee();
        fee.deliveryMethodName = subElement.value.shippingName;
        if (subElement.value.shippingName === 'Custom') {
          fee.deliveryMethodName = this.deliveryMethodCustomName;
        }
        fee.deliveryFee = (subElement.get('charges') as FormArray).length > tierSequence ?
          (subElement.get('charges') as FormArray).at(tierSequence).value.charge : 0;
        deliveryTier.deliveryMethods.push(fee);
      });
      this.shippingObj.deliveryTiers.push(deliveryTier);
      tierSequence++;

    });
    this.shippings[this.currentTabIndex] = this.shippingObj;
    return this.shippingObj;
  }

  paymentOptionClick($event, ctrl) {
    // ctrl.patchValue(ctrl.value);
    const val = (this.shippingFG2.get('shippingMethods') as FormArray).controls[0].get('selected').value;
    (this.shippingFG2.get('shippingMethods') as FormArray).controls[0].get('selected').patchValue(!val);
    $event.stopPropagation();
    $event.preventDefault();
    // return false;
  }
  setoptionSelected($event, index) {
    const val = (this.shippingFG2.get('shippingMethods') as FormArray).controls[index].get('selected').value;
    (this.shippingFG2.get('shippingMethods') as FormArray).controls[index].get('selected').patchValue(!val);
    $event.stopPropagation();
    $event.preventDefault();
  }
}

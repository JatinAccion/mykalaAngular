// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';

import { RetialerService } from '../retialer.service';
import { RetailerBusinessAddress } from '../../../../../models/retailer-business-adress';
import {
  RetialerShippingProfile,
  ShippingDeliveryTier,
  ShippingOriginAddress,
  DeliveryLocation,
  Location,
  RetailerDeliveryMethodFee,
  RetialerShippingProfiles, shippingMethods, location
} from '../../../../../models/retailer-shipping-profile';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';


@Component({
  selector: 'app-retailer-add-shipping',
  templateUrl: './retailer-add-shipping.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddShippingComponent implements OnInit {
  states: string[];
  // #region declarations
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  currentOrientation = 'horizontal';
  currentJustify = 'start';
  currentTabIndex = 0;
  @Output() SaveData = new EventEmitter<any>();
  @Input() retailerId: string;
  @Input() shippingsData: RetialerShippingProfiles;
  @Output() shippingsDataChange = new EventEmitter<RetialerShippingProfiles>();

  // #region Shipping
  shippings = new RetialerShippingProfiles();
  shippingFG1 = new FormGroup({});
  shippingFG2 = new FormGroup({});
  shippingFG3 = new FormGroup({});
  shippingObj = new RetialerShippingProfile();
  errorMsgs = inputValidations;
  saveLoader = false;
  tiers = new Array<ShippingDeliveryTier>();
  modified = true;
  deliveryMethodCustomName = '';
  freeshipping = 'freeshipping';
  // #endregion Shipping

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
    // this.shippingObj = new RetialerShippingProfile();
  }
  ngOnInit() {
    this.addShipping();
    this.getStates();
    this.shippingObj = this.shippings.shippings[0] || new RetialerShippingProfile();
    this.setValidators();
    if (this.retailerId) {
      this.getShippingProfiles(this.retailerId);
    }
  }
  getShippingProfiles(retailerId: string) {
    this.retialerService
      .shippingProfileGet(this.retailerId)
      .subscribe((res: RetialerShippingProfiles) => {
        this.shippingsData = res;
        // this.setValidators();
        this.shippings = res;
        if (this.shippings.shippings.length === 0) {
          this.addShipping();
        }
        this.currentTabIndex = 0;
        this.setShipping();
      });
  }
  addShipping() {
    if (this.modified) {
      const shipping = new RetialerShippingProfile();
      shipping.deliveryLocation = new DeliveryLocation();
      this.shippings.shippings.push(shipping);
    } else {
      const shipping = new RetialerShippingProfile();
      shipping.deliveryLocation = new DeliveryLocation();
      this.shippings.shippings.push(shipping);
    }
  }
  removeShipping(event) {
    if (this.currentTabIndex === this.shippings.shippings.length - 1) {
      this.currentTabIndex = 0;
      this.setShipping();
    }
    if (!this.shippings.shippings[this.shippings.shippings.length - 1].shippingProfileId) {
      this.shippings.shippings.pop();
    }
    event.stopPropagation();
    event.preventDefault();
  }
  setActiveTab(event) {
    this.readShipping();
    this.currentTabIndex = parseInt(event.nextId.replace('tab-shipping', ''), 0);
    this.setShipping();
  }
  setShipping() {
    this.shippingObj = this.shippings.shippings[this.currentTabIndex];
    this.setValidators();
  }
  shippingNextProfile() {
    // if (this.currentTabIndex + 1 === this.shippings.shippings.length) {
    this.readShipping();
    this.SaveData.emit('tab-Shipping');
    // } else {
    // this.ngbTabSet.select('tab-shipping' + (this.currentTabIndex + 1));
    // }

  }
  deliveryOptionsChange() {
    switch (this.shippingFG1.controls.deliveryOptions.value) {
      case userMessages.deliveryOptions.freeshipping:
        this.shippingFG1.controls.tiers = this.formBuilder.array([this.createTier(this.freeshipping, 0, -1)]);
        break;
      case userMessages.deliveryOptions.ship_by_size:
        this.shippingFG1.controls.tiers = this.createSizeBasedTiers();
        break;
      case userMessages.deliveryOptions.ship_by_flat_rate:
      case userMessages.deliveryOptions.ship_by_price:
      case userMessages.deliveryOptions.ship_by_weight:
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
      // this.createTier('Letter', 0),
      this.createTier('Small', 1),
      this.createTier('Medium', 2),
      this.createTier('Large', 3),
      this.createTier('Oversized', 4),
      // this.createTier('Irregular', 5),
    ]);
  }
  createTier(tierName?: string, sequence?: number, minValue: number = 0.00, maxValue: number = 0.00) {
    if (!tierName) { tierName = 'Tier' + 1; }
    let isRequired = true;
    if (minValue && minValue < 0) {
      isRequired = false;
    }
    return this.formBuilder.group({
      name: [tierName, [Validators.required]],
      sequence: sequence ? sequence : 0,
      min: [minValue > 0 ? minValue : 0.00, [Validators.min(0), Validators.max(10000.00), this.validatorExt.getRV(isRequired)]],
      max: [maxValue, [Validators.min(0), Validators.max(10000.00), this.validatorExt.getRV(isRequired)]],
    });
  }
  createShippingMethods(shippingMethodId, shippingName, selected = true) {
    const fg = this.formBuilder.group({
      shippingMethodId: shippingMethodId,
      shippingName: shippingName,
      selected: selected,
      disabled: false,
      charges: this.formBuilder.array([])
    });
    if (this.shippingObj.deliveryTiers !== null) {
      this.shippingObj.deliveryTiers.forEach(ele => {
        let deliveryMethod = new RetailerDeliveryMethodFee();
        if (shippingName !== 'Custom' && ele.deliveryMethods && ele.deliveryMethods.filter(p => p.deliveryMethodName === shippingName).length > 0) {
          deliveryMethod = ele.deliveryMethods.filter(p => p.deliveryMethodName === shippingName)[0];
        }
        if (shippingName === 'Custom' && ele.deliveryMethods && ele.deliveryMethods.length > 0) {
          ele.deliveryMethods.forEach(p => {
            if (p.deliveryMethodName !== shippingMethods.Nextday1businessdayshipping &&
              p.deliveryMethodName !== shippingMethods.twoday2businessdayshipping &&
              p.deliveryMethodName !== shippingMethods.Express3to5businessdays &&
              p.deliveryMethodName !== shippingMethods.Standard5to8businessdays
            ) {
              deliveryMethod = p;
            }
          });
          this.deliveryMethodCustomName = deliveryMethod.deliveryMethodName;
        }
        (fg.get('charges') as FormArray).push(this.formBuilder.group({
          tierName: ele.tierName,
          checkMethodStatus: [deliveryMethod.checkMethodStatus, [Validators.requiredTrue]],
          charge: [deliveryMethod.deliveryFee, [Validators.min(0), Validators.max(10000), Validators.required]],
        }));
      });
    }
    return fg;
  }
  createShippingLocation(locationName, locationType, locationStatus: boolean = false, locationFee = 0) {
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
      this.shippingObj.deliveryLocation = new DeliveryLocation();
    }
    this.shippingFG1 = this.formBuilder.group({
      shippingProfileName: [{ value: this.shippingObj.shippingProfileName, disabled: this.shippingObj.shippingProfileId ? true : false },
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
      state: [this.shippingObj.shippingOriginAddress.state || '', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.shippingObj.shippingOriginAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.zipcodeRegex), Validators.required]],
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
    if (this.shippingObj.deliveryOption === this.freeshipping) {
      if (this.shippingObj.deliveryTiers[0].tierName !== this.freeshipping) {
        this.shippingFG1.controls.tiers = this.formBuilder.array([this.createTier(this.freeshipping, 0, -1)]);
      }
      this.shippingFG2 = this.formBuilder.group({
        shippingMethods: this.formBuilder.array([
          this.createShippingMethods(0, shippingMethods.Nextday1businessdayshipping, this.shippingObj.deliveryTiers[0].deliveryMethods[0].checkMethodStatus),
          this.createShippingMethods(1, shippingMethods.twoday2businessdayshipping, this.shippingObj.deliveryTiers[0].deliveryMethods[1].checkMethodStatus),
          this.createShippingMethods(2, shippingMethods.Express3to5businessdays, this.shippingObj.deliveryTiers[0].deliveryMethods[2].checkMethodStatus),
          this.createShippingMethods(3, shippingMethods.Standard5to8businessdays, this.shippingObj.deliveryTiers[0].deliveryMethods[3].checkMethodStatus),
          this.createShippingMethods(4, shippingMethods.Custom, this.shippingObj.deliveryTiers[0].deliveryMethods[4].checkMethodStatus)
        ])
      });
    } else {
      this.shippingFG2 = this.formBuilder.group({
        shippingMethods: this.formBuilder.array([
          this.createShippingMethods(0, shippingMethods.Nextday1businessdayshipping, true),
          this.createShippingMethods(1, shippingMethods.twoday2businessdayshipping, true),
          this.createShippingMethods(2, shippingMethods.Express3to5businessdays, true),
          this.createShippingMethods(3, shippingMethods.Standard5to8businessdays, true),
          this.createShippingMethods(4, shippingMethods.Custom, false)
        ])
      });
    }
  }
  shippingNext() {
    this.readShipping();
    if (this.shippingObj.step === 1) {
      this.validatorExt.validateAllFormFields(this.shippingFG1);
      if (this.shippingFG1.valid) {
        if (this.validateTierRanges()) {
          this.shippingObj.step++; this.setValidatorsFG2();
        } else {
          this.core.message.info(userMessages.tierRangesMismatch);
        }
      }
    } else if (this.shippingObj.step === 2) {
      this.validatorExt.validateAllFormFields(this.shippingFG2);
      if (!this.validateShippingFG2()) {
        this.core.message.info(userMessages.noShippingmethodselected);
      } else if (!this.validateShippingMethodCustomName()) {
        this.core.message.info(userMessages.customShippingmethodName);
      } else {
        this.shippingObj.step++;
      }
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
  validateShippingMethodCustomName() {
    const customShippingMethod = ((this.shippingFG2.get('shippingMethods') as FormArray).controls.filter(p => p.get('shippingMethodId').value === 4)[0] as FormGroup).controls;
    if (customShippingMethod.selected.value != true || customShippingMethod.shippingName.value !== '') {
      return true;
    }
  }
  validateUniqueShippingName() {
    return this.shippings.shippings.filter(p => p.shippingProfileName === this.shippingObj.shippingProfileName && p.sequence !== this.shippingObj.sequence).length > 0;
  }
  validateTierRanges() {
    // check with in each tier
    // check cross tier
    if (this.shippingObj.deliveryTiers.length === 1) {
      const tier = this.shippingObj.deliveryTiers[0];
      return tier.minValue <= tier.maxValue;
    } else if (this.shippingObj.deliveryTiers.length > 1) {
      for (let i = 1; i < this.shippingObj.deliveryTiers.length; i++) {
        const tier = this.shippingObj.deliveryTiers[i - 1];
        const tier1 = this.shippingObj.deliveryTiers[i];
        if (tier.minValue > tier.maxValue || tier.maxValue > tier1.minValue) {
          return false;
        }
      }
    }
    return true;
  }
  saveShipping() {
    this.readShipping();
    this.validatorExt.validateAllFormFields(this.shippingFG1);
    this.validatorExt.validateAllFormFields(this.shippingFG2);
    this.validatorExt.validateAllFormFields(this.shippingFG3);

    if (this.validateUniqueShippingName()) { this.core.message.error(userMessages.duplicateShippingName); return false; }

    if (!this.shippingFG1.valid) { this.shippingObj.step = 1; } else
      if (!this.validateShippingFG2()) { this.shippingObj.step = 2; this.core.message.info(userMessages.noShippingmethodselected); } else
        if (!this.shippingFG3.valid) { this.shippingObj.step = 3; } else {
          this.readShipping();
          this.saveLoader = true;
          this.retialerService
            .saveShipping(this.shippingObj).subscribe(p => {
              this.shippingObj.shippingProfileId = p.shippingProfileId;
              // this.SaveData.emit('tab-Shipping');
              this.modified = false;
              this.core.message.success(userMessages.success);
              this.saveLoader = false;
              return true;
            }, err => { this.core.message.error(userMessages.error); this.saveLoader = false; }, () => this.saveLoader = false);
        }
    return false;
  }
  readShipping() {
    this.shippingObj.retailerId = this.retailerId;
    this.shippingObj.sequence = this.currentTabIndex;
    this.shippingObj.shippingProfileName = this.shippingFG1.controls.shippingProfileName.value;
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
        if (subElement.value.shippingName === shippingMethods.Custom) {
          fee.deliveryMethodName = this.deliveryMethodCustomName;
        }
        if (this.shippingObj.deliveryOption === this.freeshipping) {
          fee.checkMethodStatus = subElement.value.selected;
          fee.deliveryFee = 0;
        } else {
          fee.checkMethodStatus = (subElement.get('charges') as FormArray).length > tierSequence ?
            (subElement.get('charges') as FormArray).at(tierSequence).value.checkMethodStatus : false;
          fee.deliveryFee = (subElement.get('charges') as FormArray).length > tierSequence ?
            (subElement.get('charges') as FormArray).at(tierSequence).value.charge : 0;
        }
        deliveryTier.deliveryMethods.push(fee);
      });
      this.shippingObj.deliveryTiers.push(deliveryTier);
      tierSequence++;

    });
    this.shippings.shippings[this.currentTabIndex] = this.shippingObj;
    this.shippingsData = new RetialerShippingProfiles(this.shippings);
    return this.shippingObj;
  }

  setoptionSelected($event, index) {
    const val = (this.shippingFG2.get('shippingMethods') as FormArray).controls[index].get('selected').value;
    (this.shippingFG2.get('shippingMethods') as FormArray).controls[index].get('selected').patchValue(!val);
    $event.stopPropagation();
    $event.preventDefault();
  }
  getStates() {
    this.retialerService.getStates().subscribe(p => {
      this.states = p.stateAbbreviation;
    });
  }
}

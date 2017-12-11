// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';

import { RetialerService } from '../retialer.service';
import { RetailerProfileInfo, ProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import { RetailerPrimaryContact } from '../../../../../models/retailer-contact';
import { RetailerPaymentInfo, BankDetails } from '../../../../../models/retailer-payment-info';
import { RetialerShippingProfile, ShippingDeliveryTier, RetailerAddress, ShippingLocations, ShippingSubLocation, RetailerShippingMethodFee } from '../../../../../models/retailer-shipping-profile';
import { IAlert } from '../retailer-add/retailer-add.component';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { filterQueryId } from '@angular/core/src/view/util';

@Component({
  selector: 'app-retailer-add-shipping',
  templateUrl: './retailer-add-shipping.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddShippingComponent implements OnInit {
  // #region declarations
  currentOrientation = 'horizontal';
  currentJustify = 'start';
  currentTabIndex = 0;
  textRegex = new RegExp('^[a-zA-Z 0-9_.-]*$');
  retailerId = 1;
  @ViewChild('tabs') ngbTabSet: NgbTabset;
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
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  step = 1;
  shippingObj = new RetialerShippingProfile();
  uploadFile: any;
  errorMsgs: any;
  saveLoader = true;
  tiers = new Array<ShippingDeliveryTier>();


  // #endregion Shipping

  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
    this.retailerId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.shippings.push(new RetialerShippingProfile());

    this.setValidators();
    this.shippingFG1.valueChanges.subscribe(() => {
      this.deliveryOptionsChange();
    });

  }
  addShipping() {
    this.shippings.push(new RetialerShippingProfile());
  }
  setActiveTab(event) {
    console.log(event);
    // currentTabIndex = event;
  }
  deliveryOptionsChange() {
    switch (this.shippingFG1.controls.deliveryOptions.value) {
      case 0: break;
      case 1: break;
      case 2: break;
      case 3: break;
      case 4: break;
    }
  }
  addTier() {
    const tiers = this.shippingFG1.get('tiers') as FormArray;
    tiers.push(this.createTier());
  }
  createTier() {
    const tiers = this.shippingFG1.get('tiers') as FormArray;
    let length = 0;
    if (tiers !== null) {
      length = tiers.length;
    }
    return this.formBuilder.group({
      name: 'Tier' + ++length,
      min: 0,
      max: 0,
    });

  }
  createShippingMethods(shippingName) {
    const fg = this.formBuilder.group({
      shippingName: shippingName,
      selected: true,
      disabled: false,
      charges: this.formBuilder.array([])
    });
    if ((this.shippingFG1.controls.tiers as FormArray) !== null) {
      (this.shippingFG1.controls.tiers as FormArray).controls.forEach(element => {
        (fg.get('charges') as FormArray).push(this.formBuilder.group({
          tierName: element.value.name,
          charge: 0
        })
        );
      });
    }
    return fg;
  }
  createShippingLocation(locationName) {
    return this.formBuilder.group({
      locationName: locationName,
      locationType: true,
      locationFee: 0,
    });

  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setValidators() {
    this.shippingFG1 = this.formBuilder.group({
      profileName: ['', [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      deliveryOptions: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      businessSummary: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      tiers: this.formBuilder.array([this.createTier()])
    });
    this.setValidatorsFG2();
    this.shippingFG3 = this.formBuilder.group({
      addressLine1: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: ['', [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]],
      countryName: ['', [Validators.required]],
      locationInclude: this.formBuilder.array([
        this.createShippingLocation('Continental US'),
        this.createShippingLocation('Alaska and Hawaii'),
        this.createShippingLocation('US Protectorates')])
    });
    this.errorMsgs = {
      'profileName': { required: 'Please enter Business Name ', error: 'Please enter valid Business Name' },
      'deliveryOptions': { required: 'Please enter deliveryOptions', error: 'Please enter valid deliveryOptions' },
      'businessSummary': { required: 'Please enter Business Summary', error: 'Please enter valid Business Summary' },
      'bussines_address': { required: 'Please enter Address line Address line 2', error: 'Please enter valid Address line Address line 2' },
      'bussines_address2': { required: 'Please enter Address line 2', error: 'Please enter valid Address line 2' },
      'city': { required: 'Please enter City', error: 'Please enter valid City' },
      'state': { required: 'Please enter State', error: 'Please enter valid State' },
      'zipcode': { required: 'Please enter Zipcode', error: 'Please enter valid Zipcode' },
      'email': { required: 'Please enter Email', error: 'Please enter valid Email' },
      'phone_number': { required: 'Please enter Phone number', error: 'Please enter valid Phone number' },
      'sellerTypeId': { required: 'Please select Seller Type', error: 'Please select valid Seller Type' },
      'websiteUrl': { required: 'Please enter Website URL', error: 'Please enter valid Website URL' },
      'websiteUserName': { required: 'Please enter Username', error: 'Please enter valid Username' },
      'websitePassword': { required: 'Please enter Password', error: 'Please enter valid Password' },
      'contact_name': { required: 'Please enter Name', error: 'Please enter valid Name' },
      'contact_position': { required: 'Please enter Position', error: 'Please enter valid Position' },
      'contact_address1': { required: 'Please enter Address line 1', error: 'Please enter valid Address line 1' },
      'contact_address2': { required: 'Please enter Address line 2', error: 'Please enter valid Address line 2' },
      'contact_city': { required: 'Please enter City', error: 'Please enter valid City' },
      'contact_state': { required: 'Please enter State', error: 'Please enter valid State' },
      'contact_zipcode': { required: 'Please enter Zipcode', error: 'Please enter valid Zipcode' },
      'contact_email': { required: 'Please enter Email', error: 'Please enter valid Email' },
      'contact_phone_number': { required: 'Please enter Phone number', error: 'Please enter valid Phone number' }
    };
  }
  setValidatorsFG2() {
    this.shippingFG2 = this.formBuilder.group({
      shippingMethods: this.formBuilder.array([
        this.createShippingMethods('Next day: 1 business day shipping'),
        this.createShippingMethods('2 day: 2 business day shipping'),
        this.createShippingMethods('3 day: 5 business day'),
        this.createShippingMethods('Standard: 5 to 8 business days'),
        this.createShippingMethods('Custom')
      ])
    });
  }

  shippingNext() {

    this.step++;
    if (this.step === 2) { this.setValidatorsFG2(); }
    if (this.step === 4) { this.step = 3; }
    this.readShipping();

  }
  shippingBack() {
    this.step--;
    if (this.step === 0) { this.step = 1; }
  }
  saveShipping() {
    this.readShipping();
    this.validatorExt.validateAllFormFields(this.shippingFG1);
    this.validatorExt.validateAllFormFields(this.shippingFG2);
    if (!this.shippingFG1.valid) {
      this.shippingBack();
    } else if (!this.shippingFG2.valid) {
      this.shippingNext();
    } else {
      this.saveLoader = true;
      this.retialerService
        .saveShipping(this.shippingObj)
        .then(res => {
          // todo correct response
          this.retailerId = res._body;
          this.shippingObj.retailerId = this.retailerId;
          this.ngbTabSet.select('tab-Payment');
          // this.router.navigateByUrl('/retailer-list');
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
    (this.shippingFG3.get('locationInclude') as FormArray).controls.forEach(element => {
      const locationInclude = new ShippingSubLocation();
      locationInclude.locationName = element.value.locationName;
      locationInclude.locationType = element.value.locationType;
      locationInclude.locationFee = element.value.locationFee;
      this.shippingObj.shipLocations.locationInclude.push(locationInclude);
    });
    this.shippingObj.deliveryTier = new Array<ShippingDeliveryTier>();
    let tierSequence = 0;
    (this.shippingFG1.get('tiers') as FormArray).controls.forEach(element => {
      const deliveryTier = new ShippingDeliveryTier();
      deliveryTier.tierName = element.value.tierName;
      deliveryTier.minValue = element.value.min;
      deliveryTier.maxValue = element.value.max;
      deliveryTier.sequence = tierSequence++;
      deliveryTier.shippingMethod = new Array<RetailerShippingMethodFee>();
      let tierIndex = 0;
      (this.shippingFG2.get('shippingMethods') as FormArray).controls.forEach(subElement => {
        const fee = new RetailerShippingMethodFee();
        fee.shipMethodName = subElement.value.shippingName;
        fee.deliveryFee = (subElement.get('charges') as FormArray).at(tierIndex++).value.charge;
        deliveryTier.shippingMethod.push(fee);
      });
      this.shippingObj.deliveryTier.push(deliveryTier);
    });
    return this.shippingObj;
  }

  getProfileInfo(retailerId) {
    this.retialerService
      .shippingProfileGet(this.retailerId)
      .subscribe((res: RetialerShippingProfile) => {
        this.shippingObj = res;
        // this.shippingFG1.patchValue({
        //   profileName: this.shippingObj.retailerProfile.businessName,
        //   deliveryOptions: this.shippingObj.retailerProfile.tin,
        //   businessSummary: this.shippingObj.retailerProfile.businessSummary,
        //   sellerTypeId: this.shippingObj.retailerProfile.sellerTypeId,

        //   bussines_address: this.shippingObj.businessAddress.addressLine1,
        //   bussines_address2: this.shippingObj.businessAddress.addressLine2,
        //   city: this.shippingObj.businessAddress.city,
        //   state: this.shippingObj.businessAddress.state,
        //   zipcode: this.shippingObj.businessAddress.zipcode,
        //   email: this.shippingObj.businessAddress.email,
        //   phone_number: this.shippingObj.businessAddress.phoneNo
        // });

        // this.shippingFG2.patchValue({
        //   websiteUrl: this.shippingObj.retailerProfile.websiteUrl,
        //   websiteUserName: this.shippingObj.retailerProfile.websiteUserName,
        //   websitePassword: this.shippingObj.retailerProfile.websitePassword,

        //   contact_name: this.shippingObj.primaryContact.personName,
        //   contact_position: this.shippingObj.primaryContact.position,
        //   contact_address1: this.shippingObj.primaryContact.addressLine1,
        //   contact_address2: this.shippingObj.primaryContact.addressLine2,
        //   contact_city: this.shippingObj.primaryContact.city,
        //   contact_state: this.shippingObj.primaryContact.state,
        //   contact_zipcode: this.shippingObj.primaryContact.zipcode,
        //   contact_email: this.shippingObj.primaryContact.email,
        //   contact_phone_number: this.shippingObj.primaryContact.phoneNo
        // });
      });
  }


}

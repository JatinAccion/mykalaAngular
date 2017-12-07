// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';

import { RetialerService } from '../retialer.service';
import { RetailerProfileInfo, ProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import { RetailerPrimaryContact } from '../../../../../models/retailer-contact';
import { RetailerPaymentInfo, BankDetails } from '../../../../../models/retailer-payment-info';
import { RetialerShippingProfile } from '../../../../../models/retailer-shipping-profile';
import { IAlert, hasRequiredField } from '../retailer-add/retailer-add.component';
import { environment } from '../../../../environments/environment';

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

  numberRegex = new RegExp('^[0-9_.-]*$');
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
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  step = 1;
  shippingObj = new RetailerProfileInfo();
  uploadFile: any;
  errorMsgs: any;
  saveLoader = true;
  // #endregion Shipping

  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private retialerService: RetialerService
  ) {
    this.retailerId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.setValidators();
  }
  addShipping() {
    this.shippings.push(new RetialerShippingProfile());
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setValidators() {
    this.shippingFG1 = this.formBuilder.group({
      profileName: ['', [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      deliveryOptions: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      businessSummary: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],

    });
    this.shippingFG2 = this.formBuilder.group({

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
  getProfileInfoDropdowndata() {
    this.retialerService.getSellerTypes().subscribe(res => {
      this.sellerTypes = res;
    });
  }
  shippingNext() {

    this.step++;
    this.readShipping();
  }
  shippingBack() {
    this.step = 1;
  }
  saveShipping() {
    this.readShipping();
    this.validateAllFormFields(this.shippingFG1);
    this.validateAllFormFields(this.shippingFG2);
    if (!this.shippingFG1.valid) {
      this.shippingBack();
    }
    else if (!this.shippingFG2.valid) {
      this.shippingNext();
    }
    else {
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
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  isFieldValid(field: FormControl) {
    return field.valid && field.touched;
  }
  displayFieldCss(field: FormControl) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field),
      'required': hasRequiredField(field)
    };
  }
  getValidators(_f) {
    return Object.keys(_f).reduce((a, b) => {
      const v = _f[b][1];
      if (v && (v === Validators.required || v.indexOf(Validators.required) > -1)) {
        if (!a[b]) { a[b] = {}; }
        a[b]['required'] = true;
      }
      return a;
    }, {});
  }

  readShipping() {
    // this.shippingObj.retailerProfile = new ProfileInfo();
    // this.shippingObj.retailerProfile.businessLogoPath = this.shippingFG1.value.profileImage;
    // this.shippingObj.retailerProfile.businessName = this.shippingFG1.value.profileName;
    // this.shippingObj.retailerProfile.tin = this.shippingFG1.value.deliveryOptions;
    // this.shippingObj.retailerProfile.businessSummary = this.shippingFG1.value.businessSummary;
    // this.shippingObj.retailerProfile.sellerTypeId = this.shippingFG1.value.sellerTypeId;

    // this.shippingObj.retailerProfile.websiteUrl = this.shippingFG2.value.websiteUrl;
    // this.shippingObj.retailerProfile.websiteUserName = this.shippingFG2.value.websiteUserName;
    // this.shippingObj.retailerProfile.websitePassword = this.shippingFG2.value.websitePassword;

    // this.shippingObj.businessAddress = new RetailerBuinessAddress();
    // this.shippingObj.businessAddress.addressLine1 = this.shippingFG1.value.bussines_address;
    // this.shippingObj.businessAddress.addressLine2 = this.shippingFG1.value.bussines_address2;
    // this.shippingObj.businessAddress.city = this.shippingFG1.value.city;
    // this.shippingObj.businessAddress.state = this.shippingFG1.value.state;
    // this.shippingObj.businessAddress.zipcode = this.shippingFG1.value.zipcode;
    // this.shippingObj.businessAddress.email = this.shippingFG1.value.email;
    // this.shippingObj.businessAddress.phoneNo = this.shippingFG1.value.phone_number;

    // this.shippingObj.primaryContact = new RetailerPrimaryContact();

    // this.shippingObj.primaryContact.personName = this.shippingFG2.value.contact_name;
    // this.shippingObj.primaryContact.position = this.shippingFG2.value.contact_position;
    // this.shippingObj.primaryContact.addressLine1 = this.shippingFG2.value.contact_address1;
    // this.shippingObj.primaryContact.addressLine2 = this.shippingFG2.value.contact_address2;
    // this.shippingObj.primaryContact.city = this.shippingFG2.value.contact_city;
    // this.shippingObj.primaryContact.state = this.shippingFG2.value.contact_state;
    // this.shippingObj.primaryContact.zipcode = this.shippingFG2.value.contact_zipcode;
    // this.shippingObj.primaryContact.email = this.shippingFG2.value.contact_email;
    // this.shippingObj.primaryContact.phoneNo = this.shippingFG2.value.contact_phone_number;
    // return this.shippingObj;
  }

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  }

  fileChangeEvent(fileInput: any, profileInfo) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: any) {
        profileInfo.controls.profileImage.value = e.target.result;
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  getProfileInfo(retailerId) {
    this.retialerService
      .profileInfoGet(this.retailerId)
      .subscribe((res: RetailerProfileInfo) => {
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

// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
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
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';

@Component({
  selector: 'app-retailer-add-products',
  templateUrl: './retailer-add-products.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddProductsComponent implements OnInit {
  // #region declarations
  currentOrientation = 'horizontal';
  currentJustify = 'start';

  numberRegex = new RegExp('^[0-9_.-]*$');
  textRegex = new RegExp('^[a-zA-Z 0-9_.-]*$');
  @Input() retailerId: number;
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  // #region Shipping
  shippings = new Array<RetialerShippingProfile>();
  profileFG1 = new FormGroup({});
  profileFG2 = new FormGroup({});
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  step = 1;
  shippingObj = new RetialerShippingProfile();
  uploadFile: any;
  errorMsgs= inputValidations;
  saveLoader = true;
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
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
    this.shippings.push(new RetialerShippingProfile());
  }
  addShipping() {
    this.shippings.push(new RetialerShippingProfile());
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setProfileInfoValidators() {
    this.profileFG1 = this.formBuilder.group({
      profileImage: [''],
      businessName: ['', [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      tin: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      businessSummary: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address2: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      state: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      zipcode: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberRegex)]],
      email: ['', [Validators.maxLength(255), Validators.email]],
      phone_number: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.numberRegex)]],
      sellerTypeId: ['', [Validators.required]]
    });
    this.profileFG2 = this.formBuilder.group({
      websiteUrl: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      websiteUserName: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      websitePassword: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_name: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_position: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_address1: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_address2: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_city: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_state: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_zipcode: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberRegex)]],
      contact_email: ['', [Validators.maxLength(255), Validators.email]],
      contact_phone_number: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.numberRegex)]]
    });
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
    // this.readShipping();
    // this.validateAllFormFields(this.profileFG1);
    // this.validateAllFormFields(this.profileFG2);
    // if (!this.profileFG1.valid) {
    //   this.shippingBack();
    // }    else if (!this.profileFG2.valid) {
    //   this.shippingNext();
    // }    else {
    //   this.saveLoader = true;
    //   this.retialerService
    //     .saveShipping(this.shippingObj)
    //     .then(res => {
    //       // todo correct response
    //       this.retailerId = res._body;
    //       this.shippingObj.retailerId = this.retailerId;
    //       this.ngbTabSet.select('tab-Payment');
    //       // this.router.navigateByUrl('/retailer-list');
    //       this.alert = {
    //         id: 1,
    //         type: 'success',
    //         message: 'Saved successfully',
    //         show: true
    //       };
    //       this.saveLoader = false;
    //       return true;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.alert = {
    //         id: 1,
    //         type: 'danger',
    //         message: 'Not able to Save',
    //         show: true
    //       };

    //     });
    // }
    // return false;
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
      'required': this.validatorExt.hasRequiredField(field)
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
    // this.shippingObj.retailerProfile.businessLogoPath = this.profileFG1.value.profileImage;
    // this.shippingObj.retailerProfile.businessName = this.profileFG1.value.businessName;
    // this.shippingObj.retailerProfile.tin = this.profileFG1.value.tin;
    // this.shippingObj.retailerProfile.businessSummary = this.profileFG1.value.businessSummary;
    // this.shippingObj.retailerProfile.sellerTypeId = this.profileFG1.value.sellerTypeId;

    // this.shippingObj.retailerProfile.websiteUrl = this.profileFG2.value.websiteUrl;
    // this.shippingObj.retailerProfile.websiteUserName = this.profileFG2.value.websiteUserName;
    // this.shippingObj.retailerProfile.websitePassword = this.profileFG2.value.websitePassword;

    // this.shippingObj.businessAddress = new RetailerBuinessAddress();
    // this.shippingObj.businessAddress.addressLine1 = this.profileFG1.value.bussines_address;
    // this.shippingObj.businessAddress.addressLine2 = this.profileFG1.value.bussines_address2;
    // this.shippingObj.businessAddress.city = this.profileFG1.value.city;
    // this.shippingObj.businessAddress.state = this.profileFG1.value.state;
    // this.shippingObj.businessAddress.zipcode = this.profileFG1.value.zipcode;
    // this.shippingObj.businessAddress.email = this.profileFG1.value.email;
    // this.shippingObj.businessAddress.phoneNo = this.profileFG1.value.phone_number;

    // this.shippingObj.primaryContact = new RetailerPrimaryContact();

    // this.shippingObj.primaryContact.personName = this.profileFG2.value.contact_name;
    // this.shippingObj.primaryContact.position = this.profileFG2.value.contact_position;
    // this.shippingObj.primaryContact.addressLine1 = this.profileFG2.value.contact_address1;
    // this.shippingObj.primaryContact.addressLine2 = this.profileFG2.value.contact_address2;
    // this.shippingObj.primaryContact.city = this.profileFG2.value.contact_city;
    // this.shippingObj.primaryContact.state = this.profileFG2.value.contact_state;
    // this.shippingObj.primaryContact.zipcode = this.profileFG2.value.contact_zipcode;
    // this.shippingObj.primaryContact.email = this.profileFG2.value.contact_email;
    // this.shippingObj.primaryContact.phoneNo = this.profileFG2.value.contact_phone_number;
    return this.shippingObj;
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
        // this.shippingObj = res;
        // this.profileFG1.patchValue({
        //   businessName: this.shippingObj.retailerProfile.businessName,
        //   tin: this.shippingObj.retailerProfile.tin,
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

        // this.profileFG2.patchValue({
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
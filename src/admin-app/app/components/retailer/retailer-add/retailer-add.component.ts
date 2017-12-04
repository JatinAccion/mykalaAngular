// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetailerProfileInfo, ProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import { RetailerPrimaryContact } from '../../../../../models/retailer-contact';
import { RetialerService } from '../retialer.service';
import { RetailerPaymentInfo, BankDetails } from '../../../../../models/retailer-payment-info';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
// #endregion imports
export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
  if (abstractControl['controls']) {
    for (const controlName in abstractControl['controls']) {
      if (abstractControl['controls'][controlName]) {
        if (hasRequiredField(abstractControl['controls'][controlName])) {
          return true;
        }
      }
    }
  }
  return false;
};
export const getControlName = (abstractControl: AbstractControl): string | null => {
  const formGroup = abstractControl.parent.controls;
  return Object.keys(formGroup).find(name => abstractControl === formGroup[name]) || null;
};
export interface IAlert {
  id: number;
  type: string;
  message: string;
}
@Component({
  selector: 'app-retailer-add',
  templateUrl: './retailer-add.component.html',
  styleUrls: ['./retailer-add.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddComponent implements OnInit {
  // #region declarations
  currentOrientation = 'vertial';
  currentJustify = 'end';

  retailer: Retailer;
  numberRegex = new RegExp('^[0-9_.-]*$');
  textRegex = new RegExp('^[a-zA-Z 0-9_.-]*$');
  retailerId = 1;
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: 'This is an success alert',
  };
  // #region ProfileInfo
  profileFG1 = new FormGroup({});
  profileFG2 = new FormGroup({});
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  profileInfoStep = 1;
  profileInfoObj = new RetailerProfileInfo();
  uploadFile: any;
  profileErrorMsgs: any;
  // #endregion ProfileInfo
  // #region PaymentInfo
  paymentFG1 = new FormGroup({});
  paymentFG2 = new FormGroup({});
  paymentMethods: Array<nameValue> = new Array<nameValue>();
  paymentVehicles: Array<nameValue> = new Array<nameValue>();
  paymentInfoStep = 1;
  paymentInfoObj = new RetailerPaymentInfo();
  paymentErrorMsgs: any;
  // #endregion PaymentInfo
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
    this.setActiveTab({ nextId: 'tab-Profile' });
  }
  setActiveTab(event) {
    this.profileFG1 = new FormGroup({});
    this.profileFG2 = new FormGroup({});
    this.paymentFG1 = new FormGroup({});
    this.paymentFG2 = new FormGroup({});
    switch (event.nextId) {
      case 'tab-Profile':
        this.setProfileInfoValidators();
        this.getProfileInfoDropdowndata();
        if (this.retailerId) {
          this.getProfileInfo(this.retailerId);
        }
        break;
      case 'tab-Payment':
        this.setPaymenInfoValidators();
        this.getPaymentInfoDropdowndata();
        if (this.retailerId) {
          this.getPaymentInfo(this.retailerId);
        }
        break;
    }
  }
  closeAlert(alert: IAlert) {
    this.alert = null;
  }
  // #region ProfileInfo
  setProfileInfoValidators() {
    this.profileFG1 = this.formBuilder.group({
      profileImage: [''],
      businessName: ['', [Validators.pattern(this.textRegex), Validators.maxLength(255), Validators.required]],
      tin: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex), Validators.required]],
      businessSummary: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex), Validators.required]],
      bussines_address: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex), Validators.required]],
      bussines_address2: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      state: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      zipcode: ['', [Validators.maxLength(10), Validators.pattern(this.numberRegex)]],
      email: ['', [Validators.maxLength(255), Validators.email]],
      phone_number: ['', [Validators.maxLength(255), Validators.pattern(this.numberRegex)]],
      sellerTypeId: ['', [Validators.required]]
    });
    this.profileFG2 = this.formBuilder.group({
      websiteUrl: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      websiteUserName: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      websitePassword: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_name: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_position: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_address1: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_address2: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_city: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_state: ['', [Validators.maxLength(255), Validators.pattern(this.textRegex)]],
      contact_zipcode: ['', [Validators.maxLength(10), Validators.pattern(this.numberRegex)]],
      contact_email: ['', [Validators.maxLength(255), Validators.email]],
      contact_phone_number: ['', [Validators.maxLength(255), Validators.pattern(this.numberRegex)]]
    });
    this.profileErrorMsgs = {
      'profileImage': { required: 'Please enter me', error: 'Please enter valid me' },
      'businessName': { required: 'Please enter Business Name ', error: 'Please enter valid Business Name' },
      'tin': { required: 'Please enter tin', error: 'Please enter valid tin' },
      'businessSummary': { required: 'Please enter Business Summary', error: 'Please enter valid Business Summary' },
      'bussines_address': { required: 'Please enter me', error: 'Please enter valid me' },
      'bussines_address2': { required: 'Please enter me', error: 'Please enter valid me' },
      'city': { required: 'Please enter me', error: 'Please enter valid me' },
      'state': { required: 'Please enter me', error: 'Please enter valid me' },
      'zipcode': { required: 'Please enter me', error: 'Please enter valid me' },
      'email': { required: 'Please enter me', error: 'Please enter valid me' },
      'phone_number': { required: 'Please enter me', error: 'Please enter valid me' },
      'sellerTypeId': { required: 'Please enter me', error: 'Please enter valid me' },
      'websiteUrl': { required: 'Please enter me', error: 'Please enter valid me' },
      'websiteUserName': { required: 'Please enter me', error: 'Please enter valid me' },
      'websitePassword': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_name': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_position': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_address1': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_address2': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_city': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_state': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_zipcode': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_email': { required: 'Please enter me', error: 'Please enter valid me' },
      'contact_phone_number': { required: 'Please enter me', error: 'Please enter valid me' }
    };
  }
  getProfileInfoDropdowndata() {
    this.retialerService.getSellerTypes().subscribe(res => {
      this.sellerTypes = res;
    });
  }
  profileInfoNext() {
    this.profileInfoStep = 2;
    this.readProfileInfo();
  }
  profileInfoBack() {
    this.profileInfoStep = 1;
  }
  profileInfoSave() {
    this.readProfileInfo();
    this.validateAllFormFields(this.profileFG1);
    this.validateAllFormFields(this.profileFG2);
    if (!this.profileFG1.valid) {
      this.profileInfoBack();
    }
    else if (!this.profileFG2.valid) {
      this.profileInfoNext();
    }
    else {
      this.retialerService
        .profileInfoSave(this.profileInfoObj)
        .then(res => {
          // todo correct response
          this.retailerId = res._body;
          this.profileInfoObj.retailerId = this.retailerId;
          this.ngbTabSet.select('tab-Payment');
          // this.router.navigateByUrl('/retailer-list');
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Saved successfully',
          };
          return true;
        })
        .catch(err => {
          console.log(err);
          this.alert = {
            id: 1,
            type: 'danger',
            message: 'Not able to Save',
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

  readProfileInfo() {
    this.profileInfoObj.retailerProfile = new ProfileInfo();
    this.profileInfoObj.retailerProfile.businessLogoPath = this.profileFG1.value.profileImage;
    this.profileInfoObj.retailerProfile.businessName = this.profileFG1.value.businessName;
    this.profileInfoObj.retailerProfile.tin = this.profileFG1.value.tin;
    this.profileInfoObj.retailerProfile.businessSummary = this.profileFG1.value.businessSummary;
    this.profileInfoObj.retailerProfile.sellerTypeId = this.profileFG1.value.sellerTypeId;

    this.profileInfoObj.retailerProfile.websiteUrl = this.profileFG2.value.websiteUrl;
    this.profileInfoObj.retailerProfile.websiteUserName = this.profileFG2.value.websiteUserName;
    this.profileInfoObj.retailerProfile.websitePassword = this.profileFG2.value.websitePassword;

    this.profileInfoObj.businessAddress = new RetailerBuinessAddress();
    this.profileInfoObj.businessAddress.addressLine1 = this.profileFG1.value.bussines_address;
    this.profileInfoObj.businessAddress.addressLine2 = this.profileFG1.value.bussines_address2;
    this.profileInfoObj.businessAddress.city = this.profileFG1.value.city;
    this.profileInfoObj.businessAddress.state = this.profileFG1.value.state;
    this.profileInfoObj.businessAddress.zipcode = this.profileFG1.value.zipcode;
    this.profileInfoObj.businessAddress.email = this.profileFG1.value.email;
    this.profileInfoObj.businessAddress.phoneNo = this.profileFG1.value.phone_number;

    this.profileInfoObj.primaryContact = new RetailerPrimaryContact();

    this.profileInfoObj.primaryContact.personName = this.profileFG2.value.contact_name;
    this.profileInfoObj.primaryContact.position = this.profileFG2.value.contact_position;
    this.profileInfoObj.primaryContact.addressLine1 = this.profileFG2.value.contact_address1;
    this.profileInfoObj.primaryContact.addressLine2 = this.profileFG2.value.contact_address2;
    this.profileInfoObj.primaryContact.city = this.profileFG2.value.contact_city;
    this.profileInfoObj.primaryContact.state = this.profileFG2.value.contact_state;
    this.profileInfoObj.primaryContact.zipcode = this.profileFG2.value.contact_zipcode;
    this.profileInfoObj.primaryContact.email = this.profileFG2.value.contact_email;
    this.profileInfoObj.primaryContact.phoneNo = this.profileFG2.value.contact_phone_number;
    return this.profileInfoObj;
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
        this.profileInfoObj = res;
        this.profileFG1.patchValue({
          businessName: this.profileInfoObj.retailerProfile.businessName,
          tin: this.profileInfoObj.retailerProfile.tin,
          businessSummary: this.profileInfoObj.retailerProfile.businessSummary,
          sellerTypeId: this.profileInfoObj.retailerProfile.sellerTypeId,

          bussines_address: this.profileInfoObj.businessAddress.addressLine1,
          bussines_address2: this.profileInfoObj.businessAddress.addressLine2,
          city: this.profileInfoObj.businessAddress.city,
          state: this.profileInfoObj.businessAddress.state,
          zipcode: this.profileInfoObj.businessAddress.zipcode,
          email: this.profileInfoObj.businessAddress.email,
          phone_number: this.profileInfoObj.businessAddress.phoneNo
        });

        this.profileFG2.patchValue({
          websiteUrl: this.profileInfoObj.retailerProfile.websiteUrl,
          websiteUserName: this.profileInfoObj.retailerProfile.websiteUserName,
          websitePassword: this.profileInfoObj.retailerProfile.websitePassword,

          contact_name: this.profileInfoObj.primaryContact.personName,
          contact_position: this.profileInfoObj.primaryContact.position,
          contact_address1: this.profileInfoObj.primaryContact.addressLine1,
          contact_address2: this.profileInfoObj.primaryContact.addressLine2,
          contact_city: this.profileInfoObj.primaryContact.city,
          contact_state: this.profileInfoObj.primaryContact.state,
          contact_zipcode: this.profileInfoObj.primaryContact.zipcode,
          contact_email: this.profileInfoObj.primaryContact.email,
          contact_phone_number: this.profileInfoObj.primaryContact.phoneNo
        });
      });
  }
  // #endregion ProfileInfo

  // #region PaymentInfo

  setPaymenInfoValidators() {
    this.paymentFG1 = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      paymentVehicle: ['', [Validators.required]],
      bankname: ['', [Validators.pattern(this.textRegex)]],
      addressLine1: ['', [Validators.pattern(this.textRegex)]],
      addressLine2: ['', [Validators.pattern(this.textRegex)]],
      city: ['', [Validators.pattern(this.textRegex)]],
      state: ['', [Validators.pattern(this.textRegex)]],
      zipcode: ['', [Validators.pattern(this.numberRegex)]]
    });
    this.paymentFG2 = this.formBuilder.group({
      accountName: ['', [Validators.pattern(this.textRegex)]],
      accountNumber: ['', [Validators.pattern(this.numberRegex)]],
      routingNumber: ['', [Validators.pattern(this.numberRegex)]],
      swiftCode: ['', [Validators.pattern(this.textRegex)]],
      name: ['', [Validators.pattern(this.textRegex)]],
      addressLine1: ['', [Validators.pattern(this.textRegex)]],
      addressLine2: ['', [Validators.pattern(this.textRegex)]],
      city: ['', [Validators.pattern(this.textRegex)]],
      state: ['', [Validators.pattern(this.textRegex)]],
      zipcode: ['', [Validators.pattern(this.numberRegex)]]
    });
    this.paymentErrorMsgs = {
      'paymentMethod': { required: 'Please enter me', error: 'Please enter valid me' },
      'paymentVehicle': { required: 'Please enter me', error: 'Please enter valid me' },
      'bankname': { required: 'Please enter me', error: 'Please enter valid me' },
      'accountName': { required: 'Please enter me', error: 'Please enter valid me' },
      'accountNumber': { required: 'Please enter me', error: 'Please enter valid me' },
      'routingNumber': { required: 'Please enter me', error: 'Please enter valid me' },
      'swiftCode': { required: 'Please enter me', error: 'Please enter valid me' },
      'name': { required: 'Please enter me', error: 'Please enter valid me' },
      'addressLine1': { required: 'Please enter me', error: 'Please enter valid me' },
      'addressLine2': { required: 'Please enter me', error: 'Please enter valid me' },
      'city': { required: 'Please enter me', error: 'Please enter valid me' },
      'state': { required: 'Please enter me', error: 'Please enter valid me' },
      'zipcode': { required: 'Please enter me', error: 'Please enter valid me' },
      'email': { required: 'Please enter me', error: 'Please enter valid me' },
      'phone_number': { required: 'Please enter me', error: 'Please enter valid me' },
    };

  }
  getPaymentInfoDropdowndata() {
    this.retialerService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
    });
  }
  paymentMethodChange() {
    this.readPaymenInfo();
    this.retialerService.getPaymentVehicles().subscribe(res => {
      this.paymentVehicles = res.filter(p => p.parent === this.paymentInfoObj.bankDetails.paymentMethod);
    });

  }
  paymentInfoNext() {
    this.paymentInfoStep = 2;
    this.readPaymenInfo();
  }
  paymentInfoBack() {
    this.paymentInfoStep = 1;
  }
  paymentInfoSave() {
    this.readPaymenInfo();
    this.validateAllFormFields(this.paymentFG1);
    this.validateAllFormFields(this.paymentFG2);
    if (!this.profileFG1.valid) {
      this.profileInfoBack();
    }
    else if (!this.profileFG2.valid) {
      this.profileInfoNext();
    }
    else {
      this.retialerService
        .paymentInfoSave(this.paymentInfoObj)
        .then(res => {
          this.ngbTabSet.select('tab-Payment');
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Saved successfully',
          };
          return true;
        })
        .catch(err => {
          console.log(err);
          this.alert = {
            id: 1,
            type: 'danger',
            message: 'Not able to Save',
          };

        });
      return false;
    }
  }
  readPaymenInfo() {
    this.paymentInfoObj.retailerId = this.retailerId;
    this.paymentInfoObj.bankDetails = new BankDetails();
    this.paymentInfoObj.bankDetails.retailerId = this.retailerId;
    this.paymentInfoObj.bankDetails.paymentMethod = this.paymentFG1.value.paymentMethod;
    this.paymentInfoObj.bankDetails.paymentVehicle = this.paymentFG1.value.paymentVehicle;
    this.paymentInfoObj.bankDetails.bankName = this.paymentFG1.value.bankname;
    this.paymentInfoObj.bankDetails.addressLine1 = this.paymentFG1.value.addressLine1;
    this.paymentInfoObj.bankDetails.addressLine2 = this.paymentFG1.value.addressLine2;
    this.paymentInfoObj.bankDetails.city = this.paymentFG1.value.city;
    this.paymentInfoObj.bankDetails.state = this.paymentFG1.value.state;
    this.paymentInfoObj.bankDetails.zipcode = this.paymentFG1.value.zipcode;

    this.paymentInfoObj.bankDetails.accountName = this.paymentFG2.value.accountName;
    this.paymentInfoObj.bankDetails.accountNumber = this.paymentFG2.value.accountNumber;
    this.paymentInfoObj.bankDetails.routingNumber = this.paymentFG2.value.routingNumber;
    this.paymentInfoObj.bankDetails.swiftCode = this.paymentFG2.value.swiftCode;

    this.paymentInfoObj.name = this.paymentFG2.value.name;
    this.paymentInfoObj.addressLine1 = this.paymentFG2.value.addressLine1;
    this.paymentInfoObj.addressLine2 = this.paymentFG2.value.addressLine2;
    this.paymentInfoObj.city = this.paymentFG2.value.city;
    this.paymentInfoObj.state = this.paymentFG2.value.state;
    this.paymentInfoObj.zipcode = this.paymentFG2.value.zipcode;

    return this.paymentInfoObj;
  }
  getPaymentInfo(retailerId) {
    this.retialerService
      .paymentInfoGet(this.retailerId)
      .subscribe((res: RetailerPaymentInfo) => {
        this.paymentInfoObj = res;
        this.paymentFG1.patchValue({
          paymentMethod: this.paymentInfoObj.bankDetails.paymentMethod,
          paymentVehicle: this.paymentInfoObj.bankDetails.paymentVehicle,
          bankname: this.paymentInfoObj.bankDetails.bankName,
          addressLine1: this.paymentInfoObj.bankDetails.addressLine1,
          addressLine2: this.paymentInfoObj.bankDetails.addressLine2,
          city: this.paymentInfoObj.bankDetails.city,
          state: this.paymentInfoObj.bankDetails.state,
          zipcode: this.paymentInfoObj.bankDetails.zipcode
        });

        this.paymentFG2.patchValue({
          accountName: this.paymentInfoObj.bankDetails.accountName,
          accountNumber: this.paymentInfoObj.bankDetails.accountNumber,
          routingNumber: this.paymentInfoObj.bankDetails.routingNumber,
          swiftCode: this.paymentInfoObj.bankDetails.swiftCode,

          name: this.paymentInfoObj.name,
          addressLine1: this.paymentInfoObj.addressLine1,
          addressLine2: this.paymentInfoObj.addressLine2,
          city: this.paymentInfoObj.city,
          state: this.paymentInfoObj.state,
          zipcode: this.paymentInfoObj.zipcode
        });
      });
  }

  // #endregion PaymentInfo
}

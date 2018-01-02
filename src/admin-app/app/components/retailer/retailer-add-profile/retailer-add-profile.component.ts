// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import { RetailerContact } from '../../../../../models/retailer-contact';
import { RetialerService } from '../retialer.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { inputValidations } from './messages';
import { templateJitUrl } from '@angular/compiler';
// #endregion imports


@Component({
  selector: 'app-retailer-add-profile',
  templateUrl: './retailer-add-profile.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddProfileComponent implements OnInit {
  @Input() retailerId: number;
  @Output() retailerIdChange = new EventEmitter<number>();
  @Output() SaveData = new EventEmitter<any>();
  @Input() profileData: RetailerProfileInfo;
  @Output() profileDataChange = new EventEmitter<RetailerProfileInfo>();
  // #region declarations

  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  profileFG1 = new FormGroup({});
  profileFG2 = new FormGroup({});
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  profileInfoStep = 1;
  profileInfoObj = new RetailerProfileInfo();
  uploadFile: any;
  errorMsgs = inputValidations;
  profileSaveloader = false;
  fileName = '';

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
    this.getProfileInfoDropdowndata();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  // #region ProfileInfo
  setFormValidators() {
    this.profileFG1 = this.formBuilder.group({
      profileImage: [''],
      fileName: ['', [Validators.required]],
      businessName: ['', [Validators.pattern(environment.regex.nameRegex), Validators.maxLength(255), Validators.required]],
      tin: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      businessSummary: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address2: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: ['', [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]],
      email: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.emailRegex)]],
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
      contact_email: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.emailRegex)]],
      contact_phone_number: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.numberRegex)]],
      contactType: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
    });
  }
  getProfileInfoDropdowndata() {
    this.retialerService.getSellerTypes().subscribe(res => {
      this.sellerTypes = res;
    });
  }
  profileInfoNext() {
    this.readProfileInfo();
    this.validatorExt.validateAllFormFields(this.profileFG1);
    if (this.profileFG1.valid) {
      this.profileInfoStep = 2;
    }
  }
  profileInfoBack() {
    this.profileInfoStep = 1;
  }
  profileInfoSave() {
    this.readProfileInfo();
    this.validatorExt.validateAllFormFields(this.profileFG1);
    this.validatorExt.validateAllFormFields(this.profileFG2);
    if (!this.profileFG1.valid) {
      this.profileInfoBack();
    } else if (!this.profileFG2.valid) {
      this.profileInfoNext();
    } else {
      this.profileSaveloader = true;
      this.retialerService
        .profileInfoSave(this.profileInfoObj)
        .then(res => {
          // todo correct response
          this.retailerId = res._body;
          this.profileInfoObj.retailerId = this.retailerId;
          this.retailerIdChange.emit(this.retailerId);
          this.SaveData.emit('tab-Profile');
          // this.router.navigateByUrl('/retailer-list');
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Saved successfully',
            show: true
          };
          this.profileSaveloader = false;
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

  readProfileInfo() {
    this.profileInfoObj.businessLogoPath = this.profileFG1.value.profileImage;
    this.profileInfoObj.businessName = this.profileFG1.value.businessName;
    this.profileInfoObj.tin = this.profileFG1.value.tin;
    this.profileInfoObj.businessSummary = this.profileFG1.value.businessSummary;
    this.profileInfoObj.sellerTypeId = this.profileFG1.value.sellerTypeId;

    this.profileInfoObj.websiteUrl = this.profileFG2.value.websiteUrl;
    this.profileInfoObj.websiteUserName = this.profileFG2.value.websiteUserName;
    this.profileInfoObj.websitePassword = this.profileFG2.value.websitePassword;

    this.profileInfoObj.businessAddress = new RetailerBuinessAddress();
    this.profileInfoObj.businessAddress.addressLine1 = this.profileFG1.value.bussines_address;
    this.profileInfoObj.businessAddress.addressLine2 = this.profileFG1.value.bussines_address2;
    this.profileInfoObj.businessAddress.city = this.profileFG1.value.city;
    this.profileInfoObj.businessAddress.state = this.profileFG1.value.state;
    this.profileInfoObj.businessAddress.zipcode = this.profileFG1.value.zipcode;
    this.profileInfoObj.businessAddress.email = this.profileFG1.value.email;
    this.profileInfoObj.businessAddress.phoneNo = this.profileFG1.value.phone_number;

    this.profileInfoObj.contactPerson = new Array<RetailerContact>();
    const contact = new RetailerContact();
    contact.personName = this.profileFG2.value.contact_name;
    contact.position = this.profileFG2.value.contact_position;
    contact.addressLine1 = this.profileFG2.value.contact_address1;
    contact.addressLine2 = this.profileFG2.value.contact_address2;
    contact.city = this.profileFG2.value.contact_city;
    contact.state = this.profileFG2.value.contact_state;
    contact.zipcode = this.profileFG2.value.contact_zipcode;
    contact.email = this.profileFG2.value.contact_email;
    contact.phoneNo = this.profileFG2.value.contact_phone_number;
    contact.contactType = this.profileFG2.value.contactType;
    this.profileInfoObj.contactPerson.push(contact);
    this.profileDataChange.emit(this.profileInfoObj);
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
      this.fileName = fileInput.target.files[0].name;
      this.profileFG1.controls.fileName.patchValue(this.fileName);
    }
  }
  getProfileInfo(retailerId) {
    this.retialerService
      .profileInfoGet(this.retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.profileInfoObj = res;
        this.setData(this.profileInfoObj);
      });
  }
  setData(obj: RetailerProfileInfo) {
    if (!obj) { return; }
    this.profileFG1.patchValue({
      businessName: obj.businessName,
      tin: obj.tin,
      businessSummary: obj.businessSummary,
      sellerTypeId: obj.sellerTypeId,

      bussines_address: obj.businessAddress.addressLine1,
      bussines_address2: obj.businessAddress.addressLine2,
      city: obj.businessAddress.city,
      state: obj.businessAddress.state,
      zipcode: obj.businessAddress.zipcode,
      email: obj.businessAddress.email,
      phone_number: obj.businessAddress.phoneNo
    });

    this.profileFG2.patchValue({
      websiteUrl: obj.websiteUrl,
      websiteUserName: obj.websiteUserName,
      websitePassword: obj.websitePassword,

      contact_name: obj.contactPerson[0].personName,
      contact_position: obj.contactPerson[0].position,
      contact_address1: obj.contactPerson[0].addressLine1,
      contact_address2: obj.contactPerson[0].addressLine2,
      contact_city: obj.contactPerson[0].city,
      contact_state: obj.contactPerson[0].state,
      contact_zipcode: obj.contactPerson[0].zipcode,
      contact_email: obj.contactPerson[0].email,
      contact_phone_number: obj.contactPerson[0].phoneNo,
      contactType: obj.contactPerson[0].contactType

    });
  }
  // #endregion ProfileInfo



}

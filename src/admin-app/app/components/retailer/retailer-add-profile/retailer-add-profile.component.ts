// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress, PostalAddress } from '../../../../../models/retailer-business-adress';
import { RetailerContact } from '../../../../../models/retailer-contact';
import { RetialerService } from '../retialer.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt, ValidateAllZeros } from '../../../../../common/ValidatorExtensions';
import { inputValidations, userMessages } from './messages';
import { templateJitUrl, identifierModuleUrl } from '@angular/compiler';
import { CoreService } from '../../../services/core.service';
import { SellerType } from '../../../../../models/retailer';
// #endregion imports


@Component({
  selector: 'app-retailer-add-profile',
  templateUrl: './retailer-add-profile.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddProfileComponent implements OnInit {
  contactType: any;
  contactTypes: any[];
  @Input() retailerId: string;
  @Output() retailerIdChange = new EventEmitter<string>();
  @Output() SaveData = new EventEmitter<any>();
  @Input() profileData: RetailerProfileInfo;
  @Output() profileDataChange = new EventEmitter<RetailerProfileInfo>();
  // #region declarations

  profileFG1 = new FormGroup({});
  profileFG2 = new FormGroup({});
  profileFG3 = new FormGroup({});
  sellerTypes: Array<SellerType> = new Array<SellerType>();
  profileInfoStep = 1;
  profileInfoObj = new RetailerProfileInfo();
  uploadFile: any;
  fileName = '';
  errorMsgs = inputValidations;
  profileSaveloader = false;
  oldBusinessName: string;
  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
  }
  ngOnInit() {
    this.getContactsNames();
    this.profileInfoObj = new RetailerProfileInfo();
    this.setFormValidators();
    this.getProfileInfoDropdowndata();
    if (this.retailerId) {
      this.getProfileInfo(this.retailerId);
    }
  }

  setFormValidators() {
    this.oldBusinessName = this.profileData.businessName;
    this.profileFG1 = this.formBuilder.group({
      profileImage: [''],
      fileName: [''],
      businessName: [this.profileData.businessName, [Validators.pattern(environment.regex.nameRegex), Validators.maxLength(255), Validators.required]],
      tin: [this.profileData.tin, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      businessSummary: [this.profileData.businessSummary, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address: [this.profileData.businessAddress.addressLine1, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      bussines_address2: [this.profileData.businessAddress.addressLine2, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      city: [this.profileData.businessAddress.city, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.profileData.businessAddress.state, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.profileData.businessAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberRegex), Validators.required]],
      email: [this.profileData.businessAddress.email, [Validators.maxLength(255), Validators.pattern(environment.regex.emailRegex)]],
      phone_number: [this.profileData.businessAddress.phoneNo, [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.numberRegex)]],
      sellerTypeId: [this.profileData.sellerTypeId, [Validators.required]]
    });
    this.profileFG3 = this.formBuilder.group({
      websiteUrl: [this.profileData.websiteUrl, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      websiteUserName: [this.profileData.websiteUserName, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      websitePassword: [this.profileData.websitePassword, [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
    });
    this.profileFG2 = this.formBuilder.group({
      contact_type: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      contact_type_name: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      contact_name: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      contact_position: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex), Validators.required]],
      contact_address1: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex),]],
      contact_address2: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
      contact_city: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex),]],
      contact_state: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex),]],
      contact_zipcode: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(environment.regex.numberRegex),]],
      contact_email: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.emailRegex), Validators.required]],
      contact_phone_number: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.numberRegex), Validators.required]],
      contactType: ['', [Validators.maxLength(255), Validators.pattern(environment.regex.textRegex)]],
    });
    this.profileData.contactPerson.map(p => {
      if (this.contactTypes.filter(q => q.type === p.contactType).length === 0) {
        const newContactType = { type: p.contactType, default: false, status: true };
        this.contactTypes.push(newContactType);
      }
    });

  }
  getProfileInfoDropdowndata() {
    this.retialerService.getSellerTypes().subscribe(res => {
      this.sellerTypes = res;
    });
  }
  getContactsNames() {
    this.contactTypes = [
      { type: userMessages.contacts.primary, default: true, status: false },
      { type: userMessages.contacts.general, default: true, status: false },
      { type: userMessages.contacts.billing, default: true, status: false },
      { type: userMessages.contacts.shipping, default: true, status: false },
      { type: userMessages.contacts.addnew, default: true, status: false },
    ];

  }
  contactTypeSelected(event) {
    if (this.profileFG2.value.contact_type.type === userMessages.contacts.addnew) {
      this.profileFG2.controls.contact_type_name.reset({ value: '', disabled: false });
    } else {
      this.profileFG2.controls.contact_type_name.reset({ value: this.profileFG2.value.contact_type.type, disabled: this.profileFG2.value.contact_type.default });
    }
    this.loadConatactType(this.profileFG2.controls.contact_type_name.value);
  }
  contactTypeNameChanged(event) {
    // this.profileFG2.controls.contact_type.reset({ value: this.profileFG2.value.contact_type, disabled: true });
    if (this.profileFG2.value.contact_type.type !== this.profileFG2.value.contact_type_name) {
      const newContactType = { type: this.profileFG2.value.contact_type_name, default: false, status: true };
      if (this.profileFG2.value.contact_type.type !== userMessages.contacts.addnew) {
        this.contactTypes.splice(this.contactTypes.indexOf(this.profileFG2.value.contact_type), 1);
      }
      this.contactTypes.push(newContactType);
      this.profileFG2.controls.contact_type.patchValue(newContactType);
    }
  }
  loadConatactType(contactType) {
    let contact = this.profileInfoObj.contactPerson.filter(p => p.contactType === contactType)[0];
    if (!contact) {
      contact = new RetailerContact();
    }
    this.profileFG2.patchValue({
      contactType: contact.contactType,
      contact_name: contact.name,
      contact_position: contact.position,
      contact_address1: contact.addressLine1,
      contact_address2: contact.addressLine2,
      contact_city: contact.city,
      contact_state: contact.state,
      contact_zipcode: contact.zipcode,
      contact_email: contact.email,
      contact_phone_number: contact.phoneNo
    });
  }
  saveContact() {
    this.validatorExt.validateAllFormFields(this.profileFG2);
    if (this.profileFG2.invalid) {
      this.core.message.error(userMessages.contactError, userMessages.contactErrorTitle);
      return;
    }
    // this.profileFG2.controls.contact_type.reset({ value: this.profileFG2.value.contact_type, disabled: false });
    const contact = this.profileInfoObj.contactPerson.filter(p => p.contactType === this.profileFG2.controls.contact_type_name.value)[0] || new RetailerContact();
    contact.contactType = this.profileFG2.controls.contact_type_name.value;
    contact.name = this.profileFG2.value.contact_name;
    contact.position = this.profileFG2.value.contact_position;
    contact.addressLine1 = this.profileFG2.value.contact_address1;
    contact.addressLine2 = this.profileFG2.value.contact_address2;
    contact.city = this.profileFG2.value.contact_city;
    contact.state = this.profileFG2.value.contact_state;
    contact.zipcode = this.profileFG2.value.contact_zipcode;
    contact.email = this.profileFG2.value.contact_email;
    contact.phoneNo = this.profileFG2.value.contact_phone_number;
    if (this.profileInfoObj.contactPerson.filter(p => p.contactType === contact.contactType).length > 0) {
      this.core.message.success(userMessages.contactUpdated);
    } else {
      this.profileInfoObj.contactPerson.push(contact);
      this.core.message.success(userMessages.contactAdded);
    }
  }
  removeContact() {
    const contact = this.profileInfoObj.contactPerson.filter(p => p.contactType === this.profileFG2.value.contact_type.type)[0];
    if (contact) {
      this.profileInfoObj.contactPerson.splice(this.profileInfoObj.contactPerson.indexOf(contact), 1);
      this.core.message.success(userMessages.contactRemoved);
    }
    if (!this.profileFG2.value.contact_type.default) {
      this.contactTypes.splice(this.contactTypes.indexOf(this.profileFG2.value.contact_type), 1);
    }
    this.loadConatactType('');
  }
  profileInfoNext() {
    this.readProfileInfo();
    this.validatorExt.validateAllFormFields(this.profileFG1);
    if (!this.retailerId && this.profileFG1.controls.fileName.value === '') {
      this.core.message.info(userMessages.pleaseSelectLogo);
      return;
    }
    if (this.profileFG1.valid) {
      this.profileInfoStep = 2;
      this.setDefaultContact();
    } else {
      this.core.message.info(userMessages.requiredFeilds);
    }
  }
  profileInfoBack() {
    this.profileInfoStep = 1;
  }

  async profileInfoSave() {
    this.readProfileInfo();
    this.validatorExt.validateAllFormFields(this.profileFG1);
    this.validatorExt.validateAllFormFields(this.profileFG3);
    if (!this.retailerId || this.oldBusinessName !== this.profileInfoObj.businessName) {
      const nameTaken = await this.retialerService.checkSellerName(this.profileInfoObj.businessName);
      if (nameTaken) {
        this.core.message.error(userMessages.duplicateBusinessName);
        return false;
      }
    }
    if (this.profileInfoObj.contactPerson.length === 0) {
      this.core.message.info(userMessages.noContacts);
      return;
    }
    if (!this.profileFG1.valid) {
      this.profileInfoBack();
    } else if (!this.profileFG3.valid) {
      this.profileInfoNext();
      this.core.message.info(userMessages.requiredFeilds);
    } else {
      if (!this.retailerId) {
        this.profileInfoObj.status = true;
      }
      this.profileSaveloader = true;
      this.retialerService
        .profileInfoSave(this.profileInfoObj)
        .subscribe(res => {
          this.retailerId = res.retailerId;
          this.profileInfoObj.retailerId = this.retailerId;
          this.retailerIdChange.emit(this.retailerId);
          this.SaveData.emit('tab-Profile');
          this.core.message.success(userMessages.success);
          return true;
        }, err => this.core.message.error(userMessages.error), () => this.profileSaveloader = false);
    }
    return false;
  }

  readProfileInfo() {
    if (this.retailerId) {
      this.profileInfoObj.retailerId = this.retailerId;
    }
    if (this.profileFG1.value.fileName !== '') {
      this.profileFG1.controls.profileImage.updateValueAndValidity();
    }
    this.profileInfoObj.businessLogoPath = this.profileFG1.value.profileImage;
    this.profileInfoObj.businessName = this.profileFG1.value.businessName;
    this.profileInfoObj.tin = this.profileFG1.value.tin;
    this.profileInfoObj.businessSummary = this.profileFG1.value.businessSummary;
    this.profileInfoObj.sellerTypeId = this.profileFG1.value.sellerTypeId;

    this.profileInfoObj.websiteUrl = this.profileFG3.value.websiteUrl;
    this.profileInfoObj.websiteUserName = this.profileFG3.value.websiteUserName;
    this.profileInfoObj.websitePassword = this.profileFG3.value.websitePassword;

    this.profileInfoObj.businessAddress = this.profileInfoObj.businessAddress || new RetailerBuinessAddress();
    this.profileInfoObj.businessAddress.addressLine1 = this.profileFG1.value.bussines_address;
    this.profileInfoObj.businessAddress.addressLine2 = this.profileFG1.value.bussines_address2;
    this.profileInfoObj.businessAddress.city = this.profileFG1.value.city;
    this.profileInfoObj.businessAddress.state = this.profileFG1.value.state;
    this.profileInfoObj.businessAddress.zipcode = this.profileFG1.value.zipcode;
    this.profileInfoObj.businessAddress.email = this.profileFG1.value.email;
    this.profileInfoObj.businessAddress.phoneNo = this.profileFG1.value.phone_number;

    this.profileInfoObj.addresses = new Array<PostalAddress>();
    this.profileInfoObj.addresses.push(this.profileInfoObj.businessAddress);
    this.profileInfoObj.contactPerson.forEach(p => { p.addressType = p.contactType; this.profileInfoObj.addresses.push(p); });

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
      this.profileFG1.controls.fileName.updateValueAndValidity();
    }
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(this.retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.profileData = res;
        this.setFormValidators();
        this.profileInfoObj = new RetailerProfileInfo(this.profileData);
      });
  }
  setDefaultContact() {
    if (this.profileFG2.get('contact_type').value === '') {
      if (this.profileData.contactPerson.filter(p => p.contactType === this.contactTypes[0].type).length > 0) {
        this.profileFG2.get('contact_type').patchValue(this.contactTypes[0]);
        this.contactTypeSelected(null);
        // this.loadConatactType(this.contactTypes[0].type);
      }
    }
  }

  // #endregion ProfileInfo
}

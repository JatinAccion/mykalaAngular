import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerBuinessAddress } from '../../../../../models/retailer-business-adress';
import { RetailerPrimaryContact } from '../../../../../models/retailer-contact';
import { RetialerService } from '../retialer.service';

@Component({
  selector: 'app-retailer-add',
  templateUrl: './retailer-add.component.html',
  styleUrls: ['./retailer-add.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddComponent implements OnInit {
  currentOrientation = 'vertial';
  currentJustify = 'end';
  retailer: Retailer;
  profileInfo: FormGroup;
  businessNameRegex = new RegExp('^[a-zA-Z0-9_.-]*$');
  tinRegex = new RegExp('^[a-zA-Z0-9_.-]*$');
  normalTextRegex = new RegExp('^[a-zA-Z0-9_.-]*$');
  // ProfileInfo
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  profileInfoStep = 1;
  profileInfoObj = new RetailerProfileInfo();
  // ProfileInfo

  // tslint:disable-next-line:whitespace
  constructor(private formBuilder: FormBuilder, private router: Router, private retialerService: RetialerService) { }

  ngOnInit() {
    this.profileInfo = this.formBuilder.group({
      businessName: ['', [Validators.required]],
      tin: ['', [Validators.required]],
      businessSummary: ['', [Validators.required]],
      bussines_address: ['', [Validators.required]],
      bussines_address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      sellerTypeId: ['', [Validators.required]],
      websiteUrl: ['', [Validators.required]],
      websiteUserName: ['', [Validators.required]],
      websitePassword: ['', [Validators.required]],
      contact_name: ['', [Validators.required]],
      contact_position: ['', [Validators.required]],
      contact_address1: ['', [Validators.required]],
      contact_address2: ['', [Validators.required]],
      contact_city: ['', [Validators.required]],
      contact_state: ['', [Validators.required]],
      contact_zipcode: ['', [Validators.required]],
      contact_email: ['', [Validators.required, Validators.email]],
      contact_phone_number: ['', [Validators.required]],
    });
    this.sellerTypes.push(new nameValue('1', 'AC & Heating'));
    this.sellerTypes.push(new nameValue('2', 'Interior Design'));
    this.sellerTypes.push(new nameValue('3', 'Manufacturing'));
  }
  profileInfoNext() {
    this.profileInfoStep = 2;
    this.getProfileInfo();
  }
  profileInfoBack() {
    this.profileInfoStep = 1;
  }
  profileInfoSave() {
    this.getProfileInfo();
    this.retialerService.profileInfoSave(this.profileInfoObj)
      .then((res) => {
        this.profileInfoObj.retailerId = res.retailerId;
        this.router.navigateByUrl('/retailer-list');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getProfileInfo() {
    this.profileInfoObj.businessLogoPath = this.profileInfo.value.businessName;
    this.profileInfoObj.businessName = this.profileInfo.value.businessName;
    this.profileInfoObj.tin = this.profileInfo.value.tin;
    this.profileInfoObj.businessSummary = this.profileInfo.value.businessSummary;
    this.profileInfoObj.sellerTypeId = this.profileInfo.value.sellerTypeId;

    this.profileInfoObj.websiteUrl = this.profileInfo.value.websiteUrl;
    this.profileInfoObj.websiteUserName = this.profileInfo.value.websiteUserName;
    this.profileInfoObj.websitePassword = this.profileInfo.value.websitePassword;

    this.profileInfoObj.businessAdresses = new Array<RetailerBuinessAddress>();
    const retailerBusinessAddress = new RetailerBuinessAddress();
    retailerBusinessAddress.addressLine1 = this.profileInfo.value.bussines_address;
    retailerBusinessAddress.addressLine2 = this.profileInfo.value.bussines_address2;
    retailerBusinessAddress.city = this.profileInfo.value.city;
    retailerBusinessAddress.state = this.profileInfo.value.state;
    retailerBusinessAddress.zipcode = this.profileInfo.value.zipcode;
    retailerBusinessAddress.email = this.profileInfo.value.email;
    retailerBusinessAddress.phoneNo = this.profileInfo.value.phone_number;
    this.profileInfoObj.businessAdresses.push(retailerBusinessAddress);

    this.profileInfoObj.primaryContact = new RetailerPrimaryContact();

    this.profileInfoObj.primaryContact.personName = this.profileInfo.value.contact_name;
    this.profileInfoObj.primaryContact.position = this.profileInfo.value.contact_position;
    this.profileInfoObj.primaryContact.addressLine1 = this.profileInfo.value.contact_address1;
    this.profileInfoObj.primaryContact.addressLine2 = this.profileInfo.value.contact_address2;
    this.profileInfoObj.primaryContact.city = this.profileInfo.value.contact_city;
    this.profileInfoObj.primaryContact.state = this.profileInfo.value.contact_state;
    this.profileInfoObj.primaryContact.zipcode = this.profileInfo.value.contact_zipcode;
    this.profileInfoObj.primaryContact.email = this.profileInfo.value.contact_email;
    this.profileInfoObj.primaryContact.phoneNo = this.profileInfo.value.contact_phone_number;
    return this.profileInfoObj;
  }

}

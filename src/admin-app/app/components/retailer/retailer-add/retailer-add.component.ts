import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { ProfileInfo } from '../../../../../models/profile-info';

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
  //ProfileInfo
  sellerTypes: Array<nameValue> = new Array<nameValue>();
  profileInfoStep = 1;
  profileInfoObj = new ProfileInfo();
  //ProfileInfo

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.profileInfo = this.formBuilder.group({
      bussines_name: ['', [Validators.required]],
      tin: ['', [Validators.required]],
      bussines_summary: ['', [Validators.required]],
      bussines_address: ['', [Validators.required]],
      bussines_address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      seller_type: ['', [Validators.required]],
      website: ['', [Validators.required]],
      website_username: ['', [Validators.required]],
      website_password: ['', [Validators.required]],
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

  }
  getProfileInfo() {
    this.profileInfoObj.bussines_name = this.profileInfo.value.bussines_name;
    this.profileInfoObj.tin = this.profileInfo.value.tin;
    this.profileInfoObj.bussines_summary = this.profileInfo.value.bussines_summary;
    this.profileInfoObj.bussines_address = this.profileInfo.value.bussines_address;
    this.profileInfoObj.bussines_address2 = this.profileInfo.value.bussines_address2;
    this.profileInfoObj.city = this.profileInfo.value.city;
    this.profileInfoObj.state = this.profileInfo.value.state;
    this.profileInfoObj.zipcode = this.profileInfo.value.zipcode;
    this.profileInfoObj.email = this.profileInfo.value.email;
    this.profileInfoObj.phone_number = this.profileInfo.value.phone_number;
    this.profileInfoObj.seller_type = this.profileInfo.value.seller_type;

    this.profileInfoObj.website = this.profileInfo.value.website;
    this.profileInfoObj.website_username = this.profileInfo.value.website_username;
    this.profileInfoObj.website_password = this.profileInfo.value.website_password;
    this.profileInfoObj.contact_name = this.profileInfo.value.contact_name;
    this.profileInfoObj.contact_position = this.profileInfo.value.contact_position;
    this.profileInfoObj.contact_address1 = this.profileInfo.value.contact_address1;
    this.profileInfoObj.contact_address2 = this.profileInfo.value.contact_address2;
    this.profileInfoObj.contact_city = this.profileInfo.value.contact_city;
    this.profileInfoObj.contact_state = this.profileInfo.value.contact_state;
    this.profileInfoObj.contact_zipcode = this.profileInfo.value.contact_zipcode;
    this.profileInfoObj.contact_email = this.profileInfo.value.contact_email;
    this.profileInfoObj.contact_phone_number = this.profileInfo.value.contact_phone_number;
    return this.profileInfoObj;
  }

}

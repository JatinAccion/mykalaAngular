import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProfileInfoService } from './profile-info.service';
import { ConsumerProfileInfo } from '../../../../models/consumer-profile-info';
import { ConsumerAddress } from '../../../../models/consumer-address';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {
  profileInfo: FormGroup;
  phoneRegex: '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;';
  zipCodeRegex: '^\d{5}(?:[-\s]\d{4})?$';
  fetchGeoCode: string;
  profileInformation: ConsumerProfileInfo;
  getCSC: any;

  constructor(private profileInfoServ: ProfileInfoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.profileInfo = this.formBuilder.group({
      "profileImage": [''],
      "username": [''],
      "firstname": [''],
      "lastname": [''],
      "phoneno": ['', Validators.compose([Validators.pattern(this.phoneRegex), Validators.minLength(10), Validators.maxLength(10)])],
      "email": [''],
      "gender": [''],
      "dteOfBirth": [''],
      "location": ['', Validators.compose([Validators.required, Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(6)])]
    });
  }

  /*Geocode API Integration*/
  onBlurMethod() {
    this.profileInfoServ.getLocation(this.profileInfo.controls.location.value)
      .subscribe(data => {
        this.fetchGeoCode = data.results[0].formatted_address;
        console.log(this.fetchGeoCode);
        this.getCSC = {
          "city": this.fetchGeoCode.split(',')[0],
          "country": this.fetchGeoCode.split(',')[2],
          "state": this.fetchGeoCode.split(',')[1].trim().split(" ")[0]
        }
      });
  }

  onSubmit() {
    /*Request JSON*/
    this.profileInformation.userName = this.profileInfo.controls.username.value;
    this.profileInformation.firstName = this.profileInfo.controls.firstname.value;
    this.profileInformation.lastName = this.profileInfo.controls.lastname.value;
    this.profileInformation.consumerImagePath = this.profileInfo.controls.profileImage.value;
    this.profileInformation.phoneNo = this.profileInfo.controls.phoneno.value;
    this.profileInformation.email = this.profileInfo.controls.email.value;
    this.profileInformation.gender = this.profileInfo.controls.gender.value;
    this.profileInformation.dob = this.profileInfo.controls.dob.value;
    this.profileInformation.status = "";
    this.profileInformation.createdBy = "";
    this.profileInformation.modifiedBy = "";
    this.profileInformation.consumerAddress = new ConsumerAddress();
    this.profileInformation.consumerAddress.ad1 = "";
    this.profileInformation.consumerAddress.ad2 = "";
    this.profileInformation.consumerAddress.city = this.getCSC.city;
    this.profileInformation.consumerAddress.state = this.getCSC.state;
    this.profileInformation.consumerAddress.country = this.getCSC.country;
    this.profileInformation.consumerAddress.zipcode = this.profileInfo.controls.location.value;
    this.profileInformation.consumerAddress.createdBy = "";
    this.profileInformation.consumerAddress.modifiedBy = "";
    this.profileInformation.consumerAddress.status = "";

    console.log(this.profileInfo)
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProfileInfoService } from '../../services/profile-info.service';
import { ConsumerProfileInfo } from '../../../../models/consumer-profile-info';
import { ConsumerAddress } from '../../../../models/consumer-address';
import { userMessages, inputValidation } from './profile.messages';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {
  savedImage: string;
  loader: boolean = false;
  getUserInfo = JSON.parse(window.localStorage['userInfo']);
  profileInfo: FormGroup;
  phoneRegex: '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;';
  zipCodeRegex: '^\d{5}(?:[-\s]\d{4})?$';
  profileUserMsg = userMessages;
  profileInputValMsg = inputValidation;
  fetchGeoCode: string;
  profileInformation = new ConsumerProfileInfo();
  getCSC: any;
  getImageUrl: string;
  uploadFile: any;
  staticURL: string = 'https://s3.us-east-2.amazonaws.com';
  profileInfoResponse = {
    status: false,
    response: "",
    message: ""
  };
  activationPath: string = window.location.origin + '/thank';

  constructor(private profileInfoServ: ProfileInfoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.profileInfo = this.formBuilder.group({
      "profileImage": [''],
      "phoneno": ['', Validators.compose([Validators.pattern(this.phoneRegex), Validators.minLength(10), Validators.maxLength(10)])],
      "email": [this.getUserInfo.emailId],
      "gender": [''],
      "dateOfBirth": [''],
      "location": ['', Validators.compose([Validators.required, Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])]
    });
  }

  /*Geocode API Integration*/
  getLocation() {
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
  };

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  }

  fileChangeEvent(fileInput: any, profileInfo) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        profileInfo.controls.profileImage.value = e.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onSubmit(profileInfo) {
    this.loader = true;
    /*Request JSON*/
    this.profileInformation.userId = this.getUserInfo.userId;
    this.profileInformation.userName = "";
    this.profileInformation.firstName = this.getUserInfo.firstName;
    this.profileInformation.lastName = this.getUserInfo.lastName;
    this.profileInformation.consumerImagePath = this.profileInfo.controls.profileImage.value;
    this.profileInformation.phoneNo = this.profileInfo.controls.phoneno.value;
    this.profileInformation.email = this.profileInfo.controls.email.value;
    this.profileInformation.gender = this.profileInfo.controls.gender.value;
    this.profileInformation.dob = this.profileInfo.controls.dateOfBirth.value;
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

    this.profileInfoServ.completeProfile(this.profileInformation).subscribe(res => {
      this.loader = false;
      this.profileInfoResponse.status = true;
      if (this.profileInfoResponse.response !== null) {
        this.profileInfoResponse.response = 'success';
        this.savedImage = this.staticURL.concat('/' + res);
        window.localStorage['profileImage'] = this.savedImage;
        this.profileInfoResponse.message = this.profileUserMsg.success;
      }
    }, err => {
      this.loader = false;
      this.profileInfoResponse.status = true;
      this.profileInfoResponse.message = this.profileUserMsg.fail;
    });
  }

}

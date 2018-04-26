import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProfileInfoService } from '../../services/profile-info.service';
import { ConsumerProfileInfo } from '../../../../models/consumer-profile-info';
import { ConsumerAddress } from '../../../../models/consumer-address';
import { userMessages, inputValidation } from './profile.messages';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { AbstractControl } from '@angular/forms/src/model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { regexPatterns } from '../../../../common/regexPatterns';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {
  @Input() hideNavi: string;
  savedImage: string;
  loader: boolean = false;
  loaderLocation: boolean = false;
  getUserInfo = JSON.parse(window.localStorage['userInfo']);
  profileInfo: FormGroup;
  zipCodeRegex = regexPatterns.zipcodeRegex;
  profileUserMsg = userMessages;
  profileInputValMsg = inputValidation;
  fetchGeoCode: string;
  profileInformation = new ConsumerProfileInfo();
  getImageUrl: string;
  uploadFile: any;
  staticURL: string = 'https://s3.us-east-2.amazonaws.com';
  profileInfoResponse = {
    status: false,
    response: "",
    message: ""
  };
  minDate;
  maxDate;
  today = new Date();

  constructor(private routerOutlet: RouterOutlet, private router: Router, private profileInfoServ: ProfileInfoService, private formBuilder: FormBuilder, public core: CoreService) {
    this.minDate = { year: 1940, month: 1, day: 1 };
    this.maxDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  }

  ngOnInit() {
    /**Clearing the Logged In Session */
    localStorage.removeItem('token');
    this.core.clearUser();
    this.core.hideUserInfo(true);
    /**Clearing the Logged In Session */
    this.core.headerScroll();
    this.core.hide();
    this.core.searchMsgToggle();
    this.core.pageLabel();
    this.profileInfo = this.formBuilder.group({
      "profileImage": [''],
      "gender": [''],
      "dateOfBirth": [''],
      "location": ['', Validators.compose([Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])]
    });
  };

  /*Geocode API Integration*/
  _keuyp(e) {
    this.fetchGeoCode = '';
    let input = e.currentTarget;
    if (this.profileInfo.controls.location.value.length == 5 && this.profileInfo.controls.location.errors == null) {
      this.loaderLocation = true;
      input.setAttribute('readonly', true);
      this.profileInfoServ.getLocation(this.profileInfo.controls.location.value)
        .subscribe(data => {
          this.loaderLocation = false;
          input.removeAttribute('readonly');
          this.fetchGeoCode = data.results[0].formatted_address;
          this.profileInformation.address = new Array<ConsumerAddress>();
          this.profileInformation.address.push(new ConsumerAddress('', '', '', this.fetchGeoCode.split(',')[0], this.fetchGeoCode.split(',')[1].trim().split(" ")[0], this.profileInfo.controls.location.value, 'profileAddress'))
        });
    }
  };

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  };

  fileChangeEvent(fileInput: any, profileInfo) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        profileInfo.controls.profileImage.value = e.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  };

  onSubmit(profileInfo) {
    this.loader = true;
    this.profileInformation.userId = this.getUserInfo.userId;
    this.profileInformation.firstName = this.getUserInfo.firstName;
    this.profileInformation.lastName = this.getUserInfo.lastName;
    this.profileInformation.emailId = this.getUserInfo.emailId;
    this.profileInformation.consumerImagePath = this.profileInfo.controls.profileImage.value;
    this.profileInformation.gender = this.profileInfo.controls.gender.value;
    this.profileInformation.dateOfBirth = this.profileInfo.controls.dateOfBirth.value.year + '-' + this.profileInfo.controls.dateOfBirth.value.month + '-' + this.profileInfo.controls.dateOfBirth.value.day;

    this.profileInfoServ.completeProfile(this.profileInformation).subscribe(res => {
      this.loader = false;
      if (this.profileInfoResponse.response !== null) {
        window.localStorage['userInfo'] = res;
        setTimeout(() => {
          if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
          this.router.navigateByUrl('/interest');
        }, 1000);
      }
    }, err => {
      this.loader = false;
      this.profileInfoResponse.status = true;
      this.profileInfoResponse.message = this.profileUserMsg.fail;
    });
  }

}

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MyAccountGetModel, MyAccountConsumerInterest, MyaccountProfileInfo, MyAccountUserData, MyAccountAddress } from '../../../../models/myAccountGet';
import { CoreService } from '../../services/core.service';
import { MyAccountService } from '../../services/myAccount.service';
import { environment } from '../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyaccountComponent implements OnInit {
  loader: boolean = false;
  myAccountModel = new MyAccountGetModel();
  imgS3: string;
  input_Email: boolean = false;
  append_Email: string;
  @ViewChild('emailElement') emailElement: ElementRef
  input_Password: boolean = false;
  append_Password: string;
  append_NewPassword: string;
  append_ConfirmPassword: string;
  invalidPassword: boolean = false;
  oldNewPassword: boolean = false;
  newConfirmPassword: boolean = false;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  @ViewChild('passwordElement') passwordElement: ElementRef
  input_Location: boolean = false;
  input_getLocation: boolean = false;
  append_Location: string;
  fetchGeoCode: string;
  @ViewChild('locationElement') locationElement: ElementRef
  input_dob: boolean = false;
  append_dob: any;
  minDate;
  maxDate;
  model: NgbDateStruct;
  today = new Date();
  @ViewChild('dobElement') dobElement: ElementRef

  constructor(
    private core: CoreService,
    private myAccount: MyAccountService
  ) {
    this.minDate = { year: 1940, month: 1, day: 1 };
    this.maxDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.imgS3 = environment.s3;
    this.myAccount.getUserDetails().subscribe((res) => {
      this.myAccountModel.profileInfo = new MyaccountProfileInfo();
      this.myAccountModel.userData = new MyAccountUserData();
      this.myAccountModel.profileInfo.consumerInterests = new Array<MyAccountConsumerInterest>();
      this.myAccountModel.profileInfo.address = new Array<MyAccountAddress>();
      this.myAccountModel.profileInfo.address = res.address;
      this.myAccountModel.profileInfo.consumerImagePath = this.imgS3.concat(res.consumerImagePath);
      this.myAccountModel.profileInfo.consumerInterests = res.consumerInterests;
      this.myAccountModel.profileInfo.birthDate = new Date(res.dateOfBirth).getDate().toString();
      this.myAccountModel.profileInfo.birthMonth = (new Date(res.dateOfBirth).getMonth() + 1).toString();
      this.myAccountModel.profileInfo.birthYear = new Date(res.dateOfBirth).getFullYear().toString();
      this.myAccountModel.userData.emailId = res.emailId;
      this.myAccountModel.userData.password = "......";
      this.myAccountModel.profileInfo.firstName = res.firstName;
      this.myAccountModel.profileInfo.lastName = res.lastName;
      this.myAccountModel.profileInfo.gender = res.gender;
      this.myAccountModel.userId = res.userId;
    })
  }

  selectSelected(e) {
    this.model = {
      year: parseFloat(this.myAccountModel.profileInfo.birthYear),
      month: parseFloat(this.myAccountModel.profileInfo.birthMonth),
      day: parseFloat(this.myAccountModel.profileInfo.birthDate)
    };
    if (e.currentTarget.innerText == 'Done') this.append_dob = this.model;
  }

  _keuyp(e) {
    this.input_getLocation = false;
    this.fetchGeoCode = '';
    let input = e.currentTarget;
    if (this.append_Location.toString().length == 5) {
      this.loader = true;
      input.setAttribute('readonly', true);
      this.myAccount.getLocation(this.append_Location)
        .subscribe(data => {
          this.loader = false;
          this.input_getLocation = true;
          input.removeAttribute('readonly');
          this.fetchGeoCode = data.results[0].formatted_address;
          for (var i = 0; i < this.myAccountModel.profileInfo.address.length; i++) {
            let address = this.myAccountModel.profileInfo.address[i]
            if (address.addressType == 'profileAddress') {
              address.city = this.fetchGeoCode.split(',')[0];
              address.state = this.fetchGeoCode.split(',')[1].trim().split(" ")[0];
              address.zipcode = this.append_Location;
            }
          }
        });
    }
  };

  appendInput(e, element) {
    this.hideAllInputs();
    if (e.currentTarget.innerText == 'Done') {
      this.removeInput(e, element);
      return false;
    }
    else {
      e.currentTarget.innerText = 'Done';
      if (element == 'email') {
        this.input_Email = true;
        this.append_Email = this.emailElement.nativeElement.innerText;
      }
      else if (element == 'password') {
        this.input_Password = true;
        this.append_Password = this.passwordElement.nativeElement.innerText;
      }
      else if (element == 'location') {
        this.input_Location = true;
        this.append_Location = this.locationElement.nativeElement.innerText;
      }
      else if (element == 'dob') {
        this.input_dob = true;
        this.append_dob = this.dobElement.nativeElement.innerText;
      }
    }
  }

  removeInput(e, element) {
    e.currentTarget.innerText = 'change';
    if (element == 'email') {
      this.input_Email = false;
      this.myAccountModel.userData.emailId = this.append_Email;
      setTimeout(() => this.emailElement.nativeElement.innerText = this.append_Email, 100);
    }
    else if (element == 'password') {
      this.input_Password = false;
      this.myAccountModel.userData.password = this.append_Password;
      setTimeout(() => this.passwordElement.nativeElement.innerText = this.append_Password, 100);
    }
    else if (element == 'location') this.input_Location = false;
    else if (element == 'dob') {
      this.input_dob = false;
      this.myAccountModel.profileInfo.birthDate = this.append_dob.day.toString();
      this.myAccountModel.profileInfo.birthMonth = this.append_dob.month.toString();
      this.myAccountModel.profileInfo.birthYear = this.append_dob.year.toString();
      return false;
    }
  }

  passwordValidator() {
    this.hideAllInputs();
    if (this.passwordRegex.test(this.append_Password) == false) {
      this.invalidPassword = true;
      return false;
    }
    else if (this.passwordRegex.test(this.append_NewPassword) == false) {
      this.invalidPassword = true;
      return false;
    }
    else if (this.passwordRegex.test(this.append_ConfirmPassword) == false) {
      this.invalidPassword = true;
      return false;
    }
    else if (this.append_Password == this.append_NewPassword) {
      this.oldNewPassword = true;
      return false;
    }
    else if (this.append_NewPassword != this.append_ConfirmPassword) {
      this.newConfirmPassword = true;
      return false;
    }
    else {
      this.invalidPassword = false;
      this.oldNewPassword = false;
      this.newConfirmPassword = false;
    }
  }

  hideAllInputs() {
    this.input_Email = false;
    this.input_Password = false;
    this.input_Location = false;
    this.input_dob = false;
    this.input_getLocation = false;
    this.oldNewPassword = false;
    this.newConfirmPassword = false;
    this.invalidPassword = false;
  }

}

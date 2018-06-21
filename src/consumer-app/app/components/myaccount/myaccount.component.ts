import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MyAccountGetModel, MyAccountConsumerInterest, MyaccountProfileInfo, MyAccountUserData, MyAccountAddress } from '../../../../models/myAccountGet';
import { CoreService } from '../../services/core.service';
import { MyAccountService } from '../../services/myAccount.service';
import { environment } from '../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GetCustomerCards } from '../../../../models/getCards';
import { StripeAddCardModel } from '../../../../models/StripeAddCard';
import { StripeCheckoutModal } from '../../../../models/StripeCheckout';
import { NgForm } from '@angular/forms';
import { MyAccountProfileModel, MyAccountEmailModel, MyAccountPasswordModel, MyAccountAddressModel, MyAccountDOBModel, MyAccountInterestModel } from '../../../../models/myAccountPost';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyaccountComponent implements OnInit, AfterViewInit, OnDestroy {
  addCard: boolean = false;
  savedCardDetails: any;
  // card: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardZip: any;
  getStates: any;
  readStripe: boolean = false;
  error: string;
  cardHandler = this.onChange.bind(this);
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('cardNumber') cardNumberInfo: ElementRef;
  @ViewChild('cardExpiry') cardExpiryInfo: ElementRef;
  @ViewChild('cardCvc') cardCvcInfo: ElementRef;
  @ViewChild('cardZip') cardZipInfo: ElementRef;
  cardNumberBrand: any;
  cardBrandToPfClass = {
    'visa': 'pf-visa',
    'mastercard': 'pf-mastercard',
    'amex': 'pf-american-express',
    'discover': 'pf-discover',
    'diners': 'pf-diners',
    'jcb': 'pf-jcb',
    'unknown': 'pf-credit-card',
  }
  getAPICP: any;
  stripeAddCard = new StripeAddCardModel();
  stripeCheckout = new StripeCheckoutModal();
  getCardsDetails: any;
  uploadFile: any;
  loader: boolean = false;
  loader_profileImage: boolean = false;
  loader_emailImage: boolean = false;
  loader_password: boolean = false;
  loader_profileAddress: boolean = false;
  loader_DOB: boolean = false;
  loader_Interest: boolean = false;
  loader_shippingAddress: boolean = false;
  loader_Card: boolean = false;
  loader_addCard: boolean = false;
  myAccountModel = new MyAccountGetModel();
  imgS3: string;
  input_Email: boolean = false;
  append_Email: string;
  emptyEmailAddress: boolean = false;
  invalidEmailAddress: boolean = false;
  emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]+[a-zA-Z0-9]{2,4}$');
  @ViewChild('emailElement') emailElement: ElementRef
  input_Password: boolean = false;
  append_Password: string;
  append_NewPassword: string;
  append_ConfirmPassword: string;
  emptyOldPassword: boolean = false;
  emptyNewPassword: boolean = false;
  emptyConfirmPassword: boolean = false;
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
  getInterest = [];
  selectImg: boolean;
  input_shippingAddress: boolean = false;
  append_editAddressLine1: string;
  append_editAddressLine2: string;
  append_editShippingCity: string;
  append_editShippingState: string;
  append_editShippingZipcode: string;
  append_addAddressLine1: string;
  append_addAddressLine2: string;
  append_addShippingCity: string;
  append_addShippingState: string;
  append_addShippingZipcode: string;
  addShippingAddress: boolean = false;
  ProfileSaveModel = new MyAccountProfileModel();
  EmailSaveModel = new MyAccountEmailModel();
  PasswordSaveModel = new MyAccountPasswordModel();
  AddressSaveModel = new MyAccountAddressModel();
  DOBSaveModel = new MyAccountDOBModel();
  InterestSaveModel = new MyAccountInterestModel();
  getUserInfo: any;
  customerId: string;
  @ViewChild('closeAccountModal') closeAccountModal: ElementRef;
  @ViewChild('deleteCardModal') deleteCardModal: ElementRef;
  @ViewChild('deleteAddressModal') deleteAddressModal: ElementRef;
  saveCardDetails: any;
  pageLoader: boolean = false;
  addressIdForDelete: string;
  selectedDOB = { year: "1940", month: "1", date: "1" };
  invalidDOB: boolean = false;
  @ViewChild('changeEmailModal') changeEmailModal: ElementRef;

  constructor(
    public core: CoreService,
    private myAccount: MyAccountService,
    private cd: ChangeDetectorRef,
    private route: Router
  ) {
    this.minDate = new Date(1940, 0, 1);
    this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  }

  turnOnOffNotifications(e, from) {
    let emailId = this.getUserInfo.emailId;
    let emailNotification: boolean;
    let alertNotification: boolean;
    if (from == 'email') {
      if (e.target.checked) emailNotification = false;
      else emailNotification = true;
      let model = { emailId: emailId, emailNotification: emailNotification };
      this.myAccount.emailNotification(model).subscribe((res) => {
        window.localStorage['userInfo'] = JSON.stringify(res);
      });
    }
    else {
      if (e.target.checked) alertNotification = false;
      else alertNotification = true;
      let model = { emailId: emailId, alertNotification: alertNotification };
      this.myAccount.alertNotification(model).subscribe((res) => {
        window.localStorage['userInfo'] = JSON.stringify(res);
      });
    }
  }

  confirmCloseAccount() {
    this.core.openModal(this.closeAccountModal)
  }

  closeAccount() {
    let model = { emailId: this.getUserInfo.emailId };
    this.myAccount.closeAccount(model).subscribe((res) => {
      this.route.navigateByUrl('/logout');
    }, (err) => {
      console.log(err)
    })
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    if (this.readStripe) {
      const elementStyles = {
        base: {
          color: '#000',
          fontFamily: '"Open Sans", "Helvetica Neue", "Helvetica", sans-serif',
          fontSize: '15px',
          ':focus': {
            color: '#424770',
          },

          '::placeholder': {
            color: '#9BACC8',
          },

          ':focus::placeholder': {
            color: '#CFD7DF',
          },
        },
        invalid: {
          color: '#000',
          ':focus': {
            color: '#FA755A',
          },
          '::placeholder': {
            color: '#FFCCA5',
          },
        },
      };

      const elementClasses = {
        focus: 'focus',
        empty: 'empty',
        invalid: 'invalid',
      };
      // this.card = elements.create('card', { style });
      this.cardNumber = elements.create('cardNumber', { style: elementStyles, classes: elementClasses, });
      this.cardExpiry = elements.create('cardExpiry', { style: elementStyles, classes: elementClasses, });
      this.cardCvc = elements.create('cardCvc', { style: elementStyles, classes: elementClasses, });
      this.cardZip = elements.create('postalCode', { style: elementStyles, classes: elementClasses, placeholder: 'Zipcode', });

      // this.card.mount(this.cardInfo.nativeElement);
      this.cardNumber.mount(this.cardNumberInfo.nativeElement);
      this.cardExpiry.mount(this.cardExpiryInfo.nativeElement);
      this.cardCvc.mount(this.cardCvcInfo.nativeElement);
      this.cardZip.mount(this.cardZipInfo.nativeElement);
    }
    if (this.cardNumber != undefined) {
      this.cardNumber.addEventListener('change', ({ brand }) => {
        if (brand) {
          this.setBrandIcon(brand);
        }
      });
    }
  }

  setBrandIcon(brand) {
    const brandIconElement = document.getElementById('brand-icon');
    let pfClass = 'pf-credit-card';
    if (brand in this.cardBrandToPfClass) {
      pfClass = this.cardBrandToPfClass[brand];
    }
    for (let i = brandIconElement.classList.length - 1; i >= 0; i--) {
      brandIconElement.classList.remove(brandIconElement.classList[i]);
    }
    brandIconElement.classList.add('pf');
    brandIconElement.classList.add(pfClass);
  }

  ngOnDestroy() {
    if (this.cardNumber != undefined) {
      this.cardNumber.destroy();
      this.cardExpiry.destroy();
      this.cardZip.destroy();
      this.cardCvc.destroy();
      this.cardNumber = undefined;
    }
  }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.core.hideUserInfo(false);
    this.imgS3 = environment.s3;
    if (window.localStorage['userInfo'] != undefined) this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
    this.getConsumerProfile();
  }

  getConsumerProfile() {
    this.pageLoader = true;
    let emailId = this.getUserInfo.emailId;
    this.myAccount.getUserDetails(emailId).subscribe((res) => {
      this.pageLoader = false;
      if (res.consumerImagePath != undefined && res.consumerImagePath != null && res.consumerImagePath != "") {
        if (res.consumerImagePath.indexOf('data:') === -1 && res.consumerImagePath.indexOf('https:') === -1) {
          res.consumerImagePath = this.imgS3 + res.consumerImagePath;
        }
      }
      else res.consumerImagePath = "/consumer-app/assets/images/avatar.jpg";
      window.localStorage['userInfo'] = JSON.stringify(res);
      this.getUserInfo = JSON.parse(window.localStorage['userInfo']);
      this.getAPICP = res;
      this.myAccountModel.profileInfo = new MyaccountProfileInfo();
      this.myAccountModel.userData = new MyAccountUserData();
      this.myAccountModel.profileInfo.consumerInterests = new Array<MyAccountConsumerInterest>();
      this.myAccountModel.profileInfo.address = new Array<MyAccountAddress>();
      this.myAccountModel.profileInfo.address = res.address;
      // this.myAccountModel.profileInfo.consumerImagePath = this.imgS3.concat(res.consumerImagePath);
      this.myAccountModel.profileInfo.consumerImagePath = res.consumerImagePath;
      this.myAccountModel.profileInfo.consumerInterests = res.consumerInterests;
      if (res.dateOfBirth != null) {
        this.myAccountModel.profileInfo.dob = new Date(res.dateOfBirth);
        this.myAccountModel.profileInfo.birthDate = new Date(res.dateOfBirth).getDate().toString();
        this.myAccountModel.profileInfo.birthMonth = (new Date(res.dateOfBirth).getMonth() + 1).toString();
        this.myAccountModel.profileInfo.birthYear = new Date(res.dateOfBirth).getFullYear().toString();
        this.selectedDOB.year = this.myAccountModel.profileInfo.birthYear;
        this.selectedDOB.month = this.myAccountModel.profileInfo.birthMonth;
        this.selectedDOB.date = this.myAccountModel.profileInfo.birthDate;
      }
      else {
        this.selectedDOB.year = '';
        this.selectedDOB.month = '';
        this.selectedDOB.date = '';
      }
      this.model = {
        year: parseFloat(this.myAccountModel.profileInfo.birthYear),
        month: parseFloat(this.myAccountModel.profileInfo.birthMonth),
        day: parseFloat(this.myAccountModel.profileInfo.birthDate)
      };
      this.myAccountModel.userData.emailId = res.emailId;
      this.myAccountModel.userData.password = "......";
      this.myAccountModel.profileInfo.firstName = res.firstName;
      this.myAccountModel.profileInfo.lastName = res.lastName;
      this.myAccountModel.profileInfo.gender = res.gender;
      this.myAccountModel.userId = res.userId;
      this.getCard();
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.invalidDOB = false;
    if (event.value > this.maxDate) {
      this.invalidDOB = true;
      return false
    }
    else if (event.value < this.minDate) {
      this.invalidDOB = true;
      return false
    }
    else {
      this.selectedDOB.year = event.value.getFullYear().toString();
      this.selectedDOB.month = (event.value.getMonth() + 1).toString();
      this.selectedDOB.date = event.value.getDate().toString();
      this.myAccountModel.profileInfo.birthDate = this.selectedDOB.date;
      this.myAccountModel.profileInfo.birthMonth = this.selectedDOB.month.toString();
      this.myAccountModel.profileInfo.birthYear = this.selectedDOB.year;
    }
  }

  getCard() {
    this.loader_Card = true;
    this.myAccount.getCards(this.myAccountModel.userId).subscribe((res) => {
      this.loader_Card = false;
      this.getCardsDetails = [];
      if (res.length > 0) {
        this.customerId = res[0].customerId;
        for (var i = 0; i < res.length; i++) {
          this.getCardsDetails.push(new GetCustomerCards(res[i].userId, res[i].customerId, res[i].last4Digits, res[i].cardType, res[i].funding, res[i].cardId, res[i].cardHoldersName))
        }
      }
    });
  }

  resetAddCard() {
    this.addCard = false;
    this.error = null;
    this.ngOnDestroy();
    let getText = document.getElementsByClassName("cursor");
    for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
    //this.ngAfterViewInit();
  }

  updateCard(stripeAddCard) {
    this.myAccount.updateCard(stripeAddCard).subscribe((res) => {
      this.loader_addCard = false;
      this.resetAddCard();
      this.getCard();
    });
  }

  confirmDeleteCard(card) {
    this.saveCardDetails = card;
    this.core.openModal(this.deleteCardModal);
  }

  deleteCard() {
    this.loader_Card = true;
    let card = this.saveCardDetails;
    this.myAccount.deleteCard(card.customerId, card.cardId).subscribe((res) => {
      this.getCard();
    })
  }

  confirmDeleteAddress(address) {
    this.addressIdForDelete = address.addID;
    this.core.openModal(this.deleteAddressModal);
  }

  deleteAddress() {
    this.myAccount.deleteAddress(this.addressIdForDelete, this.getUserInfo.emailId).subscribe((res) => {
      this.myAccountModel.profileInfo.address = new Array<MyAccountAddress>();
      this.myAccountModel.profileInfo.address = res;
    }, (err) => {
      console.log(err)
    })
  }

  addNewCard() {
    this.addCard = !this.addCard;
    this.readStripe = true;
    if (this.addCard) {
      let getText = document.getElementsByClassName("cursor");
      for (let i = 0; i < getText.length; i++) getText[i].setAttribute("disabled", "disabled");
      this.ngAfterViewInit();
    }
    else this.resetAddCard();
  }

  async onSubmit(form: NgForm) {
    this.error = null;
    this.loader_addCard = false;
    if (this.getUserInfo === undefined) this.error = "Please login to add new card";
    else if ((this.cardNumberInfo.nativeElement.classList.contains("invalid") || this.cardNumberInfo.nativeElement.classList.contains("empty"))
      || (this.cardExpiryInfo.nativeElement.classList.contains("invalid") || this.cardExpiryInfo.nativeElement.classList.contains("empty"))
      || (this.cardCvcInfo.nativeElement.classList.contains("invalid") || this.cardCvcInfo.nativeElement.classList.contains("empty"))
      || (this.cardZipInfo.nativeElement.classList.contains("invalid") || this.cardZipInfo.nativeElement.classList.contains("empty"))) {
      this.error = "All fields are mandatory";
      return false;
    }
    else {
      this.loader_addCard = true;
      const { token, error } = await stripe.createToken(this.cardNumber);
      if (error) this.loader_addCard = false;
      else {
        this.stripeAddCard.customer.email = this.getUserInfo.emailId;
        this.stripeAddCard.customer.source = token.id;
        this.stripeAddCard.userId = this.getUserInfo.userId;
        this.stripeAddCard.customer.customerId = this.customerId;
        if (this.getCardsDetails.length > 0) this.updateCard(this.stripeAddCard);
        else {
          this.myAccount.addCard(this.stripeAddCard).subscribe((res) => {
            this.loader_addCard = false;
            this.resetAddCard();
            this.getCard();
          });
        }
      }
    }
  }

  selectInterest(e, obj) {
    let btn = document.getElementsByClassName("changeInterestBtn")[0].innerHTML;
    if (btn != 'change') {
      obj.selectImg = !obj.selectImg;
      if (this.getInterest == null) this.getInterest = [];
      this.getInterest.push(new MyAccountConsumerInterest(e.currentTarget.id, e.currentTarget.title, e.currentTarget.src));
      this.getInterest = this.getInterest.filter((elem, index, self) => self.findIndex((img) => {
        return (img.id === elem.id && img.consumerInterestImageName === elem.consumerInterestImageName)
      }) === index);

      if (obj.selectImg == false) {
        for (let i = 0; i < this.getInterest.length; i++) {
          if (this.getInterest[i].id == obj.id) this.getInterest.splice(i, 1)
        }
      }
    }
  }

  selectSelected(e) {
    this.model = {
      year: parseFloat(this.myAccountModel.profileInfo.birthYear),
      month: parseFloat(this.myAccountModel.profileInfo.birthMonth),
      day: parseFloat(this.myAccountModel.profileInfo.birthDate)
    };
    if (e.currentTarget.innerHTML == 'done') this.append_dob = this.model;
  }

  callUpload(e) {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click(e);
    let getText = document.getElementsByClassName("cursor");
    for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
  };

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: any) {
        window.localStorage['imagesPath'] = e.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
      setTimeout(() => {
        this.loader_profileImage = true;
        this.myAccountModel.profileInfo.consumerImagePath = window.localStorage['imagesPath'];
        localStorage.removeItem('imagesPath');
        /**API to Save New Email**/
        this.ProfileSaveModel.emailId = this.myAccountModel.userData.emailId;
        this.ProfileSaveModel.profilePic = this.myAccountModel.profileInfo.consumerImagePath;
        this.myAccount.saveProfileImage(this.ProfileSaveModel).subscribe((res) => {
          this.loader_profileImage = false;
          if (res.consumerImagePath.indexOf('data:') === -1 && res.consumerImagePath.indexOf('https:') === -1) {
            res.consumerImagePath = this.imgS3 + res.consumerImagePath;
          }
          window.localStorage['userInfo'] = JSON.stringify(res);
          this.core.hideUserInfo(false);
        }, (err) => {
          this.loader_profileImage = false;
          console.log(err);
        });
        /**API to Save New Email**/
      }, 500);
    }
  };

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
          let addProfileAddress: boolean = false;
          if (this.myAccountModel.profileInfo.address == null) this.myAccountModel.profileInfo.address = [];
          for (let i = 0; i < this.myAccountModel.profileInfo.address.length; i++) {
            let address = this.myAccountModel.profileInfo.address[i]
            if (address.addressType == 'profileAddress') {
              address.city = this.fetchGeoCode.split(',')[0];
              address.state = this.fetchGeoCode.split(',')[1].trim().split(" ")[0];
              address.zipcode = this.append_Location;
              addProfileAddress = true;
              return false;
            }
            else addProfileAddress = false;
          }
          if (addProfileAddress == false) {
            this.myAccountModel.profileInfo.address.push({
              addID: null,
              addressLine1: "",
              addressLine2: "",
              addressType: "profileAddress",
              city: this.fetchGeoCode.split(',')[0],
              state: this.fetchGeoCode.split(',')[1].trim().split(" ")[0],
              zipcode: this.append_Location
            })
          }
        });
    }
  };

  appendInput(e, element, obj?: any) {
    this.hideAllInputs(obj);
    if (e.currentTarget.innerHTML == 'done') {
      this.removeInput(e, element, obj);
      return false;
    }
    else {
      let getText = document.getElementsByClassName("cursor");
      for (let i = 0; i < getText.length; i++) {
        getText[i].setAttribute("disabled", "disabled");
        this.myAccountModel.profileInfo.consumerInterests = this.getAPICP.consumerInterests;
      }
      e.currentTarget.innerHTML = 'done';
      e.currentTarget.removeAttribute("disabled");
      if (element == 'profileImage') {
        e.currentTarget.innerHTML = 'change';
        this.callUpload(e);
      }
      else if (element == 'email') {
        this.input_Email = true;
        this.append_Email = this.emailElement.nativeElement.innerText;
      }
      else if (element == 'password') {
        this.input_Password = true;
        this.append_Password = this.myAccountModel.userData.password;
      }
      else if (element == 'location') {
        this.input_Location = true;
        this.append_Location = this.locationElement.nativeElement.innerText;
      }
      else if (element == 'dob') {
        this.input_dob = true;
        //this.append_dob = this.dobElement.nativeElement.innerText;
        this.append_dob = this.model;
        setTimeout(() => {
          let date = document.getElementsByClassName('datePickerInput')[0] as HTMLElement;
          date.focus();
        }, 100)
      }
      else if (element == 'interest') {
        this.myAccount.getInterest().subscribe(res => {
          this.getInterest = this.myAccountModel.profileInfo.consumerInterests;
          this.myAccountModel.profileInfo.consumerInterests = res;
          for (let i = 0; i < this.getInterest.length; i++) {
            let id = this.getInterest[i].id;
            for (let j = 0; j < this.myAccountModel.profileInfo.consumerInterests.length; j++) {
              if (id == this.myAccountModel.profileInfo.consumerInterests[j].id) {
                this.myAccountModel.profileInfo.consumerInterests[j].selectImg = true;
              }
            }
          }
        });
      }
      else if (element == 'shippingAddress') {
        this.getAllStates();
        obj.input_shippingAddress = true;
        obj.append_editAddressLine1 = obj.addressLine1;
        obj.append_editAddressLine2 = obj.addressLine2;
        obj.append_editShippingCity = obj.city;
        obj.append_editShippingState = obj.state;
        obj.append_editShippingZipcode = obj.zipcode;
      }
    }
  }

  removeInput(e, element, obj?: any) {
    if (this.invalidDOB) return false;
    let getText = document.getElementsByClassName("cursor");
    for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
    e.currentTarget.innerHTML = 'change';
    if (element == 'email') {
      this.EmailSaveModel.oldEmailId = this.getUserInfo.emailId;
      this.EmailSaveModel.newEmailId = this.append_Email;
      if (this.EmailSaveModel.newEmailId != this.EmailSaveModel.oldEmailId) {
        this.core.openModal(this.changeEmailModal);
      }
      else this.discardEmailChange();
    }
    else if (element == 'password') {
      this.input_Password = false;
      this.loader_password = true;
      this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
      /**API to Save Password**/
      this.PasswordSaveModel.emailId = this.getUserInfo.emailId;
      this.PasswordSaveModel.password = this.append_ConfirmPassword;
      this.myAccount.savePassword(this.PasswordSaveModel).subscribe((res) => {
        this.loader_password = false;
        localStorage.removeItem('token');
        this.route.navigateByUrl('/login');
      }, (err) => {
        this.loader_password = false;
        console.log(err);
      });
      /**API to Save Password**/
      setTimeout(() => this.passwordElement.nativeElement.innerText = '......', 50);
    }
    else if (element == 'location') {
      this.input_Location = false;
      this.loader_profileAddress = true;
      this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
      /**API to Save Address**/
      this.AddressSaveModel.emailId = this.getUserInfo.emailId;
      this.AddressSaveModel.address = this.myAccountModel.profileInfo.address;
      this.myAccount.saveAddress(this.AddressSaveModel).subscribe((res) => {
        this.loader_profileAddress = false;
        window.localStorage['userInfo'] = JSON.stringify(res);
      }, (err) => {
        this.loader_profileAddress = false;
        console.log(err);
      });
      /**API to Save Address**/
    }
    else if (element == 'dob') {
      this.invalidDOB = false;
      this.input_dob = false;
      this.loader_DOB = true;
      this.myAccountModel.profileInfo.birthDate = this.selectedDOB.date.toString();
      this.myAccountModel.profileInfo.birthMonth = this.selectedDOB.month.toString();
      this.myAccountModel.profileInfo.birthYear = this.selectedDOB.year.toString();
      this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
      /**API to Save DOB**/
      this.DOBSaveModel.emailId = this.getUserInfo.emailId;
      this.DOBSaveModel.dateOfBirth = new Date(this.myAccountModel.profileInfo.birthYear + '-' + this.myAccountModel.profileInfo.birthMonth + '-' + this.myAccountModel.profileInfo.birthDate);
      this.myAccount.saveDOB(this.DOBSaveModel).subscribe((res) => {
        this.loader_DOB = false;
        this.model = this.append_dob;
        window.localStorage['userInfo'] = JSON.stringify(res);
        this.myAccountModel.profileInfo.dob = new Date(res.dateOfBirth);
      }, (err) => {
        this.loader_DOB = false;
        console.log(err);
      });
      /**API to Save DOB**/
      this.myAccountModel.profileInfo.birthDate = this.append_dob.day.toString();
      this.myAccountModel.profileInfo.birthMonth = this.append_dob.month.toString();
      this.myAccountModel.profileInfo.birthYear = this.append_dob.year.toString();
      return false;
    }
    else if (element == 'interest') {
      this.loader_Interest = true;
      this.myAccountModel.profileInfo.consumerInterests = this.getInterest;
      this.getAPICP.consumerInterests = this.myAccountModel.profileInfo.consumerInterests
      this.getInterest = [];
      this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
      this.InterestSaveModel.emailId = this.getUserInfo.emailId;
      this.InterestSaveModel.consumerInterests = this.myAccountModel.profileInfo.consumerInterests;
      this.myAccount.saveInterest(this.InterestSaveModel).subscribe((res) => {
        this.loader_Interest = false;
        window.localStorage['userInfo'] = JSON.stringify(res);
      }, (err) => {
        this.loader_Interest = false;
        console.log(err);
      });
    }
    else if (element == 'shippingAddress') {
      this.loader_shippingAddress = true;
      obj.input_shippingAddress = false;
      obj.addressLine1 = obj.append_editAddressLine1;
      obj.addressLine2 = obj.append_editAddressLine2;
      obj.city = obj.append_editShippingCity;
      obj.state = obj.append_editShippingState;
      obj.zipcode = obj.append_editShippingZipcode;
      delete obj.append_editAddressLine1;
      delete obj.append_editAddressLine2;
      delete obj.append_editShippingCity;
      delete obj.append_editShippingState;
      delete obj.append_editShippingZipcode;
      /**API to Save Address**/
      this.getUserInfo = JSON.parse(window.localStorage['userInfo'])
      this.AddressSaveModel.emailId = this.getUserInfo.emailId;
      this.AddressSaveModel.address = this.myAccountModel.profileInfo.address;
      this.myAccount.saveAddress(this.AddressSaveModel).subscribe((res) => {
        this.loader_shippingAddress = false;
        window.localStorage['userInfo'] = JSON.stringify(res);
      }, (err) => {
        this.loader_shippingAddress = false;
        console.log(err);
      });
      /**API to Save Address**/
    }
  }

  confirmEmailChange() {
    this.loader_emailImage = true;
    this.emailElement.nativeElement.innerText = this.EmailSaveModel.newEmailId;
    this.myAccount.saveEmail(this.EmailSaveModel).subscribe((res) => {
      this.loader_emailImage = false;
      this.input_Email = false;
      localStorage.removeItem('token');
      this.route.navigateByUrl('/login');
    }, (err) => {
      this.loader_emailImage = false;
      console.log(err)
    });
  }

  discardEmailChange() {
    this.loader_emailImage = false;
    this.input_Email = false;
    this.append_Email = this.EmailSaveModel.oldEmailId;
  }

  getAllStates() {
    if (this.getStates == undefined) {
      this.myAccount.getAllStates().subscribe((res) => {
        this.getStates = res.stateAbbreviation;
      })
    }
  }

  addNewAddress(e) {
    this.addShippingAddress = !this.addShippingAddress;
    this.append_addAddressLine1 = "";
    this.append_addAddressLine2 = "";
    this.append_addShippingCity = "";
    this.append_addShippingState = "";
    this.append_addShippingZipcode = "";
    if (this.addShippingAddress) {
      this.getAllStates();
      let getText = document.getElementsByClassName("cursor");
      for (let i = 0; i < getText.length; i++) getText[i].setAttribute("disabled", "disabled");
      e.currentTarget.removeAttribute("disabled");
    }
    else {
      let getText = document.getElementsByClassName("cursor");
      for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
    }
  }

  saveNewAddress(e) {
    let getText = document.getElementsByClassName("cursor");
    for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
    this.myAccountModel.profileInfo.address.push(new MyAccountAddress(null, this.append_addAddressLine1, this.append_addAddressLine2, this.append_addShippingCity, this.append_addShippingState, this.append_addShippingZipcode.toString(), 'shippingAddress'));
    /**API to Save Address**/
    this.AddressSaveModel.emailId = this.getUserInfo.emailId;
    this.AddressSaveModel.address = this.myAccountModel.profileInfo.address;
    this.myAccount.saveAddress(this.AddressSaveModel).subscribe((res) => {
      console.log(res);
      window.localStorage['userInfo'] = JSON.stringify(res);
      this.addShippingAddress = false;
    }, (err) => {
      this.addShippingAddress = false;
      console.log(err);
    });
    /**API to Save Address**/
  }

  emailValidator() {
    this.emptyEmailAddress = false;
    this.invalidEmailAddress = false;
    if (!this.append_Email) this.emptyEmailAddress = true;
    else if (this.emailRegex.test(this.append_Email) == false) this.invalidEmailAddress = true;
  }

  passwordValidator() {
    this.emptyOldPassword = false;
    this.emptyNewPassword = false;
    this.emptyConfirmPassword = false;
    this.invalidPassword = false;
    this.oldNewPassword = false;
    this.newConfirmPassword = false;
    if (!this.append_NewPassword) this.emptyNewPassword = true;
    else if (this.passwordRegex.test(this.append_NewPassword) == false) this.invalidPassword = true;
    else if (!this.append_ConfirmPassword) this.emptyConfirmPassword = true;
    else if (this.passwordRegex.test(this.append_ConfirmPassword) == false) this.invalidPassword = true;
    else if (this.append_Password == this.append_NewPassword) this.oldNewPassword = true;
    else if (this.append_NewPassword != this.append_ConfirmPassword) this.newConfirmPassword = true;
  }

  terminate(from, obj?: any) {
    let getText = document.getElementsByClassName("cursor");
    for (let i = 0; i < getText.length; i++) getText[i].removeAttribute("disabled");
    if (from == 'addAddress') {
      this.addShippingAddress = false;
      this.append_addAddressLine1 = "";
      this.append_addAddressLine2 = "";
      this.append_addShippingCity = "";
      this.append_addShippingState = "";
      this.append_addShippingZipcode = "";
    }
    else if (from == 'editAddress') {
      obj.input_shippingAddress = false;
      obj.append_editAddressLine1 = obj.addressLine1;
      obj.append_editAddressLine2 = obj.addressLine2;
      obj.append_editShippingCity = obj.city;
      obj.append_editShippingState = obj.state;
      obj.append_editShippingZipcode = obj.zipcode;
    }
  }

  hideAllInputs(obj?: any) {
    if (this.invalidDOB) return false;
    this.input_Email = false;
    this.input_Password = false;
    this.input_Location = false;
    this.input_dob = false;
    this.input_getLocation = false;
    this.oldNewPassword = false;
    this.newConfirmPassword = false;
    this.invalidPassword = false;
    this.emptyOldPassword = false;
    this.emptyNewPassword = false;
    this.emptyConfirmPassword = false;
    this.selectImg = false;
    if (obj != undefined) obj.input_shippingAddress = false;
  }
}

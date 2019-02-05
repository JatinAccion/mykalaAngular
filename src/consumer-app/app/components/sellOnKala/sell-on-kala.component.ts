import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { CuiComponent, MsgDirection } from '../conversational/cui.interface';
import { ConversationalService } from '../conversational/conversational.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { Conversation } from '../../models/conversation';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { JoinKalaService } from '../../services/join-kala.service';
import { ConsumerSignUp } from '../../../../models/consumer-signup';
import { regexPatterns } from '../../../../common/regexPatterns';
import { SellOnKala,ProductInfo } from '../../../../models/sell-on-kala';
import { SellOnKalaService } from '../../services/sell-on-kala.service';
import { HomeService } from '../../services/home.service';
import { nameValue, IdNameParent, TypeDataSelected } from '../../../../models/nameValue';
import { userMessages, inputValidation } from './sell-on-kala.message';
@Component({
  selector: 'app-sell-on-kala',
  templateUrl: './sell-on-kala.component.html',
  styleUrls: ['./sell-on-kala.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class SellOnKalaComponent implements OnInit, CuiComponent {
  loader: boolean = false;
  sellOnKalaData:SellOnKala = new SellOnKala();
  sellOnKalaForm: FormGroup;
  places = new Array<IdNameParent>();
  productInfo = new Array<ProductInfo>();
  sellOnKalaInputValMsg = inputValidation;
  placesSettings = {};
  noOfProductsList = ["1 to 100","101 to 1000","1001 to 10000","10001 to 25000","25001 to 100000","101000 to 250000","Over 250000"];
  prefIntMethods =["Manual-maintain your own products","Kala, Automated-integrate with Kala APIs","ChannelAdvisor-integrate with ChannelAdvisor APIs","Other"];
  getStates: any;
  textRegx = regexPatterns.textRegex;
  tinRegx = regexPatterns.tinRegex;
  passwordRegex = regexPatterns.password;
  fullname = new RegExp('^[a-zA-Z0-9.-]*$');
  emailRegex = regexPatterns.emailRegex;
  userModel = new ConsumerSignUp();
  searchData = [];
  @Input() hideNavi: string;
  signUpResponse = {
    status: false,
    message: ""
  };
  userInfo: any;
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  step = 1;
  user: User = new User('', '', '');
  compNameValidation: boolean = false;
  bussinesAddress1Validation : boolean = false;
  bussinesAddress2Validation : boolean = false;
  cityValidation : boolean = false;
  stateValidation : boolean = false;
  zipcodeValidation : boolean = false;
  nameValidation : boolean = false;
  phoneNumbervalidation : boolean = false;
  emailValidation: boolean = false;
  passwordValidation: boolean = false;
  productPlaceValidation : boolean = false;
  noOfProductsValidation : boolean = false;
  tinValidation : boolean = false;
  doShipProdsValidation : boolean = false;
  regInUSValidation : boolean = false;
  prefIntMethValidation : boolean = false;
  
  constructor(private routerOutlet: RouterOutlet, private sellOnKalaService: SellOnKalaService, private homeService: HomeService, private formBuilder: FormBuilder, private router: Router, private auth: AuthService, public core: CoreService) { }
  ngOnInit() {
    /* Hide search bar for this page */
    //var searchBox = document.getElementsByClassName("searchBox")[0];
   // searchBox != undefined? searchBox.classList.add("d-none"):{};
   this.core.hideSearchField = false;
    /**Clearing the Logged In Session */
    //localStorage.removeItem('token');
    //localStorage.removeItem('existingItemsInCart');
    //localStorage.removeItem('existingItemsInWishList');
    //this.core.clearUser();
    //this.core.hideUserInfo(true);
    /**Clearing the Logged In Session */
    this.placesSettings = {
      singleSelection: false,
      text: 'Select Places',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      classes: 'myclass custom-class'
    };
    this.core.show();
    this.getAllStates();
    this.getPlaces();
    this.sellOnKalaForm = this.formBuilder.group({
      comp_name: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      bussines_address1: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      bussines_address2: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      state: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      zipCode: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(this.textRegx), Validators.required]],
      email: ['', [Validators.maxLength(255), Validators.pattern(this.emailRegex), Validators.required]],
      phoneNumber: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.textRegx), Validators.required]],
      productPlace : ['',[Validators.required]],
      noOfProducts : ['',[Validators.required]],
      name:['',[Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      TIN : ['', [Validators.maxLength(10),  Validators.pattern(this.tinRegx), Validators.required]],
      doShipProds :['',Validators.required],
      regInUS:['',Validators.required],
      prefIntMeth :['',Validators.required],
      anythingElse :['',[Validators.maxLength(255), Validators.pattern(this.textRegx)]]
      // sellerTypeId: [this.profileData.sellerTypeId || '', [Validators.required]]
    });

    
  }
  onUsernameBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onEmailBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onPasswordBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  isValidUsername() {
    if (this.user.username !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "username: " + this.user.username));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid user name")); this.step = 1;
      return false;
    }
  }
  isValidEmail() {
    if (this.user.email !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "email: " + this.user.email));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid email Id")); this.step = 2;
      return false;
    }
  }
  isValidPassword() {
    if (this.user.password !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "password: " + "*******"));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid password")); this.step = 3;
      return false;
    }
  }

  validateInput() {
    if (this.isValidUsername() && this.isValidEmail() && this.isValidPassword()) {
      this.signUp();
    }
  }

  signUp() {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.clicked.emit(new Conversation(MsgDirection.Out, "Join Completed"));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClick(item: Conversation) {
    this.clicked.emit(item);
  }

  hideValidation() {
    this.compNameValidation = false;
    this.bussinesAddress1Validation  = false;
    this.bussinesAddress2Validation  = false;
    this.cityValidation  = false;
    this.stateValidation  = false;
    this.zipcodeValidation  = false;
    this.nameValidation  = false;
    this.phoneNumbervalidation  = false;
    this.emailValidation = false;
    this.productPlaceValidation  = false;
    this.noOfProductsValidation  = false;
    this.tinValidation  = false;
    this.doShipProdsValidation  = false;
    this.regInUSValidation  = false;
    this.prefIntMethValidation  = false;
  }

  onSubmit() {
    /*Request JSON*/
    this.compNameValidation = false;
    this.bussinesAddress1Validation = false;
    this.emailValidation = false;
    this.passwordValidation = false;
    this.loader = false;
    this.signUpResponse.status = false;
    if (!this.sellOnKalaForm.value.comp_name) this.compNameValidation = true;
    else if (this.sellOnKalaForm.controls.comp_name.value && this.sellOnKalaForm.controls.comp_name.errors) this.compNameValidation = true;
    else if (!this.sellOnKalaForm.controls.bussines_address1.value) this.bussinesAddress1Validation = true;
    else if (this.sellOnKalaForm.controls.bussines_address1.value && this.sellOnKalaForm.controls.bussines_address1.errors) this.bussinesAddress1Validation = true;
    else if (!this.sellOnKalaForm.controls.city.value) this.cityValidation = true;
    else if (this.sellOnKalaForm.controls.city.value && this.sellOnKalaForm.controls.city.errors) this.cityValidation = true;
    else if (!this.sellOnKalaForm.controls.state.value) this.stateValidation = true;
    else if (this.sellOnKalaForm.controls.state.value && this.sellOnKalaForm.controls.state.errors) this.stateValidation = true;
    else if (!this.sellOnKalaForm.controls.zipCode.value) this.zipcodeValidation = true;
    else if (this.sellOnKalaForm.controls.zipCode.value && this.sellOnKalaForm.controls.zipCode.errors) this.zipcodeValidation = true;
    else if (!this.sellOnKalaForm.controls.name.value) this.nameValidation = true;
    else if (this.sellOnKalaForm.controls.name.value && this.sellOnKalaForm.controls.name.errors) this.nameValidation = true;
    else if (!this.sellOnKalaForm.controls.phoneNumber.value) this.phoneNumbervalidation = true;
    else if (this.sellOnKalaForm.controls.phoneNumber.value && this.sellOnKalaForm.controls.phoneNumber.errors) this.phoneNumbervalidation = true;
    else if (!this.sellOnKalaForm.controls.email.value) this.emailValidation = true;
    else if (this.sellOnKalaForm.controls.email.value && this.sellOnKalaForm.controls.email.errors) this.emailValidation = true;
    else if (!this.sellOnKalaForm.controls.productPlace.value) this.productPlaceValidation = true;
    else if (this.sellOnKalaForm.controls.productPlace.value && this.sellOnKalaForm.controls.productPlace.errors) this.productPlaceValidation = true;
    else if (!this.sellOnKalaForm.controls.noOfProducts.value) this.noOfProductsValidation = true;
    else if (this.sellOnKalaForm.controls.noOfProducts.value && this.sellOnKalaForm.controls.noOfProducts.errors) this.noOfProductsValidation = true;
    else if (!this.sellOnKalaForm.controls.tin.value) this.tinValidation = true;
    else if (this.sellOnKalaForm.controls.tin.value && this.sellOnKalaForm.controls.tin.errors) this.tinValidation = true;
    else if (!this.sellOnKalaForm.controls.doShipProds.value) this.doShipProdsValidation = true;
    else if (this.sellOnKalaForm.controls.doShipProds.value && this.sellOnKalaForm.controls.doShipProds.errors) this.doShipProdsValidation = true;
    else if (!this.sellOnKalaForm.controls.regInUS.value) this.regInUSValidation = true;
    else if (this.sellOnKalaForm.controls.regInUS.value && this.sellOnKalaForm.controls.regInUS.errors) this.regInUSValidation = true;
    else if (!this.sellOnKalaForm.controls.prefIntMeth.value) this.prefIntMethValidation = true;
    else if (this.sellOnKalaForm.controls.prefIntMeth.value && this.sellOnKalaForm.controls.prefIntMeth.errors) this.prefIntMethValidation = true;
    else {
      this.loader = true;
      this.sellOnKalaData.compName = this.sellOnKalaForm.value.comp_name;
      this.sellOnKalaData.businessAddress.addressLineOne = this.sellOnKalaForm.value.bussines_address1;
      this.sellOnKalaData.businessAddress.addressLineTwo = this.sellOnKalaForm.value.bussines_address2;
      this.sellOnKalaData.businessAddress.city = this.sellOnKalaForm.value.city;
      this.sellOnKalaData.businessAddress.state = this.sellOnKalaForm.value.state;
      this.sellOnKalaData.businessAddress.zipcode = this.sellOnKalaForm.value.zipcode;
      this.sellOnKalaData.name = this.sellOnKalaForm.value.name;
      this.sellOnKalaData.email = this.sellOnKalaForm.value.email;
      this.sellOnKalaData.phoneNo = this.sellOnKalaForm.value.phoneNo;
      this.sellOnKalaData.productInfo.push(new ProductInfo(this.sellOnKalaForm.value.productPlace, this.sellOnKalaForm.value.noOfProducts));

      // this.loader = true;
      // this.userModel.firstName = this.sellOnKalaForm.value.firstname;
      // this.userModel.lastName = this.sellOnKalaForm.value.lastname;
      // this.userModel.password = this.sellOnKalaForm.value.password;
      // this.userModel.emailId = this.sellOnKalaForm.value.email.toLowerCase();
      // this.userModel.fullName = this.sellOnKalaForm.value.firstname + ' ' + this.sellOnKalaForm.value.lastname;
      // this.userModel.userCreateStatus = false;
      // this.userModel.phone = "";
      // this.userModel.roleName = [];
      // this.userModel.roleName.push("consumer");
      // this.joinKalaService.joinKalaStepOne(this.userModel).subscribe(res => {
      //   console.log(res);
      //   this.loader = false;
      //   this.userInfo = res;
      //   if (this.userInfo.user_status === "success") {
      //     window.localStorage['userInfo'] = JSON.stringify(this.userInfo);
      //     this.signUpResponse.status = true;
      //     this.signUpResponse.message = '';//this.joinUserMsg.success;
      //     setTimeout(() => {
      //       if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      //       this.router.navigateByUrl('/profile-info');
      //     }, 3000);
      //     this.sellOnKalaForm.reset();
      //   }
      //   else if (this.userInfo.user_status === "alreadyExists") {
      //     if (this.userInfo.userCreateStatus == false) {
      //       this.userInfo.user_status = "inactive";
      //       this.signUpResponse.status = true;
      //       this.signUpResponse.message ='';// this.joinUserMsg.inactiveUser;
      //     }
      //     else {
      //       this.signUpResponse.status = true;
      //       this.signUpResponse.message ='';// this.joinUserMsg.emailExists;
      //     }
      //   }
      // }, err => {
      //   this.loader = false;
      //   this.signUpResponse.status = true;
      //   this.signUpResponse.message ='';// this.joinUserMsg.fail;
      // });
    }
  }

  verifyAccount() {
    this.loader = true;
    this.signUpResponse.status = false;
    this.auth.verifyAccount(this.sellOnKalaForm.controls.email.value).subscribe((res) => {
      this.loader = false;
      this.userInfo.user_status = "success";
      this.signUpResponse.status = true;
      this.signUpResponse.message ='';//this.joinUserMsg.success;
    })
  }
  
  getAllStates() {
    if (this.getStates == undefined) {
      this.sellOnKalaService.getAllStates().subscribe((res) => {
        this.getStates = res.stateAbbreviation;
      })
    }
  }
 getPlaces()
 {
  this.homeService.getTilesPlace().subscribe(res => {
    this.places = res.map(p => new IdNameParent(p.placeId, p.placeName, '', '', true));
  });
 }
 goBack(pageNo) {

 }
 refreshCategories() {
 
}
onPlaceSelect(item: any) { this.refreshCategories(); }
}

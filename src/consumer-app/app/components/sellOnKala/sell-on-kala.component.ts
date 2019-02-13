import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input ,ViewChild,ElementRef,OnDestroy,ChangeDetectorRef} from '@angular/core';
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
import { SellOnKala } from '../../../../models/sell-on-kala';
import { SellOnKalaService } from '../../services/sell-on-kala.service';
import { HomeService } from '../../services/home.service';
import { nameValue, IdNameParent, TypeDataSelected } from '../../../../models/nameValue';
import { userMessages, inputValidation } from './sell-on-kala.message';
import { RetailerProfileInfo } from '../../../../models/retailer-profile-info';
import { SellerBusinessAddress } from '../../../../models/seller-business-address';
import { ProductPlaceSOK } from '../../../../models/sell-on-kala';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { ValidatorExt } from '../../../../common/ValidatorExtensions';
@Component({
  selector: 'app-sell-on-kala',
  templateUrl: './sell-on-kala.component.html',
  styleUrls: ['./sell-on-kala.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class SellOnKalaComponent implements OnInit, CuiComponent,OnDestroy {
  @ViewChild("dontShipProdsModal") dontShipProdsModal: ElementRef;
  @ViewChild("doneQuestionareModal")doneQuestionareModal: ElementRef;
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  loader: boolean = false;
  sellOnKalaData:SellOnKala = new SellOnKala();
  sellOnKalaForm: FormGroup;
  places = new Array<IdNameParent>();
  sellOnKalaInputValMsg = inputValidation;
  userMsg= userMessages;
  profileInfoObj :SellerBusinessAddress;  
  placesSettings = {};
  public fileurl: string = "";
  prodPlace:ProductPlaceSOK = new ProductPlaceSOK();
  noOfProductsList = ["1 to 100","101 to 1000","1001 to 10000","10001 to 25000","25001 to 100000","101000 to 250000","Over 250000"];
  prefIntMethods =[{
   display: "Manual – maintain your own products",
   key:"KALAMANUAL"},
   {
    display: "Automated – integrate with Kala APIs",
    key:"KALAAUTO"
    },
    {
      display: "ChannelAdvisor – integrate with ChannelAdvisor APIs",
      key:"CHANNELADVISORAPI"
      }, 
      {
        display: "Other",
        key:"OTHER"
        },
];
 
  getStates: any;
  textRegx = regexPatterns.textRegex;
  zipPattern = regexPatterns.zipPattern;
  passwordRegex = regexPatterns.password;
  fullname = new RegExp('^[a-zA-Z0-9.-]*$');
  phoneNumberPattern = new RegExp('^(\\d{10}|\\d{10})$');
  emailRegex = regexPatterns.emailRegex;
  phoneNoRegex = regexPatterns.phoneNumberRegex;
  userModel = new ConsumerSignUp();
  searchData = [];
  @Input() hideNavi: string;

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
  isWelcomePage : boolean = false;
  isQuiestionarePage : boolean = false;
  isDocumentationPage : boolean = false;
  isQuiestionarePageDisabled : boolean = false;
  constructor(private routerOutlet: RouterOutlet, private cd: ChangeDetectorRef,public validatorExt: ValidatorExt, private sellOnKalaService: SellOnKalaService, private homeService: HomeService, private formBuilder: FormBuilder, private router: Router, private auth: AuthService, public core: CoreService) { }
  ngOnInit() {
    /* Hide search bar for this page */
    //var searchBox = document.getElementsByClassName("searchBox")[0];
   // searchBox != undefined? searchBox.classList.add("d-none"):{};
   this.isWelcomePage = true;
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
      text: 'Select Product Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      classes: 'myclass custom-class'
    };
    this.core.show();
    this.getState();
    this.getPlaces();
    this.sellOnKalaForm = this.formBuilder.group({
      comp_name: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      bussines_address1: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      bussines_address2: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx)]],
      city: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      state: ['', [Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      zipCode: ['',Validators.compose([Validators.required,Validators.pattern(this.zipPattern)])],
      email: ['', [Validators.maxLength(255), Validators.pattern(this.emailRegex), Validators.required]],
      phoneNumber: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.phoneNumberPattern), Validators.required]],
      productPlace : ['',[Validators.required]],
      noOfProducts : ['',[Validators.required]],
      name:['',[Validators.maxLength(255), Validators.pattern(this.textRegx), Validators.required]],
      TIN : ['',  Validators.required],
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
    this.hideValidation();
    this.loader = false;
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
    else if (!this.sellOnKalaForm.controls.TIN.value) this.tinValidation = true;
    else if (this.sellOnKalaForm.controls.TIN.value && this.sellOnKalaForm.controls.TIN.errors) this.tinValidation = true;
    else if (!this.sellOnKalaForm.controls.doShipProds.value) this.doShipProdsValidation = true;
    else if (this.sellOnKalaForm.controls.doShipProds.value && this.sellOnKalaForm.controls.doShipProds.errors) this.doShipProdsValidation = true;
    else if (!this.sellOnKalaForm.controls.regInUS.value) this.regInUSValidation = true;
    else if (this.sellOnKalaForm.controls.regInUS.value && this.sellOnKalaForm.controls.regInUS.errors) this.regInUSValidation = true;
    else if (!this.sellOnKalaForm.controls.prefIntMeth.value) this.prefIntMethValidation = true;
    else if (this.sellOnKalaForm.controls.prefIntMeth.value && this.sellOnKalaForm.controls.prefIntMeth.errors) this.prefIntMethValidation = true;
    else {
      this.loader = true;
      this.sellOnKalaData.productPlaces = [];
      this.sellOnKalaData.compName = this.sellOnKalaForm.value.comp_name;
      this.sellOnKalaData.name = this.sellOnKalaForm.value.name;
      this.sellOnKalaForm.value.productPlace.forEach(place => {
        this.prodPlace.placeId = place.id;
        this.prodPlace.placeName = place.itemName;
        this.sellOnKalaData.productPlaces.push(this.prodPlace);
      });
      this.profileInfoObj = new SellerBusinessAddress();
      this.profileInfoObj.addressLine1 = this.sellOnKalaForm.value.bussines_address1;
      this.profileInfoObj.addressLine2 = this.sellOnKalaForm.value.bussines_address2;
      this.profileInfoObj.city = this.sellOnKalaForm.value.city;
      this.profileInfoObj.state = this.sellOnKalaForm.value.state;
      this.profileInfoObj.zipcode = this.sellOnKalaForm.value.zipCode;
      this.profileInfoObj.email = this.sellOnKalaForm.value.email;
      this.profileInfoObj.phoneNo = this.sellOnKalaForm.value.phoneNumber;
      this.profileInfoObj.addressType = "businessAddress";
      //this.profileInfoObj.businessAddress.email = this.sellOnKalaForm.value.email;
      //this.profileInfoObj.businessAddress.phoneNo = this.sellOnKalaForm.value.phoneNo;
      this.sellOnKalaData.businessAddress = this.profileInfoObj;
      this.sellOnKalaData.extraInfo = this.sellOnKalaForm.value.anythingElse;
      this.sellOnKalaData.taxIdNumber =this.sellOnKalaForm.value.TIN;
      this.sellOnKalaData.doShipProds =this.sellOnKalaForm.value.doShipProds;
      this.sellOnKalaData.regInUS =  this.sellOnKalaForm.value.regInUS;
      this.sellOnKalaData.prefIntMeth =  this.sellOnKalaForm.value.prefIntMeth;
      var numberOfProds = this.sellOnKalaForm.value.noOfProducts.split(' ');
      if(numberOfProds.length>0)
      { 
        if(this.sellOnKalaForm.value.noOfProducts.indexOf("Over") != -1)
        {
          this.sellOnKalaData.minNoOfProducts =numberOfProds[numberOfProds.length-1];
          this.sellOnKalaData.maxNoOfProducts = 0;
       
        }
        else
        {
          this.sellOnKalaData.minNoOfProducts = numberOfProds[0];
          this.sellOnKalaData.maxNoOfProducts = numberOfProds[numberOfProds.length-1];
        }
      }

      this.sellOnKalaService.postSellOnKalaForm(this.sellOnKalaData).subscribe(res => {
        console.log(res);
        this.loader = false;
        if (res.sellerId) {
          this.core.openModal(this.doneQuestionareModal);
          this.ngbTabSet.select('tab-doc');
          this.isQuiestionarePageDisabled = true;
          this.isDocumentationPage = true;
          this.isQuiestionarePage = false;
        }
        else{

        }
      }, err => {
        this.loader = false;
      });
      //this.core.openModal(this.doneQuestionareModal);
      //this.ngbTabSet.select('tab-doc');
      console.log(JSON.stringify(this.sellOnKalaData));
    }

  }

  getState() {
      this.sellOnKalaService.getAllStates().subscribe((res) => {
        this.getStates = res.stateAbbreviation;
      })
  }
  
  // getAllStates() {
  //   if (this.getStates == undefined) {
  //     this.sellOnKalaService.getAllStates().subscribe((res) => {
  //       this.getStates = res.stateAbbreviation;
  //     })
  //   }
  // }
 getPlaces()
 {
  this.homeService.getTilesPlace().subscribe(res => {
    this.places = res.map(p => new IdNameParent(p.placeId, p.placeName, '', '', true));
  });
 }
 goBack() {
    this.isWelcomePage = true;
    this.isQuiestionarePage = false;
    this.isDocumentationPage= false;
 }
 refreshCategories() {
 
}
onPlaceSelect(item: any) { this.refreshCategories(); }

downloadfiletest(downloadTopoData) {
  var contentType = '';
  var b64Data = downloadTopoData.Uploaded_File;//'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  var blob = this.b64toBlob(b64Data, contentType, 512);
  this.fileurl = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = this.fileurl;
  a.setAttribute("download", downloadTopoData.File_Name);
  a.click();
  window.URL.revokeObjectURL(this.fileurl);
}
b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

downloadFile(filepath, type) {
  window.open('', "_blank");
}

downloadAllFiles(){
  var fileList = ["consumer-app/assets/pdf/Kala Product Guidelines.pdf",
  "consumer-app/assets/pdf/Kala Sellers Terms and Conditions.pdf",
  "consumer-app/assets/pdf/Kala Trademark Usage Guidelines.pdf",
  "consumer-app/assets/pdf/Kala_Seller_Agreement.pdf",
  "consumer-app/assets/pdf/Stripe Terms and Conditions.pdf"];
  fileList.forEach(file => {
    var filename = file.split("/").pop();
    let link = document.createElement("a");
    link.download = filename;
    link.href = file;
    link.click();
  });
  // var nameString = "/app/base/controllers/active.png";
  // var filename = nameString.split("/").pop();
  // let link = document.createElement("a");
  // link.download = filename;
  // link.href = "consumer-app/assets/images/active.png";
  // link.click();
}
startSellingOnKala()
{
  this.hideValidation();
  this.isWelcomePage = false;
  this.isQuiestionarePage = true;
}
onTabChange($event: any) { 
  if( $event.activeId == 'tab-quest')
  {
    this.isQuiestionarePage = false;
    this.isWelcomePage = false;
    this.isDocumentationPage = true;

  }
  else
  {
    this.isDocumentationPage = false;
    this.isWelcomePage = false;
    this.isQuiestionarePage = true;
  }
  console.log('onTabChange=' + $event.activeId);
 }
 changedoShipProds(value: any)
 {
   if(value=="No")
   {
    this.core.openModal(this.dontShipProdsModal)
    setTimeout(() => {
      this.core.modalReference.close();
      this.router.navigateByUrl('/home');
    }, 7000)
    //this.core.message.success('Product Info Saved');
   }
 }
 closeModal()
 {
  this.core.modalReference.close();
  this.router.navigateByUrl('/home');
 }
 closeQuastionareModal()
 {
  this.core.modalReference.close();
  //this.router.navigateByUrl('/home');
 }
 keyPress(event: any) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (this.sellOnKalaForm.controls.zipCode.value && this.sellOnKalaForm.controls.zipCode.errors) 
    this.zipcodeValidation = true;
  
  if (!pattern.test(inputChar)) {    
      // invalid character, prevent input
      event.preventDefault();
  }
}
zipcodeValidator() {
  this.zipcodeValidation = false;
  this.sellOnKalaForm.controls.zipCode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(regexPatterns.zipcodeRegex), this.validatorExt.getRV(true)]);
  if (!this.sellOnKalaForm.controls.zipCode.value) this.zipcodeValidation = true;
  else if (this.sellOnKalaForm.controls.zipCode.value && !this.zipPattern.test(this.sellOnKalaForm.controls.zipCode.value) ) 
      this.zipcodeValidation = true;
}
phoneNumberValidator()
{
  this.phoneNumbervalidation = false;
  this.sellOnKalaForm.controls.phoneNumber.setValidators([Validators.maxLength(10), Validators.minLength(10),
    Validators.pattern(this.phoneNumberPattern), this.validatorExt.getRV(true)]);
  if (!this.sellOnKalaForm.controls.phoneNumber.value) this.phoneNumbervalidation = true;
  else if (this.sellOnKalaForm.controls.phoneNumber.value && !this.phoneNumberPattern.test(this.sellOnKalaForm.controls.phoneNumber.value) ) 
    this.phoneNumbervalidation = true;
}
emailValidator()
{
  this.emailValidation = false;
  this.sellOnKalaForm.controls.email.setValidators([
    Validators.pattern(regexPatterns.emailRegex), this.validatorExt.getRV(true)]);
  if (!this.sellOnKalaForm.controls.email.value) this.emailValidation = true;
  else if (this.sellOnKalaForm.controls.email.value && !regexPatterns.emailRegex.test(this.sellOnKalaForm.controls.email.value) ) 
    this.emailValidation = true;
}
ngOnDestroy() {
    this.core.hideSearchField = true;
}
}

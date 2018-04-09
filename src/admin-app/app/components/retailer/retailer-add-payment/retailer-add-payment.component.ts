// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { RetailerPaymentInfo, RetailerBankAddress, BankAddress, LegalContact } from '../../../../../models/retailer-payment-info';
import { inputValidations, userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { StripePayment, TosAcceptance } from '../../../../../models/stripe-payment';



@Component({
  selector: 'app-retailer-add-payment',
  templateUrl: './retailer-add-payment.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddPaymentComponent implements OnInit {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() paymentData: RetailerPaymentInfo;
  @Output() paymentDataChange = new EventEmitter<RetailerPaymentInfo>();
  @Input() profileData: RetailerProfileInfo;
  @Output() profileDataChange = new EventEmitter<RetailerProfileInfo>();
  // #region declarations

  paymentFG1 = new FormGroup({});
  paymentFG2 = new FormGroup({});
  paymentMethods: Array<nameValue> = new Array<nameValue>();
  paymentVehicles: Array<nameValue> = new Array<nameValue>();
  paymentInfoStep = 1;
  paymentInfoObj: RetailerPaymentInfo;
  errorMsgs = inputValidations;
  paymentSaveloader = false;
  activateStripe = true;
  stripeInegrated = true;
  isAdminUser = this.core.user.isAdmin;
  maxDate = { year: new Date().getFullYear() - 13, month: 1, day: 1 };
  minDate = { year: 1950, month: 1, day: 1 };
  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService) { }

  ngOnInit() {
    this.getPaymentInfoDropdowndata();
    this.paymentInfoObj = new RetailerPaymentInfo();
    this.setFormValidators();
    if (this.retailerId) {
      this.getPaymentInfo(this.retailerId);
      this.getProfileInfo(this.retailerId);
      this.paymentMethodChange();
      this.paymentVehicleChange();
    }
  }

  setFormValidators() {
    this.paymentFG1 = this.formBuilder.group({
      paymentMethod: [this.paymentData.paymentMethod, [Validators.required]],
      paymentVehicle: [this.paymentData.paymentVehicle, [Validators.required]],
      commissionRate: [this.paymentData.commissionRate, [Validators.pattern(environment.regex.numberRegex)]],
      fixRate: [this.paymentData.fixRate, [Validators.pattern(environment.regex.numberRegex)]],
      bankname: [this.paymentData.bankName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine1: [this.paymentData.bankAddress.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.paymentData.bankAddress.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      city: [this.paymentData.bankAddress.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.paymentData.bankAddress.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.paymentData.bankAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.zipcodeRegex), Validators.required]]
    });
    this.paymentFG2 = this.formBuilder.group({
      bankAccountName: [this.paymentData.bankAccountName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      bankAccountNumber: [this.paymentData.bankAccountNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      bankABARoutingNumber: [this.paymentData.bankABARoutingNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      bankSwiftCode: [this.paymentData.bankSwiftCode, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      firstName: [this.paymentData.retailerBankAddress.firstName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      lastName: [this.paymentData.retailerBankAddress.lastName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      ssnlast4: [this.paymentData.retailerBankAddress.ssnlast4, [Validators.maxLength(4), Validators.minLength(4),
      Validators.pattern(environment.regex.zipcodeRegex), Validators.required]],
      dob: [this.paymentData.retailerBankAddress.dob, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine1LegalContact: [this.paymentData.retailerBankAddress.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2LegalContact: [this.paymentData.retailerBankAddress.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      cityLegalContact: [this.paymentData.retailerBankAddress.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      stateLegalContact: [this.paymentData.retailerBankAddress.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcodeLegalContact: [this.paymentData.retailerBankAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.zipcodeRegex), Validators.required]],
      addressLine1: [this.paymentData.retailerBankAddress.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.paymentData.retailerBankAddress.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      city: [this.paymentData.retailerBankAddress.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.paymentData.retailerBankAddress.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.paymentData.retailerBankAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.zipcodeRegex), Validators.required]]
    });
    this.getPaymentVehicles(this.paymentData.paymentMethod);
  }
  getPaymentInfoDropdowndata() {
    this.retialerService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
      this.getPaymentVehicles(this.paymentFG1.value.paymentMethod);
    });
  }
  getPaymentVehicles(paymentMethod) {
    if (paymentMethod) {
      this.retialerService.getPaymentVehicles().subscribe(res => {
        this.paymentVehicles = res.filter(p => p.parent === paymentMethod);
      });
    }
  }
  paymentMethodChange() {
    this.readPaymenInfo();
    this.getPaymentVehicles(this.paymentFG1.value.paymentMethod);


    const isRequired = this.paymentFG1.value.paymentMethod !== '1';
    this.activateStripe = isRequired;
    this.paymentFG1.controls.bankname.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.zipcodeRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG2.controls.bankAccountName.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankAccountNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankABARoutingNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankSwiftCode.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.firstName.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.lastName.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.ssnlast4.setValidators([Validators.maxLength(4), Validators.minLength(4),
    Validators.pattern(environment.regex.zipcodeRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.dob.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.zipcodeRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.addressLine1LegalContact.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.cityLegalContact.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.stateLegalContact.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.zipcodeLegalContact.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.zipcodeRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG1.controls.bankname.updateValueAndValidity();
    this.paymentFG1.controls.addressLine1.updateValueAndValidity();
    this.paymentFG1.controls.city.updateValueAndValidity();
    this.paymentFG1.controls.state.updateValueAndValidity();
    this.paymentFG1.controls.zipcode.updateValueAndValidity();
    this.paymentFG2.controls.bankAccountName.updateValueAndValidity();
    this.paymentFG2.controls.bankAccountNumber.updateValueAndValidity();
    this.paymentFG2.controls.bankABARoutingNumber.updateValueAndValidity();
    this.paymentFG2.controls.bankSwiftCode.updateValueAndValidity();
    this.paymentFG2.controls.firstName.updateValueAndValidity();
    this.paymentFG2.controls.lastName.updateValueAndValidity();
    this.paymentFG2.controls.ssnlast4.updateValueAndValidity();
    this.paymentFG2.controls.dob.updateValueAndValidity();
    this.paymentFG2.controls.addressLine1.updateValueAndValidity();
    this.paymentFG2.controls.city.updateValueAndValidity();
    this.paymentFG2.controls.state.updateValueAndValidity();
    this.paymentFG2.controls.zipcode.updateValueAndValidity();
    this.paymentFG2.controls.addressLine1LegalContact.updateValueAndValidity();
    this.paymentFG2.controls.cityLegalContact.updateValueAndValidity();
    this.paymentFG2.controls.stateLegalContact.updateValueAndValidity();
    this.paymentFG2.controls.zipcodeLegalContact.updateValueAndValidity();
  }
  paymentVehicleChange() {
    this.readPaymenInfo();
  }

  paymentInfoNext() {
    this.readPaymenInfo();
    this.validatorExt.validateAllFormFields(this.paymentFG1);
    if (this.paymentFG1.valid) {
      this.paymentInfoStep = 2;
    } else {
      this.core.message.info(userMessages.requiredFeilds);
    }
  }
  paymentInfoBack() {
    this.paymentInfoStep = 1;
  }
  paymentInfoSave() {
    this.readPaymenInfo();
    this.validatorExt.validateAllFormFields(this.paymentFG1);
    this.validatorExt.validateAllFormFields(this.paymentFG2);
    if (!this.paymentFG1.valid) {
      this.paymentInfoBack();
    } else if (!this.paymentFG2.valid) {
      this.paymentInfoNext();
    } else {
      this.paymentSaveloader = true;
      this.retialerService
        .paymentInfoSave(this.paymentInfoObj)
        .subscribe(res => {
          this.SaveData.emit('tab-Payment');
          this.paymentSaveloader = false;
          this.core.message.success(userMessages.success);
          return true;
        }, err => { this.paymentSaveloader = false; this.core.message.error('Not able to Save'); }, () => this.paymentSaveloader = false);
      return false;
    }
  }
  paymentInfoNextTab() {
    this.readPaymenInfo();
    this.validatorExt.validateAllFormFields(this.paymentFG1);
    this.validatorExt.validateAllFormFields(this.paymentFG2);
    if (!this.paymentFG1.valid) {
      this.paymentInfoBack();
    } else if (!this.paymentFG2.valid) {
      this.paymentInfoNext();
    } else {
      this.SaveData.emit('tab-Payment');
      return true;
    }
  }
  readPaymenInfo() {
    this.paymentInfoObj.retailerId = this.retailerId;
    this.paymentInfoObj.retailerName = this.profileData.businessName;
    this.paymentInfoObj.paymentMethod = this.paymentFG1.value.paymentMethod;
    this.paymentInfoObj.paymentVehicle = this.paymentFG1.value.paymentVehicle;
    this.paymentInfoObj.commissionRate = this.paymentFG1.value.commissionRate;
    this.paymentInfoObj.fixRate = this.paymentFG1.value.fixRate;
    this.paymentInfoObj.bankName = this.paymentFG1.value.bankname;

    this.paymentInfoObj.bankAddress = this.paymentInfoObj.bankAddress || new BankAddress();
    this.paymentInfoObj.bankAddress.name = this.paymentFG1.value.name;
    this.paymentInfoObj.bankAddress.addressLine1 = this.paymentFG1.value.addressLine1;
    this.paymentInfoObj.bankAddress.addressLine2 = this.paymentFG1.value.addressLine2;
    this.paymentInfoObj.bankAddress.city = this.paymentFG1.value.city;
    this.paymentInfoObj.bankAddress.state = this.paymentFG1.value.state;
    this.paymentInfoObj.bankAddress.zipcode = this.paymentFG1.value.zipcode;


    this.paymentInfoObj.bankAccountName = this.paymentFG2.value.bankAccountName;
    this.paymentInfoObj.bankAccountNumber = this.paymentFG2.value.bankAccountNumber;
    this.paymentInfoObj.bankABARoutingNumber = this.paymentFG2.value.bankABARoutingNumber;
    this.paymentInfoObj.bankSwiftCode = this.paymentFG2.value.bankSwiftCode;

    this.paymentInfoObj.legalContact = this.paymentInfoObj.legalContact || new LegalContact();
    this.paymentInfoObj.legalContact.firstName = this.paymentFG2.value.firstName;
    this.paymentInfoObj.legalContact.lastName = this.paymentFG2.value.lastName;
    this.paymentInfoObj.legalContact.name = this.paymentFG2.value.firstName + ' ' + this.paymentFG2.value.lastName;
    this.paymentInfoObj.legalContact.ssnlast4 = this.paymentFG2.value.ssnlast4;
    this.paymentInfoObj.legalContact.dob = this.paymentFG2.value.dob;
    this.paymentInfoObj.legalContact.addressLine1 = this.paymentFG2.value.addressLine1LegalContact;
    this.paymentInfoObj.legalContact.addressLine2 = this.paymentFG2.value.addressLine2LegalContact;
    this.paymentInfoObj.legalContact.city = this.paymentFG2.value.cityLegalContact;
    this.paymentInfoObj.legalContact.state = this.paymentFG2.value.stateLegalContact;
    this.paymentInfoObj.legalContact.zipcode = this.paymentFG2.value.zipcodeLegalContact;


    this.paymentInfoObj.retailerBankAddress = this.paymentInfoObj.retailerBankAddress || new RetailerBankAddress();
    this.paymentInfoObj.retailerBankAddress.addressLine1 = this.paymentFG2.value.addressLine1;
    this.paymentInfoObj.retailerBankAddress.addressLine2 = this.paymentFG2.value.addressLine2;
    this.paymentInfoObj.retailerBankAddress.city = this.paymentFG2.value.city;
    this.paymentInfoObj.retailerBankAddress.state = this.paymentFG2.value.state;
    this.paymentInfoObj.retailerBankAddress.zipcode = this.paymentFG2.value.zipcode;
    this.paymentInfoObj.addresses = [this.paymentInfoObj.bankAddress, this.paymentInfoObj.retailerBankAddress, this.paymentInfoObj.legalContact];

    return this.paymentInfoObj;
  }
  getPaymentInfo(retailerId) {
    this.retialerService
      .paymentInfoGet(this.retailerId)
      .subscribe((res: RetailerPaymentInfo) => {
        this.paymentData = res;
        this.setFormValidators();
        this.paymentInfoObj = new RetailerPaymentInfo(res);
        this.stripeInegrated = this.paymentInfoObj.stripeConnectAccountId && this.paymentInfoObj.stripeConnectAccountId !== '' || false;
        this.activateStripe = this.stripeInegrated || this.paymentInfoObj.paymentMethod && this.paymentInfoObj.paymentMethod !== '1' || false;
      });
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(this.retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.profileData = res;
      });
  }
  stripe() {
    this.readPaymenInfo();
    this.validatorExt.validateAllFormFields(this.paymentFG1);
    this.validatorExt.validateAllFormFields(this.paymentFG2);
    if (!this.paymentFG1.valid) {
      this.paymentInfoBack();
    } else if (!this.paymentFG2.valid) {
      this.paymentInfoNext();
    } else {
      if (this.paymentInfoObj.stripeToken === undefined) {
        this.paymentSaveloader = true;
        stripe.createToken('bank_account', {
          country: 'US',
          currency: 'usd',
          routing_number: this.paymentInfoObj.bankABARoutingNumber,
          account_number: this.paymentInfoObj.bankAccountNumber,
          account_holder_name: this.paymentInfoObj.bankAccountName,
          account_holder_type: 'company'
        }).then(response => {
          if (response.error) {
            const error = response.error.message;
            console.error(error);
            this.core.message.info(response.error.message);
            this.paymentSaveloader = false;
          } else {
            this.core.message.success(userMessages.stripe_token_created);
            this.paymentInfoObj.stripeToken = response.token.id;
            const stripePaymnentObj = new StripePayment({
              retailerProfile: this.profileData,
              retailerPayment: this.paymentInfoObj,
              tosAcceptance: new TosAcceptance({ client_ip: response.token.client_ip, created: response.token.created }),
              dob: this.paymentInfoObj.legalContact.dob, ssnlast4: this.paymentInfoObj.legalContact.ssnlast4
            });
            this.retialerService.addSellerAccount(stripePaymnentObj).subscribe(p => {
              this.core.message.success(userMessages.stripe_integration_completed);
              this.paymentInfoObj.stripeConnectAccountId = p;
              this.paymentInfoObj.stripeBankAccountNumber = this.paymentInfoObj.bankAccountNumber.substr(this.paymentInfoObj.bankAccountNumber.length - 4);
              this.stripeInegrated = true;
              this.retialerService
                .paymentInfoSave(this.paymentInfoObj)
                .subscribe(res => {
                  this.SaveData.emit('tab-Payment');
                  this.paymentSaveloader = false;
                  this.core.message.success(userMessages.success);
                  return true;
                }, err => { this.paymentSaveloader = false; this.core.message.error(userMessages.error); }, () => this.paymentSaveloader = false);
              return false;
            }, err => { this.paymentSaveloader = false; this.core.message.error(err, userMessages.stripe_integration_error); }, () => this.paymentSaveloader = false);
          }
        });
      }
    }
  }
}

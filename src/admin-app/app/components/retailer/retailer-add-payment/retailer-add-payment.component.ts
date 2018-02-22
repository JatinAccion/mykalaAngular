// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { RetailerPaymentInfo, RetailerBankAddress, BankAddress } from '../../../../../models/retailer-payment-info';
import { inputValidations, userMessages } from './messages';
import { CoreService } from '../../../services/core.service';



@Component({
  selector: 'app-retailer-add-payment',
  templateUrl: './retailer-add-payment.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddPaymentComponent implements OnInit, AfterViewInit, OnDestroy  {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() paymentData: RetailerPaymentInfo;
  @Output() paymentDataChange = new EventEmitter<RetailerPaymentInfo>();
  @ViewChild('cardInfo') cardInfo: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  addCard: boolean;
  // #region declarations

  paymentFG1 = new FormGroup({});
  paymentFG2 = new FormGroup({});
  paymentMethods: Array<nameValue> = new Array<nameValue>();
  paymentVehicles: Array<nameValue> = new Array<nameValue>();
  paymentInfoStep = 1;
  paymentInfoObj: RetailerPaymentInfo;
  errorMsgs = inputValidations;
  paymentSaveloader = false;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService,
    private cd: ChangeDetectorRef
  ) {
  }
  ngAfterViewInit() {
    const style = {
      base: {
        lineHeight: '24px',
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        fontSize: '19px',
        '::placeholder': {
          //color: 'purple'
        }
      }
    };
    this.card = elements.create('', { style });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }
  resetAddCard() {
    this.addCard = false;
    this.error = null;
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    this.ngAfterViewInit();
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }
  ngOnInit() {
    this.getPaymentInfoDropdowndata();
    this.paymentInfoObj = new RetailerPaymentInfo();
    this.setFormValidators();
    if (this.retailerId) {
      this.getPaymentInfo(this.retailerId);
      this.paymentMethodChange();
      this.paymentVehicleChange();
    }
    // this.stripeService.elements(this.elementsOptions)
    //   .subscribe(elements => {
    //     this.elements = elements;
    //     // Only mount the element the first time
    //     // if (!this.bankAccount) {
    //     //   this.bankAccount = this.elements.create('bank_account', {
    //     //     style: {
    //     //       base: {
    //     //         iconColor: '#666EE8',
    //     //         color: '#31325F',
    //     //         lineHeight: '40px',
    //     //         fontWeight: 300,
    //     //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     //         fontSize: '18px',
    //     //         '::placeholder': {
    //     //           color: '#CFD7E0'
    //     //         }
    //     //       }
    //     //     }
    //       });
    //       // this.card.mount(this.cardRef.nativeElement);
    //     }
    //   });
  }

  setFormValidators() {
    this.paymentFG1 = this.formBuilder.group({
      paymentMethod: [this.paymentData.paymentMethod, [Validators.required]],
      paymentVehicle: [this.paymentData.paymentVehicle, [Validators.required]],
      bankname: [this.paymentData.bankName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine1: [this.paymentData.bankAddress.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.paymentData.bankAddress.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      city: [this.paymentData.bankAddress.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.paymentData.bankAddress.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.paymentData.bankAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]]
    });
    this.paymentFG2 = this.formBuilder.group({
      bankAccountName: [this.paymentData.bankAccountName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      bankAccountNumber: [this.paymentData.bankAccountNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      bankABARoutingNumber: [this.paymentData.bankABARoutingNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      bankSwiftCode: [this.paymentData.bankSwiftCode, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine1: [this.paymentData.retailerBankAddress.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.paymentData.retailerBankAddress.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      city: [this.paymentData.retailerBankAddress.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.paymentData.retailerBankAddress.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.paymentData.retailerBankAddress.zipcode, [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]]
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

    this.paymentFG1.controls.bankname.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG2.controls.bankAccountName.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankAccountNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankABARoutingNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.bankSwiftCode.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG1.controls.bankname.updateValueAndValidity();
    this.paymentFG1.controls.addressLine1.updateValueAndValidity();
    this.paymentFG1.controls.city.updateValueAndValidity();
    this.paymentFG1.controls.state.updateValueAndValidity();
    this.paymentFG1.controls.zipcode.updateValueAndValidity();
    this.paymentFG2.controls.bankAccountName.updateValueAndValidity();
    this.paymentFG2.controls.bankAccountNumber.updateValueAndValidity();
    this.paymentFG2.controls.bankABARoutingNumber.updateValueAndValidity();
    this.paymentFG2.controls.bankSwiftCode.updateValueAndValidity();
    this.paymentFG2.controls.addressLine1.updateValueAndValidity();
    this.paymentFG2.controls.city.updateValueAndValidity();
    this.paymentFG2.controls.state.updateValueAndValidity();
    this.paymentFG2.controls.zipcode.updateValueAndValidity();
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
  readPaymenInfo() {
    this.paymentInfoObj.retailerId = this.retailerId;
    this.paymentInfoObj.paymentMethod = this.paymentFG1.value.paymentMethod;
    this.paymentInfoObj.paymentVehicle = this.paymentFG1.value.paymentVehicle;
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

    this.paymentInfoObj.retailerBankAddress = this.paymentInfoObj.retailerBankAddress || new RetailerBankAddress();
    this.paymentInfoObj.retailerBankAddress.addressLine1 = this.paymentFG2.value.addressLine1;
    this.paymentInfoObj.retailerBankAddress.addressLine2 = this.paymentFG2.value.addressLine2;
    this.paymentInfoObj.retailerBankAddress.city = this.paymentFG2.value.city;
    this.paymentInfoObj.retailerBankAddress.state = this.paymentFG2.value.state;
    this.paymentInfoObj.retailerBankAddress.zipcode = this.paymentFG2.value.zipcode;
    this.paymentInfoObj.addresses = [this.paymentInfoObj.bankAddress, this.paymentInfoObj.retailerBankAddress];

    return this.paymentInfoObj;
  }
  getPaymentInfo(retailerId) {
    this.retialerService
      .paymentInfoGet(this.retailerId)
      .subscribe((res: RetailerPaymentInfo) => {
        this.paymentData = res;
        this.setFormValidators();
        this.paymentInfoObj = new RetailerPaymentInfo(res);
      });
  }
  stripe() {
    const accountParams = {
      country: 'string',
      currency: 'string',
      routing_number: 'string',
      account_number: 'string',
      account_holder_name: 'string',
      account_holder_type: 'company'
    };

    // stripe.bankAccount.createToken({
    //   country: $('.country').val(),
    //   currency: $('.currency').val(),
    //   routing_number: $('.routing-number').val(),
    //   account_number: $('.account-number').val(),
    //   account_holder_name: $('.name').val(),
    //   account_holder_type: $('.account_holder_type').val()
    // }, this.stripeResponseHandler);
  }
  stripeResponseHandler(status, response) {

    // // Grab the form:
    // var $form = $('#payment-form');
  
    // if (response.error) { // Problem!
  
    //   // Show the errors on the form:
    //   $form.find('.bank-errors').text(response.error.message);
    //   $form.find('button').prop('disabled', false); // Re-enable submission
  
    // } else { // Token created!
  
    //   // Get the token ID:
    //   var token = response.id;
  
    //   // Insert the token into the form so it gets submitted to the server:
    //   $form.append($('<input type="hidden" name="stripeToken" />').val(token));
  
    //   // Submit the form:
    //   $form.get(0).submit();
  
    // }
  }
  buy() {
    // const name = this.paymentFG1.get("bankname").value;
    // this.stripeService
    //   .createToken(this.card.getCard(), { name })
    //   .subscribe(result => {
    //     if (result.token) {
    //       // Use the token to create a charge or a customer
    //       // https://stripe.com/docs/charges
    //       // console.log(result.token.id);
    //     } else if (result.error) {
    //       // Error creating the token
    //       console.log(result.error.message);
    //     }
    //   });
  }
}

// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Retailer, RetailerReturnPolicy } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { RetailerPaymentInfo, BankAddress } from '../../../../../models/retailer-payment-info';
import { inputValidations } from './messages';


@Component({
  selector: 'app-retailer-add-payment',
  templateUrl: './retailer-add-payment.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddPaymentComponent implements OnInit {
  @Input() retailerId: number;
  @Output() SaveData = new EventEmitter<any>();
  // #region declarations

  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  paymentFG1 = new FormGroup({});
  paymentFG2 = new FormGroup({});
  paymentMethods: Array<nameValue> = new Array<nameValue>();
  paymentVehicles: Array<nameValue> = new Array<nameValue>();
  paymentInfoStep = 1;
  paymentInfoObj = new RetailerPaymentInfo();
  errorMsgs = inputValidations;
  paymentSaveloader = false;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
    this.getPaymentInfoDropdowndata();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  // #region PaymentInfo

  setFormValidators() {
    this.paymentFG1 = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      paymentVehicle: ['', [Validators.required]],
      bankname: ['', [Validators.pattern(environment.regex.textRegex)]],
      addressLine1: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: ['', [Validators.pattern(environment.regex.textRegex)]],
      city: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: ['', [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]]
    });
    this.paymentFG2 = this.formBuilder.group({
      accountName: ['', [Validators.pattern(environment.regex.textRegex)]],
      accountNumber: ['', [Validators.pattern(environment.regex.numberRegex)]],
      routingNumber: ['', [Validators.pattern(environment.regex.numberRegex)]],
      swiftCode: ['', [Validators.pattern(environment.regex.textRegex)]],
      name: ['', [Validators.pattern(environment.regex.textRegex)]],
      addressLine1: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: ['', [Validators.pattern(environment.regex.textRegex)]],
      city: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: ['', [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: ['', [Validators.maxLength(5), Validators.minLength(5),
      Validators.pattern(environment.regex.numberRegex), Validators.required]]
    });
  }
  getPaymentInfoDropdowndata() {
    this.retialerService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
    });
  }
  paymentMethodChange() {
    this.readPaymenInfo();
    this.retialerService.getPaymentVehicles().subscribe(res => {
      this.paymentVehicles = res.filter(p => p.parent === this.paymentInfoObj.paymentMethod);
    });

  }
  paymentInfoNext() {
    this.paymentInfoStep = 2;
    this.readPaymenInfo();
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
        .then(res => {
          this.SaveData.emit('tab-Payment');
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Saved successfully',
            show: true
          };
          this.paymentSaveloader = false;
          return true;
        })
        .catch(err => {
          console.log(err);
          this.alert = {
            id: 1,
            type: 'danger',
            message: 'Not able to Save',
            show: true
          };
          this.paymentSaveloader = false;
        });
      return false;
    }
  }
  readPaymenInfo() {
    this.paymentInfoObj.retailerId = this.retailerId;
    this.paymentInfoObj.paymentMethod = this.paymentFG1.value.paymentMethod;
    this.paymentInfoObj.paymentVehicle = this.paymentFG1.value.paymentVehicle;
    this.paymentInfoObj.bankName = this.paymentFG1.value.bankname;
    this.paymentInfoObj.addressLine1 = this.paymentFG1.value.addressLine1;
    this.paymentInfoObj.addressLine2 = this.paymentFG1.value.addressLine2;
    this.paymentInfoObj.city = this.paymentFG1.value.city;
    this.paymentInfoObj.state = this.paymentFG1.value.state;
    this.paymentInfoObj.zipcode = this.paymentFG1.value.zipcode;

    this.paymentInfoObj.accountName = this.paymentFG2.value.accountName;
    this.paymentInfoObj.accountNumber = this.paymentFG2.value.accountNumber;
    this.paymentInfoObj.routingNumber = this.paymentFG2.value.routingNumber;
    this.paymentInfoObj.swiftCode = this.paymentFG2.value.swiftCode;

    this.paymentInfoObj.bankAddress = new BankAddress();
    this.paymentInfoObj.bankAddress.name = this.paymentFG2.value.name;
    this.paymentInfoObj.bankAddress.addressLine1 = this.paymentFG2.value.addressLine1;
    this.paymentInfoObj.bankAddress.addressLine2 = this.paymentFG2.value.addressLine2;
    this.paymentInfoObj.bankAddress.city = this.paymentFG2.value.city;
    this.paymentInfoObj.bankAddress.state = this.paymentFG2.value.state;
    this.paymentInfoObj.bankAddress.zipcode = this.paymentFG2.value.zipcode;

    return this.paymentInfoObj;
  }
  getPaymentInfo(retailerId) {
    this.retialerService
      .paymentInfoGet(this.retailerId)
      .subscribe((res: RetailerPaymentInfo) => {
        this.paymentInfoObj = res;
        this.paymentFG1.patchValue({
          paymentMethod: this.paymentInfoObj.paymentMethod,
          paymentVehicle: this.paymentInfoObj.paymentVehicle,
          bankname: this.paymentInfoObj.bankName,
          addressLine1: this.paymentInfoObj.addressLine1,
          addressLine2: this.paymentInfoObj.addressLine2,
          city: this.paymentInfoObj.city,
          state: this.paymentInfoObj.state,
          zipcode: this.paymentInfoObj.zipcode
        });

        this.paymentFG2.patchValue({
          accountName: this.paymentInfoObj.accountName,
          accountNumber: this.paymentInfoObj.accountNumber,
          routingNumber: this.paymentInfoObj.routingNumber,
          swiftCode: this.paymentInfoObj.swiftCode,

          name: this.paymentInfoObj.bankAddress.name,
          addressLine1: this.paymentInfoObj.bankAddress.addressLine1,
          addressLine2: this.paymentInfoObj.bankAddress.addressLine2,
          city: this.paymentInfoObj.bankAddress.city,
          state: this.paymentInfoObj.bankAddress.state,
          zipcode: this.paymentInfoObj.bankAddress.zipcode
        });
      });
  }

  // #endregion PaymentInfo

}

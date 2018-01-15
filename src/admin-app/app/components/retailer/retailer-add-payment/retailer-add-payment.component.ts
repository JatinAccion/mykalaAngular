// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { RetailerPaymentInfo, BankAddress } from '../../../../../models/retailer-payment-info';
import { inputValidations } from './messages';
import { CoreService } from '../../../services/core.service';


@Component({
  selector: 'app-retailer-add-payment',
  templateUrl: './retailer-add-payment.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddPaymentComponent implements OnInit {
  @Input() retailerId: number;
  @Output() SaveData = new EventEmitter<any>();
  @Input() paymentData: RetailerPaymentInfo;
  @Output() paymentDataChange = new EventEmitter<RetailerPaymentInfo>();
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
    private validatorExt: ValidatorExt,
    private core: CoreService
  ) {
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
      accountName: [this.paymentData.accountName, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      accountNumber: [this.paymentData.accountNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      routingNumber: [this.paymentData.routingNumber, [Validators.pattern(environment.regex.numberRegex), Validators.required]],
      swiftCode: [this.paymentData.swiftCode, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      name: [this.paymentData.bankAddress.name, [Validators.pattern(environment.regex.textRegex)]],
      addressLine1: [this.paymentData.addressLine1, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      addressLine2: [this.paymentData.addressLine2, [Validators.pattern(environment.regex.textRegex)]],
      city: [this.paymentData.city, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      state: [this.paymentData.state, [Validators.pattern(environment.regex.textRegex), Validators.required]],
      zipcode: [this.paymentData.zipcode, [Validators.maxLength(5), Validators.minLength(5),
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
  paymentVehicleChange() {
    this.readPaymenInfo();
    const isRequired = this.paymentFG1.value.paymentVehicle === '1';

    this.paymentFG1.controls.bankname.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG1.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG2.controls.accountName.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.accountNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.routingNumber.setValidators([Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.swiftCode.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.addressLine1.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.addressLine2.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.city.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.state.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(isRequired)]);
    this.paymentFG2.controls.zipcode.setValidators([Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern(environment.regex.numberRegex), this.validatorExt.getRV(isRequired)]);

    this.paymentFG1.controls.bankname.updateValueAndValidity();
    this.paymentFG1.controls.addressLine1.updateValueAndValidity();
    this.paymentFG1.controls.city.updateValueAndValidity();
    this.paymentFG1.controls.state.updateValueAndValidity();
    this.paymentFG1.controls.zipcode.updateValueAndValidity();
    this.paymentFG2.controls.accountName.updateValueAndValidity();
    this.paymentFG2.controls.accountNumber.updateValueAndValidity();
    this.paymentFG2.controls.routingNumber.updateValueAndValidity();
    this.paymentFG2.controls.swiftCode.updateValueAndValidity();
    this.paymentFG2.controls.addressLine1.updateValueAndValidity();
    this.paymentFG2.controls.addressLine2.updateValueAndValidity();
    this.paymentFG2.controls.city.updateValueAndValidity();
    this.paymentFG2.controls.state.updateValueAndValidity();
    this.paymentFG2.controls.zipcode.updateValueAndValidity();

  }


  paymentInfoNext() {
    this.readPaymenInfo();
    this.validatorExt.validateAllFormFields(this.paymentFG1);
    if (this.paymentFG1.valid) {
      this.paymentInfoStep = 2;
    } else {
      this.core.message.info('Please fill mandatory');
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
          this.core.message.success('Payment Info Saved');
          return true;
        }, err => this.core.message.error('Not able to Save'), () => this.paymentSaveloader = false);
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


    this.paymentInfoObj.accountName = this.paymentFG2.value.accountName;
    this.paymentInfoObj.accountNumber = this.paymentFG2.value.accountNumber;
    this.paymentInfoObj.routingNumber = this.paymentFG2.value.routingNumber;
    this.paymentInfoObj.swiftCode = this.paymentFG2.value.swiftCode;


    this.paymentInfoObj.addressLine1 = this.paymentFG2.value.addressLine1;
    this.paymentInfoObj.addressLine2 = this.paymentFG2.value.addressLine2;
    this.paymentInfoObj.city = this.paymentFG2.value.city;
    this.paymentInfoObj.state = this.paymentFG2.value.state;
    this.paymentInfoObj.zipcode = this.paymentFG2.value.zipcode;

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
}

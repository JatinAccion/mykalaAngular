// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { InquiryService } from '../inquiry.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { Inquiry, InquiryTypes, InquiryResolutions, InquiryResolvedOutcomes, InquiryStatuses, InquiryTypeOther, InquiryPrioritys, InquiryResolvedStatus } from '../../../../../models/inquiry';
import { Promise } from 'q';
import { inputValidations } from './messages';
import { UserService } from '../../user/user.service';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';
// #endregion imports


@Component({
  selector: 'app-inquiry-add',
  templateUrl: './inquiry-add.component.html',
  styleUrls: ['./../inquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiryAddComponent implements OnInit {
  fromDate(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  saveloader: boolean;
  users: any[];
  showResoltionDate: any;
  showResoltionDescription: boolean;
  showResolutionNotes: boolean;
  showResoltionOutcome: boolean;
  showResoltion: boolean;
  showInquiryTypeCategoryOther: boolean;
  showInquiryTypeOther: boolean;
  inquiryTypeCategorys: string[];
  fG1: FormGroup;
  saveLoader: boolean;
  // #region declarations
  inquiryId = '';
  inquiry = new Inquiry();
  errorMsgs = inputValidations;
  inquiryTypes = InquiryTypes;
  inquiryStatuses = InquiryStatuses;
  inquiryResolvedOutcomes = InquiryResolvedOutcomes;
  inquiryResolutions = InquiryResolutions;
  inquiryPrioritys = InquiryPrioritys;
  minDate: any;
  maxDate: any;
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private inquiryService: InquiryService,
    public validatorExt: ValidatorExt,
    private userService: UserService,
    private core: CoreService
  ) {
    this.inquiryId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setFormValidators();
    this.getUsers();
    if (this.inquiryId) {
      this.getInquiryData(this.inquiryId);
    }
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      inquiryType: [{ value: this.inquiry.inquiryType, disabled: false }, [Validators.required]],
      inquiryTypeOther: [{ value: this.inquiry.inquiryTypeOther, disabled: false }, [Validators.required]],
      inquiryTypeCategory: [{ value: this.inquiry.inquiryCategory, disabled: false }, [Validators.required]],
      inquiryTypeCategoryOther: [{ value: this.inquiry.inquiryCategoryOther, disabled: false }, [Validators.required]],
      description: [{ value: this.inquiry.description, disabled: false }, [Validators.required]],
      orderId: [{ value: this.inquiry.orderId, disabled: false }, [Validators.required]],
      priority: [{ value: this.inquiry.priority, disabled: false }, [Validators.required]],
      assignedTo: [{ value: this.inquiry.assignedTo, disabled: false }, [Validators.required]],
      inquiryStatus: [{ value: this.inquiry.inquiryStatus, disabled: false }, [Validators.required]],
      inquiryDate: [{ value: this.fromDate(this.inquiry.inquiryDate), disabled: false }, [Validators.required]],
      inquiryNotes: [{ value: this.inquiry.notes && this.inquiry.notes.length > 0 ? this.inquiry.notes[0] : '', disabled: false }, [Validators.required]],
      resolutionOutcome: [{ value: '', disabled: false }, [Validators.required]],
      resolution: [{ value: this.inquiry.resolutionType, disabled: false }, [Validators.required]],
      resolutionNotes: [{ value: this.inquiry.resolutionNotes && this.inquiry.resolutionNotes.length > 0 ? this.inquiry.resolutionNotes[0] : '', disabled: false }, [Validators.required]],
      resolutionDescription: [{ value: this.inquiry.resolutionDescription, disabled: false }, [Validators.required]],
      resolutionDate: [{ value: this.fromDate(this.inquiry.resolutionDate), disabled: false }, [Validators.required]],
    });
  }
  getUsers(): any {
    this.userService.get(null).subscribe((res) => {
      this.users = res;
    });
  }
  getInquiryData(id) {
    this.inquiryService.get(id).subscribe((res) => {
      return this.inquiry = res[0];
    });
  }
  saveInquiry() {
    this.saveLoader = true;
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
      this.core.message.info(userMessages.requiredFeilds);
    } else {
      this.saveloader = true;
      this.inquiryService
        .save(this.inquiry)
        .subscribe(res => {
          this.saveloader = false;
          this.core.message.success(userMessages.success);
          return true;
        }, err => { this.saveloader = false; this.core.message.error(userMessages.error); }, () => this.saveloader = false);
      return false;
    }
  }
  paymentVehicleChange() { }
  inquiryTypeChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showInquiryTypeOther = form.inquiryType === InquiryTypeOther;
    formControls.inquiryTypeOther.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(this.showInquiryTypeOther)]);
    formControls.inquiryTypeCategory.setValidators([this.validatorExt.getRV(!this.showInquiryTypeOther)]);
    formControls.inquiryTypeOther.updateValueAndValidity();
    formControls.inquiryTypeCategory.updateValueAndValidity();

    this.inquiryTypeCategorys = this.inquiryTypes.filter(p => p.name === form.inquiryType)[0].categories;
  }
  inquiryTypeCategoryChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showInquiryTypeCategoryOther = form.inquiryTypeCategory === InquiryTypeOther;
    formControls.inquiryTypeCategoryOther.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(this.showInquiryTypeCategoryOther)]);
    formControls.inquiryTypeCategoryOther.updateValueAndValidity();
  }
  inquiryStatusChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showResoltion = form.inquiryStatus === InquiryResolvedStatus;
    this.showResolutionNotes = form.inquiryStatus === InquiryResolvedStatus;
    this.showResoltionOutcome = form.inquiryStatus === InquiryResolvedStatus;
    this.showResoltionDescription = form.inquiryStatus === InquiryResolvedStatus;
    this.showResoltionDate = form.inquiryStatus === InquiryResolvedStatus;

    formControls.resolutionOutcome.setValidators([this.validatorExt.getRV(this.showResoltionOutcome)]);
    formControls.resolution.setValidators([this.validatorExt.getRV(this.showResoltion)]);
    formControls.resolutionNotes.setValidators([this.validatorExt.getRV(this.showResolutionNotes)]);
    formControls.resolutionDescription.setValidators([this.validatorExt.getRV(this.showResoltionDescription)]);
    formControls.resolutionDate.setValidators([this.validatorExt.getRV(this.showResoltionDate)]);
    formControls.resolutionOutcome.updateValueAndValidity();
    formControls.resolution.updateValueAndValidity();
    formControls.resolutionNotes.updateValueAndValidity();
    formControls.resolutionDescription.updateValueAndValidity();
    formControls.resolutionDate.updateValueAndValidity();
  }
  readForm() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    // this.inquiry.supportId = form.supportId;
    this.inquiry = this.inquiry || new Inquiry();
    this.inquiry.customerId = form.customerId;
    this.inquiry.customerName = form.customerName;
    this.inquiry.orderId = form.orderId;
    this.inquiry.orderDate = form.orderDate;
    this.inquiry.productName = form.productName;
    this.inquiry.productCost = form.productCost;
    this.inquiry.inquiryType = form.inquiryType;
    this.inquiry.inquiryDate = this.toDate(form.inquiryDate);
    this.inquiry.inquiryCategory = form.inquiryCategory;
    this.inquiry.description = form.description;
    this.inquiry.priority = form.priority;
    this.inquiry.assignedTo = form.assignedTo;
    this.inquiry.inquiryStatus = form.inquiryStatus;
    this.inquiry.notes = [form.inquiryNotes];
    this.inquiry.resolvedInquiryStatus = form.resolvedInquiryStatus;
    this.inquiry.resolutionDate = form.resolutionDate;
    this.inquiry.resolutionType = form.resolutionType;
    this.inquiry.resolutionDescription = form.resolutionDescription;
    this.inquiry.resolutionNotes = [form.resolutionNotes];
  }
  toDate(obj) {
    if (obj.year && obj.month && obj.day) {
      return `${obj.year}-${obj.month}-${obj.day}`;
    }
  }
}

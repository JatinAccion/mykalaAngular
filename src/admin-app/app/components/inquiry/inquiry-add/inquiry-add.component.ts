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
import { inputValidations } from './messages';
import { UserService } from '../../user/user.service';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';
import { OrderService } from '../../order/order.service';
import { ReportOrder, ReportOrderItem } from '../../../../../models/report-order';
import DateUtils from '../../../../../common/utils';
// #endregion imports


@Component({
  selector: 'app-inquiry-add',
  templateUrl: './inquiry-add.component.html',
  styleUrls: ['./../inquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiryAddComponent implements OnInit {
  showProduct: boolean;
  order: ReportOrder;

  saveloader: boolean;
  users: any[];
  showResolutionDate: any;
  showResolutionDescription: boolean;
  showResolutionNotes: boolean;
  showResolutionOutcome: boolean;
  showResolution: boolean;
  showinquiryCategoryOther: boolean;
  showInquiryTypeOther: boolean;
  inquiryCategorys: string[];
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
  dateUtils = new DateUtils();

  minDateInquiry = { year: new Date().getFullYear() - 1, month: 1, day: 1 };
  maxDateInquiry = this.dateUtils.fromDate(Date.now());
  minDateResolution = this.dateUtils.fromDate(this.minDateInquiry);
  maxDateResolution = this.dateUtils.fromDate(Date.now());
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private inquiryService: InquiryService,
    public validatorExt: ValidatorExt,
    private userService: UserService,
    private orderService: OrderService,
    private core: CoreService
  ) {
    this.inquiryId = route.snapshot.params['id'] || '';
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
      inquiryType: [{ value: this.inquiry.inquiryType || '', disabled: false }, [Validators.required]],
      inquiryTypeOther: [{ value: this.inquiry.otherTypeDesc, disabled: false }, [Validators.required]],
      inquiryCategory: [{ value: this.inquiry.inquiryCategory || '', disabled: false }, [Validators.required]],
      inquiryCategoryOther: [{ value: this.inquiry.otherCategoryDesc, disabled: false }, [Validators.required]],
      description: [{ value: this.inquiry.description, disabled: false }, [Validators.required]],
      orderId: [{ value: this.inquiry.orderId, disabled: false }, [Validators.required]],
      product: [{ value: null, disabled: false }],
      priority: [{ value: this.inquiry.priority || '', disabled: false }, [Validators.required]],
      assignedTo: [{ value: this.inquiry.assignedTo || '', disabled: false }, [Validators.required]],
      inquiryStatus: [{ value: this.inquiry.inquiryStatus || '', disabled: false }, [Validators.required]],
      inquiryDate: [{ value: this.fromDate(this.inquiry.inquiryDate), disabled: false }, [Validators.required]],
      inquiryNotes: [{ value: this.inquiry.notes && this.inquiry.notes.length > 0 ? this.inquiry.notes[0] : '', disabled: false }, [Validators.required]],
      resolutionOutcome: [{ value: this.inquiry.resolvedInquiryStatus || '', disabled: false }, [Validators.required]],
      resolutionType: [{ value: this.inquiry.resolutionType || '', disabled: false }, [Validators.required]],
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
    this.inquiryService.getInquiryDetails(id).subscribe((res) => {
      this.inquiry = res;
      this.minDateInquiry = this.dateUtils.fromDate(res.orderDate);
      this.setFormValidators();
      this.inquiryTypeChange();
      this.inquiryCategoryChange();
      this.inquiryStatusChange();
      this.checkOrder();
    });
  }
  inquiryDateChange() {
    const form = this.fG1.value;
    this.minDateResolution = form.inquiryDate;
  }
  saveInquiry() {
    this.saveLoader = true;
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
      this.core.message.info(userMessages.requiredFeilds);
    } else {
      if (!this.order || !this.inquiry.productName || !this.inquiry.retailerId) {
        this.core.message.info(userMessages.invalidOrder);
      } else {
        this.saveloader = true;
        this.inquiryService
          .save(this.inquiry)
          .subscribe(res => {
            this.saveloader = false;
            this.core.message.success(userMessages.success);
            this.router.navigateByUrl('/inquiry-list');
            return true;
          }, err => { this.saveloader = false; this.core.message.error(userMessages.error); }, () => this.saveloader = false);

      }
      return false;
    }
  }
  async checkOrder() {
    if (this.fG1.value.orderId && (!this.order || !this.order.orderId || this.fG1.value.orderId !== this.order.orderId)) {
      await this.getOrderDetails(this.fG1.value.orderId);
      if (!this.order) {
        this.core.message.info(userMessages.invalidOrder);
      } else {
        this.inquiry.customerId = this.order.userId;
        this.inquiry.orderDate = this.toDate(this.order.purchasedDate);
        this.minDateInquiry = this.fromDate(this.order.purchasedDate);
        this.minDateResolution = this.fromDate(this.order.purchasedDate);
        this.inquiry.customerName = this.order.customerName;
        if (this.order.orderItems && this.order.orderItems.length > 0) {
          if (this.order.orderItems.length === 1 || !this.inquiry.productName) {
            this.setInquiryOrderDetails(this.order.orderItems[0]);
          } else {
            if (this.inquiry.productName) {
              const orderItems = this.order.orderItems.filter(p => p.productName === this.inquiry.productName);
              if (orderItems && orderItems.length > 0) {
                this.setInquiryOrderDetails(orderItems[0]);
              }
            }
          }
          this.showProduct = this.order.orderItems.length > 1;
        }
      }
    }
  }
  setInquiryOrderDetails(orderItem: ReportOrderItem) {
    this.inquiry = this.inquiry || new Inquiry();
    this.inquiry.productName = orderItem.productName;
    this.inquiry.productTotalCost = (orderItem.productPrice * orderItem.productQuantity) + orderItem.productTaxCost + orderItem.shippingCost;
    this.inquiry.productCost = orderItem.productPrice;
    this.inquiry.retailerId = orderItem.retailerId;
    this.inquiry.retailerName = orderItem.retailerName;
    if (!this.fG1.value.product) {
      this.fG1.controls.product.setValue(orderItem);
      this.fG1.controls.product.updateValueAndValidity();

    }
  }
  inquiryTypeChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showInquiryTypeOther = form.inquiryType === InquiryTypeOther;
    formControls.inquiryTypeOther.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(this.showInquiryTypeOther)]);
    formControls.inquiryCategory.setValidators([this.validatorExt.getRV(!this.showInquiryTypeOther)]);
    formControls.inquiryTypeOther.updateValueAndValidity();
    formControls.inquiryCategory.updateValueAndValidity();

    this.inquiryCategorys = this.inquiryTypes.filter(p => p.name === form.inquiryType)[0].categories;
  }
  inquiryCategoryChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showinquiryCategoryOther = form.inquiryCategory === InquiryTypeOther;
    formControls.inquiryCategoryOther.setValidators([Validators.pattern(environment.regex.textRegex), this.validatorExt.getRV(this.showinquiryCategoryOther)]);
    formControls.inquiryCategoryOther.updateValueAndValidity();
  }
  inquiryStatusChange() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.showResolution = form.inquiryStatus === InquiryResolvedStatus;
    this.showResolutionNotes = form.inquiryStatus === InquiryResolvedStatus;
    this.showResolutionOutcome = form.inquiryStatus === InquiryResolvedStatus;
    this.showResolutionDescription = form.inquiryStatus === InquiryResolvedStatus;
    this.showResolutionDate = form.inquiryStatus === InquiryResolvedStatus;
    if (!this.showResolution) {
      formControls.resolutionOutcome.patchValue('');
      formControls.resolutionType.patchValue('');
      formControls.resolutionNotes.patchValue('');
      formControls.resolutionDescription.patchValue('');
      formControls.resolutionDate.patchValue('');
      formControls.resolutionOutcome.clearValidators();
      formControls.resolutionType.clearValidators();
      formControls.resolutionNotes.setValidators([this.validatorExt.getRV(this.showResolution)]);
      formControls.resolutionDescription.setValidators([this.validatorExt.getRV(this.showResolution)]);
      formControls.resolutionDate.clearValidators();
      formControls.resolutionOutcome.updateValueAndValidity();
      formControls.resolutionType.updateValueAndValidity();
      formControls.resolutionNotes.updateValueAndValidity();
      formControls.resolutionDescription.updateValueAndValidity();
      formControls.resolutionDate.updateValueAndValidity();
    }
  }
  readForm() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    // this.inquiry.supportId = form.supportId;
    this.inquiry = this.inquiry || new Inquiry();
    // this.inquiry.customerId = form.customerId;
    // this.inquiry.customerName = form.customerName;
    this.inquiry.orderId = form.orderId;
    // this.inquiry.orderDate = form.orderDate;
    // this.inquiry.productName = form.productName;
    // this.inquiry.productCost = form.productCost;
    this.inquiry.inquiryType = form.inquiryType;
    this.inquiry.otherTypeDesc = form.inquiryTypeOther;
    // this.inquiry.inquiryDate = this.toDate(form.inquiryDate);
    let inquiryDate = new Date(this.toDate(form.inquiryDate));
    this.inquiry.inquiryDate = new Date(inquiryDate.getFullYear() + '/' + (inquiryDate.getMonth() + 1) + '/' + inquiryDate.getDate())
    this.inquiry.inquiryCategory = form.inquiryCategory;
    this.inquiry.otherCategoryDesc = form.inquiryCategoryOther;
    this.inquiry.description = form.description;
    this.inquiry.priority = form.priority;
    this.inquiry.assignedTo = form.assignedTo;
    this.inquiry.inquiryStatus = form.inquiryStatus;
    this.inquiry.notes = [form.inquiryNotes];
    this.inquiry.resolvedInquiryStatus = form.resolutionOutcome;
    this.inquiry.resolutionDate = this.toDate(form.resolutionDate);
    if (this.inquiry.resolutionDate) this.inquiry.resolutionDate = new Date(new Date(this.inquiry.resolutionDate).getFullYear() + '/' + (new Date(this.inquiry.resolutionDate).getMonth() + 1) + '/' + new Date(this.inquiry.resolutionDate).getDate());
    this.inquiry.resolutionType = form.resolutionType;
    this.inquiry.resolutionDescription = form.resolutionDescription;
    this.inquiry.resolutionNotes = [form.resolutionNotes];
    if (!this.inquiry.supportId) {
      delete this.inquiry.createdDate;
      delete this.inquiry.modifiedDate;
    } else {
      delete this.inquiry.modifiedDate;
    }

  }
  toDate(obj) {
    if (obj.year && obj.month && obj.day) {
      return `${obj.year}-${obj.month}-${obj.day}`;
    } else if (new Date(obj)) {
      const date = new Date(obj);
      if (date.getDate() ? true : false) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      } else { return ''; }
    }
  }
  fromDate(obj: any): any {
    const date = obj ? new Date(obj) : new Date();
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
  getOrderDetails(orderId) {
    return this.orderService.getById(orderId).toPromise().then(p => { this.order = p; return p; });
  }
}

// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { inputValidations } from './messages';
import { RetailerNotification } from '../../../../../models/retailer';
import { CoreService } from '../../../services/core.service';


@Component({
  selector: 'app-retailer-add-notifications',
  templateUrl: './retailer-add-notifications.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddNotificationsComponent implements OnInit {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() notificationData: RetailerNotification;
  @Output() notificationDataChange = new EventEmitter<RetailerNotification>();
  // #region declarations

  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  fG1 = new FormGroup({});
  step = 1;
  Obj: RetailerNotification;
  errorMsgs = inputValidations;
  saveLoader = false;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
  }
  ngOnInit() {
    this.Obj = new RetailerNotification();
    this.setFormValidators();
    if (this.retailerId) {
      this.getData(this.retailerId);
    }
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      orderEmail: [this.notificationData.orderEmail, [Validators.email, Validators.maxLength(255), Validators.required]],
      shipEmail: [this.notificationData.shipEmail, [Validators.maxLength(255), Validators.email, Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.retialerService
        .saveNotifications(this.Obj)
        .subscribe(res => {
          this.SaveData.emit('tab-Notifications');
          this.saveLoader = false;
          this.core.message.success('Notifications Info Saved');
          return true;
        }, err => this.core.message.success('Not able to Save'), () => this.saveLoader = false);
      return false;
    }
  }


  readForm() {
    this.Obj = this.Obj || new RetailerNotification();
    this.Obj.retailerId = this.retailerId;
    this.Obj.orderEmail = this.fG1.value.orderEmail;
    this.Obj.shipEmail = this.fG1.value.shipEmail;
    return this.Obj;
  }

  getData(retailerId) {
    this.retialerService
      .notificationGet(this.retailerId)
      .subscribe((res: RetailerNotification) => {
        this.notificationData = res;
        this.setFormValidators();
        this.Obj = new RetailerNotification(res);
      });
  }
}

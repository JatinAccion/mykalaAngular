// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Retailer, RetailerNotification } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { inputValidations } from './messages';


@Component({
  selector: 'app-retailer-add-notifications',
  templateUrl: './retailer-add-notifications.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddNotificationsComponent implements OnInit {
  @Input() retailerId: number;
  @Output() SaveData= new EventEmitter<any>();
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
  errorMsgs= inputValidations;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      orderEmail: ['', [Validators.email, Validators.maxLength(255), Validators.required]],
      shipEmail: ['', [Validators.maxLength(255), Validators.email, Validators.required]],
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
        .then(res => {
          // todo correct response
          // this.retailerId = res._body;
          // this.Obj.retailerId = this.retailerId;
          // this.ngbTabSet.select('tab-Payment');
          // this.router.navigateByUrl('/retailer-list');
          this.SaveData.emit('tab-Notifications');
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Saved successfully',
            show: true
          };
          this.saveLoader = false;
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

        });
    }
    return false;
  }


  readForm() {
    this.Obj = new RetailerNotification();
    this.Obj.retailerId = this.retailerId;
    this.Obj.orderEmail = this.fG1.value.orderEmail;
    this.Obj.shipEmail = this.fG1.value.shipEmail;
    return this.Obj;
  }

  getData(retailerId) {
    // this.retialerService
    //   .profileInfoGet(this.retailerId)
    //   .subscribe((res) => {
    //     this.Obj = res;
    //     this.fG1.patchValue({

    //       orderEmail: this.Obj.orderEmail,
    //       shipEmail: this.Obj.shipEmail,
    //   });
  }


}

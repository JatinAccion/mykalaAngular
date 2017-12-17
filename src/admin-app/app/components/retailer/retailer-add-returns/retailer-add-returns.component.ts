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
import { inputValidations } from './messages';


@Component({
  selector: 'app-retailer-add-returns',
  templateUrl: './retailer-add-returns.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddReturnsComponent implements OnInit {
  @Input() retailerId: number;
  @Output() SaveData = new EventEmitter<any>();
  // #region declarations

  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  fG1 = new FormGroup({});
  step = 1;
  Obj: RetailerReturnPolicy;
  errorMsgs = inputValidations;
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
      returnPolicy: ['', [Validators.maxLength(500), Validators.pattern(environment.regex.textRegex), Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.retialerService
        .saveReturnPolicy(this.Obj)
        .then(res => {
          // todo correct response
          // this.retailerId = res._body;
          // this.Obj.retailerId = this.retailerId;
          // this.ngbTabSet.select('tab-Payment');
          // this.router.navigateByUrl('/retailer-list');
          this.SaveData.emit('tab-Return');
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
    this.Obj = new RetailerReturnPolicy();
    this.Obj.retailerId = this.retailerId;
    this.Obj.returnPolicy = this.fG1.value.returnPolicy;
    return this.Obj;
  }

  getData(retailerId) {
    // this.retialerService
    //   .profileInfoGet(this.retailerId)
    //   .subscribe((res) => {
    //     this.Obj = res;
    //     this.fG1.patchValue({

    //       returnPolicy: this.Obj.returnPolicy,
    //       shipEmail: this.Obj.shipEmail,
    //   });
  }


}

// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RetailerReturnPolicy } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetialerService } from '../retialer.service';
import { inputValidations } from './messages';
import { CoreService } from '../../../services/core.service';


@Component({
  selector: 'app-retailer-add-returns',
  templateUrl: './retailer-add-returns.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddReturnsComponent implements OnInit {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() returnData: RetailerReturnPolicy;
  @Output() returnDataChange = new EventEmitter<RetailerReturnPolicy>();
  // #region declarations

  fG1 = new FormGroup({});
  step = 1;
  Obj: RetailerReturnPolicy;
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
    this.Obj = new RetailerReturnPolicy();
    this.setFormValidators();
    if (this.retailerId) {
      this.getData(this.retailerId);
    }
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      returnPolicy: [this.returnData.returnPolicy, [Validators.maxLength(500), Validators.pattern(environment.regex.textRegex), Validators.required]],
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
        .subscribe(res => {
          this.SaveData.emit('tab-Return');
          this.saveLoader = false;
          this.core.message.success('Return Policy Info Saved');
          return true;
        }, err => this.core.message.success('Not able to Save'), () => this.saveLoader = false);

    }
    return false;
  }


  readForm() {
    this.Obj = this.Obj || new RetailerReturnPolicy();
    this.Obj.retailerId = this.retailerId;
    this.Obj.returnPolicy = this.fG1.controls.returnPolicy.value;
    return this.Obj;
  }

  getData(retailerId) {
    this.retialerService
      .returnPolicyGet(this.retailerId)
      .subscribe((res: RetailerReturnPolicy) => {
        this.returnData = res;
        this.setFormValidators();
        this.Obj = new RetailerReturnPolicy(res);
      });
  }

}

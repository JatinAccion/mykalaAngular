// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RetailerTax } from '../../../../../models/retailer';
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
  selector: 'app-retailer-add-tax',
  templateUrl: './retailer-add-tax.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddTaxComponent implements OnInit {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() taxData: RetailerTax;
  @Output() taxDataChange = new EventEmitter<RetailerTax>();
  // #region declarations

  fG1 = new FormGroup({});
  step = 1;
  Obj: RetailerTax;
  errorMsgs = inputValidations;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt,
    private core: CoreService
  ) {
    this.Obj = new RetailerTax();
  }
  ngOnInit() {
    this.Obj = new RetailerTax();
    this.setFormValidators();
    if (this.retailerId) {
      // this.getData(this.retailerId);
    }
  }

  setFormValidators() {

  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.retialerService
        .saveTax(this.Obj)
        .subscribe(res => {
          this.SaveData.emit('tab-Tax');
          this.saveLoader = false;
          this.core.message.success('Tax Nexus Info Saved');
          return true;
        }, err => this.core.message.success('Not able to Save'), () => this.saveLoader = false);

    }
    return false;
  }


  readForm() {
    this.Obj = this.Obj || new RetailerTax();
    this.Obj.retailerId = this.retailerId;
    // this.Obj.returnPolicy = this.fG1.controls.returnPolicy.value;
    return this.Obj;
  }

  getData(retailerId) {
    this.retialerService
      .taxGet(this.retailerId)
      .subscribe((res: RetailerTax) => {
        this.taxData = res;
        this.setFormValidators();
        this.Obj = new RetailerTax(res);
      });
  }

}

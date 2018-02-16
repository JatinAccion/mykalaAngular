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
import { MasterData, KeyValue } from '../../../../../models/masterData';


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
  saveLoader = false;
  states: MasterData;
  statesSelected = new Array<KeyValue<string, boolean>>();

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
    this.Obj = new RetailerTax();
  }
  ngOnInit() {
    this.getStates();
    this.Obj = new RetailerTax();
    this.setFormValidators();
    if (this.retailerId) {
      this.getData(this.retailerId);
    }
  }
  getStates() {
    this.retialerService.getStates().subscribe(p => {
      this.states = p;
      this.processStates();
    });
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
    this.Obj.states = this.statesSelected.filter(p => p.value).map(p => p.key);
    return this.Obj;
  }

  getData(retailerId) {
    this.retialerService
      .taxGet(this.retailerId)
      .subscribe((res: RetailerTax) => {
        this.taxData = res;
        this.setFormValidators();
        this.Obj = new RetailerTax(res);
        this.processStates();
      });
  }
  processStates(): any {
    this.statesSelected = new Array<KeyValue<string, boolean>>();
    if (this.states && this.states.values.length > 0) {
      if (this.Obj.taxNexusId && this.Obj.states.length > 0) {
        this.statesSelected = this.states.values.map(p => new KeyValue(p, this.Obj.states.indexOf(p) > -1));
      } else {
        this.statesSelected = this.states.values.map(p => new KeyValue(p, false));
      }
    }
  }
  getSelectedCount() { 
    return this.statesSelected.filter(p => p.value).length;
  }
}

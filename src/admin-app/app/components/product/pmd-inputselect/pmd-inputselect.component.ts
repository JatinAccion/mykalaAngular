// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Product, ProdAttr } from '../../../../../models/product';


@Component({
  selector: 'app-pmd-inputselect',
  templateUrl: './pmd-inputselect.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PmdInputSelectComponent implements OnInit {
  _data: any;
  // #region declarations

  @Input() prodAttr: ProdAttr;
  @Output() prodAttrChange = new EventEmitter<ProdAttr>();
  @Output() onDelete = new EventEmitter<ProdAttr>();
  @Input() set data(values: Array<any>) {
    this._data = this.cleanData(values);

  }
  get data(): Array<any> {
    return this._data;
  }
  showOtherEntry: boolean;
  otherValue: string;
  showIsNumeric: boolean;
  IsNumericValue: string;
  showSelect = true;
  cleanData(values: Array<any>): Array<any> {
    values = values[0].values;
    let displayOther = values[0].displayOther;
    if (values && values.removeAll(p => p === 'No Preference')) {

    }
    if (values && !values.firstOrDefault(p => p === 'Other')) {
      if (displayOther) values.add('Other');
    }
    return values;
  }

  // #endregion declaration
  constructor() { }
  ngOnInit() {
    this.checkOther();
    if (!this.data) {
      this.showSelect = false;
      this.showIsNumeric = false;
      this.showOtherEntry = true;
    }
    if (this.showOtherEntry) {
      this.otherValue = this.prodAttr.value;
      this.prodAttr.strValue = 'Other';
    }
    else if (this.prodAttr.Is_Numeric == 'Y') {
      this.showIsNumeric = true;
      this.showSelect = false;
    }
    else {
      this.otherValue = '';
    }
  }
  saveData() {
    this.checkOther();
    if (!this.showOtherEntry || this.otherValue) {
      /*this.prodAttr.value = this.showOtherEntry ? this.otherValue : this.prodAttr.strValue;*/
      if (this.showOtherEntry) this.prodAttr.value = this.otherValue;
      else if (this.showIsNumeric) this.prodAttr.value = this.IsNumericValue
      else this.prodAttr.value = this.prodAttr.strValue
      this.prodAttrChange.emit(this.prodAttr);
    }
  }
  delete() {
    this.onDelete.emit(this.prodAttr);
  }
  checkOther() {
    if (this.prodAttr.strValue) {
      this.showOtherEntry = this.prodAttr.strValue === 'Other';
      const itemFound = this.data && this.data.filter(p => p === this.prodAttr.strValue && p !== 'Other').length > 0;
      this.showOtherEntry = !itemFound;
    }
  }
  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
}

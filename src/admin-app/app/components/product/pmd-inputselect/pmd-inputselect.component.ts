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
  // #region declarations

  @Input() prodAttr: ProdAttr;
  @Output() prodAttrChange = new EventEmitter<ProdAttr>();
  @Output() onDelete = new EventEmitter<ProdAttr>();
  @Input() data: Array<string>;

  showOtherEntry: boolean;
  otherValue: string;
  showSelect = true;

  // #endregion declaration
  constructor() { }
  ngOnInit() {
    this.checkOther();
    if (!this.data) {
      this.showSelect = false;
      this.showOtherEntry = true;
    }
    this.otherValue = this.showOtherEntry ? this.prodAttr.strValue : '';
  }
  saveData() {
    this.checkOther();
    if (!this.showOtherEntry || this.otherValue) {
      this.prodAttr.value = this.showOtherEntry ? this.otherValue : this.prodAttr.strValue;
      this.prodAttrChange.emit(this.prodAttr);
    }
  }
  delete() {
    this.onDelete.emit(this.prodAttr);
  }
  checkOther() {
    this.showOtherEntry = this.prodAttr.strValue === 'Other';
    if (this.prodAttr.strValue && this.data && this.data.filter(p => p === this.prodAttr.strValue && p !== 'Other').length > 0) {
      this.showOtherEntry = false;
    }
  }
}

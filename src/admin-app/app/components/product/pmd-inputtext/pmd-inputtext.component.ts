// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Product, ProdAttr } from '../../../../../models/product';


@Component({
  selector: 'app-pmd-inputtext',
  templateUrl: './pmd-inputtext.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PmdInputTextComponent implements OnInit {
  // #region declarations

  @Input() prodAttr: ProdAttr;
  @Output() prodAttrChange = new EventEmitter<ProdAttr>();
  @Output() onDelete = new EventEmitter<ProdAttr>();


  // #endregion declaration
  constructor() { }
  ngOnInit() { }
  saveData() {
    this.prodAttr.value = this.prodAttr.strValue;
    this.prodAttrChange.emit(this.prodAttr);
  }
  delete() {
    this.onDelete.emit(this.prodAttr);
  }
}

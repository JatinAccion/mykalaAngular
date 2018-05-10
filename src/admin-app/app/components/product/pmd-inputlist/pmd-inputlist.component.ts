// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product, ProdAttr } from '../../../../../models/product';


@Component({
  selector: 'app-pmd-inputlist',
  templateUrl: './pmd-inputlist.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PmdInputListComponent implements OnInit {
  _prodAttr: any;
  // #region declarations
  listSize = 5;
  @Output() prodAttrChange = new EventEmitter<ProdAttr>();
  @Output() onDelete = new EventEmitter<ProdAttr>();
  @Input() set prodAttr(prodAttr: ProdAttr) {
    this._prodAttr = this.formatValues(prodAttr);
  }
  get prodAttr(): ProdAttr {
    return this._prodAttr;
  }
  formatValues(prodAttr: ProdAttr) {
    while (prodAttr.values.length < 5) {
      prodAttr.values.add('');
    }
    return prodAttr;
  }
  // #endregion declaration
  constructor() { }
  ngOnInit() { }
  saveData() {
    this.prodAttr.value = this.prodAttr.values;
    this.prodAttrChange.emit(this.prodAttr);
  }
  delete() {
    this.onDelete.emit(this.prodAttr);
  }
  deleteListItem(index) {
    this.prodAttr.values[index] = '';
    this.saveData();
  }
  addListItem() {
    this.prodAttr.values.push('');
  }
}

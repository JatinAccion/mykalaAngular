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
  values = new Array<ProdAttr>();
  get prodAttr(): ProdAttr {
    return this._prodAttr;
  }
  formatValues(prodAttr: ProdAttr) {
    if (!prodAttr.value) {
      prodAttr.value = new Array<string>();
    }
    while (prodAttr.value.length < 5) {
      prodAttr.value.push('');
    }
    this.values = prodAttr.value.map(p => new ProdAttr({ value: p }));
    return prodAttr;
  }
  // #endregion declaration
  constructor() { }
  ngOnInit() { }
  saveData() {
    this.prodAttr.value = this.values.map(p => p.value);
    this.prodAttrChange.emit(this.prodAttr);
  }
  delete() {
    this.onDelete.emit(this.prodAttr);
  }
  deleteListItem(index) {
    this.values[index].value = '';
    this.saveData();
  }
  addListItem() {
    this.prodAttr.value.push('');
  }
}

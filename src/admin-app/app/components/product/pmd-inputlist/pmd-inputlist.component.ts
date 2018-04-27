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
  // #region declarations

  @Input() prodAttr: ProdAttr;
  @Output() prodAttrChange = new EventEmitter<ProdAttr>();
  @Output() onDelete = new EventEmitter<ProdAttr>();


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
  deleteListItem(listItem) {
    delete this.prodAttr.values[this.prodAttr.values.indexOf(listItem)];
  }
  addListItem() {
    this.prodAttr.values.push('');
  }
}

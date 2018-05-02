// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { Product, ProdAttr, ProductAttributesMasterData } from '../../../../../models/product';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';


@Component({
  selector: 'app-product-add-more',
  templateUrl: './product-add-more.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddMoreComponent implements OnInit {

  attributesMasterData: ProductAttributesMasterData;
  // #region declarations

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  @ViewChild('tabs') ngbTabSet: NgbTabset;

  step = 1;
  errorMsgs: any;
  saveLoader = true;
  attributes = new Array<ProdAttr>();
  // #endregion declaration
  constructor(
    private productService: ProductService,
    private core: CoreService
  ) {
  }
  async ngOnInit() {
    await this.getAttributesMasterData();
    this.attributes = this.product.getAttributesList_AttrType(this.attributesMasterData.attributes);
  }

  changeAttrValue(attr: ProdAttr) {
    this.product.attributes[attr.key] = attr.value;
  }
  deleteAttr(attr: ProdAttr) {
    delete this.product.attributes[attr.key];
    this.attributes = this.product.getAttributesList_AttrType(this.attributesMasterData.attributes);
  }


  saveData() {
    this.saveLoader = true;
    this.productService
      .saveProduct(this.product).subscribe(res => {
        this.core.message.success(userMessages.success);
        this.saveLoader = false;
      }, err => {
        console.log(err);
        this.core.message.error(userMessages.error);
        this.saveLoader = false;
      });
  }
  getAttributesMasterData() {
    return this.productService.getAttributesMasterData(this.product.productPlaceName, this.product.productCategoryName, this.product.productSubCategoryName).toPromise().then(p => {
      this.attributesMasterData = p;
    });
  }
  getAttrbuteKeyMasterData(attr: ProdAttr) {
    if (attr && this.attributesMasterData && this.attributesMasterData.attributes[attr.key] != null) {
      return this.attributesMasterData.attributes[attr.key];
    }
  }
}

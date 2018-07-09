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
import { Router } from '@angular/router';


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
    private productService: ProductService, private router: Router,
    private core: CoreService
  ) {
  }
  async ngOnInit() {
    await this.getAttributesMasterData();
    this.attributes = this.product.getAttributesList_AttrType(this.attributesMasterData.attributes);
  }

  changeAttrValue(attr: ProdAttr) {
    this.product.attributes = this.product.attributes || new Map<string, string>();
    this.product.attributeArray = this.product.attributeArray || new Array<ProdAttr>();
    this.product.attributes[attr.key] = attr.value;
    const existingAttr = this.product.attributeArray.firstOrDefault(p => p.key === attr.key);
    if (existingAttr) {
      existingAttr.value = attr.value;
    } else {
      this.product.attributeArray.push(attr);
    }
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
        this.router.navigateByUrl('/product-list');
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
    if (attr && this.attributesMasterData) {
      const ele = this.attributesMasterData.attributes.firstOrDefault(p => p.key === attr.key);
      if (ele) {
        return [{ values: ele.values, displayOther: ele.Display_Other === "Y" }];
        // return ele.values;
      }
    }
  }
}

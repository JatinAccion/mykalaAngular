// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { ProductService } from '../product.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { Product } from '../../../../../models/Product';
import { Promise } from 'q';
import { RetialerService } from '../../retailer/retialer.service';
import { Retailer } from '../../../../../models/retailer';
import { inputValidations } from './messages';
// #endregion imports


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddComponent implements OnInit {
  retailers: Array<Retailer>;
  retailer: Retailer;
  reatileDummy: Retailer;
  fG1: FormGroup;
  saveloader: boolean;
  // #region declarations
  productId = '';
  product = new Product();
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = { id: 1, type: 'success', message: '', show: false };
  errorMsgs = inputValidations;
  status = {
    category: false,
    basic: false,
    pricing: false,
    delivery: false,
    images: false,
    more: false
  };
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private productService: ProductService,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
    //this.productId = route.snapshot.params['id'];
    this.retailers = new Array<Retailer>();
  }
  ngOnInit() {
    this.setActiveTab({ nextId: 'tab-category' });
    this.setFormValidators();
    this.getRetailersData();
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      retailer: [null, [Validators.required]],
    });
  }
  getRetailersData() {
    this.retialerService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.retailers.push(new Retailer(obj)); });
    });
  }
  selectSeller(e) {
    if (this.retailer) {
      this.product.retailerId = this.retailer.retailerId;
      this.product.retailerName = this.retailer.businessName;
    } else {
      this.product.retailerId = null;
      this.product.retailerName = '';
    }
  }
  setActiveTab(event) {
    // if (!this.productId && event.nextId !== 'tab-category') { event.preventDefault(); return; }
    if (event.nextId === 'tab-delivery') {
      this.validatorExt.validateAllFormFields(this.fG1);
      if (this.fG1.invalid) {
        event.preventDefault(); return;
      }
    }
    if (!this.productId) {
      switch (event.nextId) {
        case 'tab-images':
        case 'tab-more': // event.preventDefault();
          break;
      }
    }
  }
  saveProductAndShowNext(prevTab) {
    if (prevTab === 'tab-delivery') {
      this.saveProduct().then(res => {
        this.showNextTab(prevTab);
      });
    }
  }
  showNextTab(prevTab) {
    switch (prevTab) {
      case 'tab-category': this.status.category = true; this.ngbTabSet.select('tab-basic'); break;
      case 'tab-basic': this.status.basic = true; this.ngbTabSet.select('tab-pricing'); break;
      case 'tab-pricing': this.status.pricing = true; this.ngbTabSet.select('tab-delivery'); break;
      case 'tab-delivery': this.status.delivery = true; this.ngbTabSet.select('tab-images'); break;

      case 'tab-images': if (this.productId) {
        this.status.images = true; this.ngbTabSet.select('tab-more');
      } break;
      case 'tab-more': if (this.productId) {
        this.status.more = true;
        this.router.navigateByUrl('/product-list');
        break;
      }
    }
  }
  saveProduct(): Promise<any> {
    this.saveloader = true;
    return Promise(resolve => {
      this.productService
        .saveProduct(this.product)
        .then(res => {
          this.productId = res.json().kalaUniqueId;
          this.product.kalaUniqueId = this.productId;
          this.alert = { id: 1, type: 'success', message: 'Saved successfully', show: true };
          this.saveloader = false;
          resolve(this.productId);
          return true;
        })
        .catch(err => {
          console.log(err);
          this.alert = { id: 1, type: 'danger', message: 'Not able to Save', show: true };
          this.saveloader = false;
          return false;
        });
    });
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

}

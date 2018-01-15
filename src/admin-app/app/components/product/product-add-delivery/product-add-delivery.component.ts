// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { inputValidations } from './messages';
import { Product } from '../../../../../models/Product';
// #endregion imports

@Component({
  selector: 'app-product-add-delivery',
  templateUrl: './product-add-delivery.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddDeliveryComponent implements OnInit {
  // #region declarations

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  shippingProfiles: nameValue[];
  productId = 1;
  alert: IAlert = { id: 1, type: 'success', message: '', show: false };
  fG1 = new FormGroup({});
  step = 1;
  errorMsgs = inputValidations;
  saveLoader = false;
  getDataloader = false;
  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
    this.getDataloader = false;
    this.productService.getShippingProfiles(this.product.retailerId).subscribe(res => {
      this.shippingProfiles = res;
      this.getDataloader = false;
    });
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      shippingId: ['', [Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    // if (!this.fG1.valid) {
   // } else {
      this.saveLoader = true;
      this.productChange.emit(this.product);
      this.SaveData.emit('tab-delivery');
    // }
    return false;
  }


  readForm() {
    return this.product;
  }

  getData(retailerId) { }
}

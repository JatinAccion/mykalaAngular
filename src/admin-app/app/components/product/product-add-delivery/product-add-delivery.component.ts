// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { inputValidations, userMessages } from './messages';
import { Product } from '../../../../../models/Product';
import { CoreService } from '../../../services/core.service';
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
  productId = '';
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
    public validatorExt: ValidatorExt,
    private core: CoreService
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
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.readForm();
      this.saveLoader = true;
      this.productService
        .saveProduct(this.product).subscribe(res => {
          this.productId = res.kalaUniqueId;
          this.product.kalaUniqueId = this.productId;
          this.core.message.success(userMessages.success);
          this.saveLoader = false;
          // this.core.setUrl('product-add/' + this.productId);
          this.productChange.emit(this.product);
          this.SaveData.emit('tab-delivery');
        }, err => {
          console.log(err);
          this.core.message.error(userMessages.error);

          this.saveLoader = false;
        });
    }
  }


  readForm() {
    if (this.product && this.product.shipProfileId && this.shippingProfiles.filter(p => p.name === this.product.shipProfileId).length > 0) {
      this.product.shipProfileName = this.shippingProfiles.filter(p => p.name === this.product.shipProfileId)[0].value;
    }
    return this.product;
  }

  getData(retailerId) { }
}

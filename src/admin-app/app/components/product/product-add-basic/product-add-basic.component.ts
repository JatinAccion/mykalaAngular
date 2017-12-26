// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { Product } from '../../../../../models/Product';
import { inputValidations } from './messages';


@Component({
  selector: 'app-product-add-basic',
  templateUrl: './product-add-basic.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddBasicComponent implements OnInit {
  // #region declarations
  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  productId = 1;
  errorMsgs = inputValidations;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  fG1 = new FormGroup({});
  step = 1;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      productName: ['', [Validators.maxLength(255), Validators.required]],
      brandName: ['', [Validators.maxLength(255), Validators.required]],
      productSkuCode: ['', [Validators.maxLength(255), Validators.required]],
      productUpcCode: ['', [Validators.maxLength(255), Validators.required]],
      productDescription: ['', [Validators.maxLength(255), Validators.required]],
      quantity: ['', [Validators.maxLength(255), Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.productChange.emit(this.product);
      this.SaveData.emit('tab-basic');
    }
    return false;
  }


  readForm() {
    return this.product;
  }

  getData(retailerId) { }


}

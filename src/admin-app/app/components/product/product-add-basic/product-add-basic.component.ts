// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { Product } from '../../../../../models/product';
import { inputValidations } from './messages';
import { CoreService } from '../../../services/core.service';


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
  fG1 = new FormGroup({});
  step = 1;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
    if (!this.product.dimensionunit) {
      this.product.dimensionunit = 'inches';
    }
    if (!this.product.shippingWeightUnit) {
      this.product.shippingWeightUnit = 'lbs';
    }
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      productName: ['', [Validators.maxLength(255), Validators.required]],
      // brandName: ['', [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      productSkuCode: ['', [Validators.pattern(environment.regex.textRegex), Validators.maxLength(255), Validators.required]],
      productUpcCode: ['', [Validators.pattern(environment.regex.numberRegex), Validators.maxLength(255), Validators.required]],
      productDescription: ['', [Validators.maxLength(1000), Validators.required]],
      quantity: ['', [Validators.pattern(environment.regex.numberValueRegex), Validators.min(0), Validators.required]],
      weight: ['', [Validators.pattern(environment.regex.numberValueRegex), Validators.min(0), Validators.required]],
      weightunit: ['', [Validators.pattern(environment.regex.textRegex), Validators.min(0), Validators.required]],
      dimensionunit: ['', [Validators.pattern(environment.regex.textRegex), Validators.min(0), Validators.required]],
      length: ['', [Validators.pattern(environment.regex.numberValueRegex), Validators.min(0), Validators.required]],
      height: ['', [Validators.pattern(environment.regex.numberValueRegex), Validators.min(0), Validators.required]],
      width: ['', [Validators.pattern(environment.regex.numberValueRegex), Validators.min(0), Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      // this.core.showSpinner();
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

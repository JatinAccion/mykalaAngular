// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { inputValidations } from './messages';
import { Product } from '../../../../../models/product';
// #endregion imports

@Component({
  selector: 'app-product-add-pricing',
  templateUrl: './product-add-pricing.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddPricingComponent implements OnInit {
  // #region declarations
  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  productId = 1;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  fG1 = new FormGroup({});
  step = 1;
  errorMsgs = inputValidations;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: ProductService,
    public validatorExt: ValidatorExt
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
      kalaPrice: [{ value: '2.00', step: '0.01' }, [Validators.required, Validators.min(0)]],
      retailPrice: [{ value: '0.00', step: '0.01' }, [Validators.required, Validators.min(0)]],
      lowestPrice: [{ value: '0.00', step: '0.01' }, [Validators.required, Validators.min(0)]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.productChange.emit(this.product);
      this.SaveData.emit('tab-pricing');
    }
    return false;
  }


  readForm() {
    return this.product;
  }

  getData(retailerId) { }


}

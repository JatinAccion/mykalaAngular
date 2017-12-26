// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { Product } from '../../../../../models/Product';


@Component({
  selector: 'app-product-add-more',
  templateUrl: './product-add-more.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddMoreComponent implements OnInit {
  // #region declarations

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  fG1 = new FormGroup({});
  step = 1;
  errorMsgs: any;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: ProductService,
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
      orderEmail: ['', [Validators.email, Validators.maxLength(255), Validators.required]],
      shipEmail: ['', [Validators.maxLength(255), Validators.email, Validators.required]],
    });

    this.errorMsgs = {
      'orderEmail': { required: 'Please enter order email ', error: 'Please enter valid order email' },
      'shipEmail': { required: 'Please enter shipping email', error: 'Please enter valid shipping email' },
    };
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.productChange.emit(this.product);
      this.SaveData.emit('tab-delivery');
    }
    return false;
  }


  readForm() {
    return this.product;
  }

  getData(retailerId) { }


}

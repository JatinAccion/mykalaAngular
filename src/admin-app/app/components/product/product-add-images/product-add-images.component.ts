// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
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
  selector: 'app-product-add-images',
  templateUrl: './product-add-images.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddImagesComponent implements OnInit {
  // #region declarations

  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  uploadFile: any;
  productImages = new Array<any>();

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
      productImage: ['', [Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
      this.productService.saveProductImages({ kalaUniqueId: this.product.kalaUniqueId, images: this.productImages }).subscribe(e => console.log(e));
      // this.productService.saveProductImages({ kalaUniqueId: this.product.kalaUniqueId, images: this.productImages[0] })
      // this.productService.saveProductImages({  kalaUniqueId: this.product.kalaUniqueId, images: this.productImages  })
      //   .then(res => {
      //   return true;
      // })
      //   .catch(err => {
      //     console.log(err);

      //     return false;
      //   });
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

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  }

  fileChangeEvent(fileInput: any, profileInfo) {
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const file = fileInput.target.files[i];
        this.productImages.push(file);
      }
    }
  }
}

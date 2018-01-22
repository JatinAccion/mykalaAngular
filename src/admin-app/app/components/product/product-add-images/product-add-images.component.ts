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
import { CoreService } from '../../../services/core.service';


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
  mainImage = {};
  uploadedImages = new Array<any>();
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
    private validatorExt: ValidatorExt,
    private core: CoreService
  ) {
  }
  ngOnInit() {
    // this.setFormValidators();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  // setFormValidators() {
  //   this.fG1 = this.formBuilder.group({
  //     productImage: ['', [Validators.required]],
  //   });
  // }
  saveData() {
    this.uploadAll(this.productImages);
  }
  uploadAll(productImages) {
    this.saveLoader = true;
    let mainImage: any;
    const otherImages = new Array<any>();
    productImages.forEach(element => {
      if (element.mainImage) {
        mainImage = element;
      } else {
        otherImages.push(element);
      }
    });
    this.productService.saveProductImages({ kalaUniqueId: this.product.kalaUniqueId, images: otherImages.map(p => p.file), mainImage: mainImage.file }).subscribe(e => {
      if (e.type == 4) {
        console.log(e);
        this.core.message.success('Images Uploaded');
        const tmpProduct = JSON.parse(e.body);
        if (tmpProduct.productImages.length > 0) {
          for (let index = 0; index < tmpProduct.productImages.length; index++) {
            if (tmpProduct.productImages[index].mainImage) {
              this.mainImage = environment.s3 + tmpProduct.productImages[index].imageUrl;
            }
            this.uploadedImages.push(environment.s3 + tmpProduct.productImages[index].imageUrl);
          }
        }
      }
      this.saveLoader = false;
      console.log(e);
    });
  }
  remove(item) {
    this.productImages.splice(this.productImages.indexOf(item), 1);
  }
  removeAll() {
    delete this.productImages;
    this.productImages = new Array<any>();
  }
  readForm() {
    return this.product;
  }
  upload(item) {
    this.uploadAll([item]);
  }
  getData(retailerId) { }

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  }

  onSelectionChange(item) {
    this.productImages.forEach(p => {
      p.mainImage = false;
    });
    item.mainImage = true;
  }

  fileChangeEvent(fileInput: any) {
    this.productImages = this.productImages || new Array<any>();
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const file = fileInput.target.files[i];
        this.productImages.push({ file: file, mainImage: false });
      }
    }
  }
}

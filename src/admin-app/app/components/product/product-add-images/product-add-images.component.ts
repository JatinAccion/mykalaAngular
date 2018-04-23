// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { ProductService } from '../product.service';
import { Product, ProductImage } from '../../../../../models/product';
import { inputValidations, userMessages } from './messages';
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
  mainImage: ProductImage;
  otherImages = new Array<ProductImage>();
  fG1 = new FormGroup({});
  step = 1;
  errorMsgs = inputValidations;
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
  }

  saveData() {
    this.uploadAll(this.productImages);
  }
  uploadAll(productImages: any[]) {
    this.saveLoader = true;
    let mainImage: any;
    const otherImages = new Array<any>();
    productImages.forEach(element => {
      if (element.mainImage) {
        mainImage = element.file;
      } else {
        otherImages.push(element.file);
      }
    });
    this.productService.saveProductImages({ kalaUniqueId: this.product.kalaUniqueId, images: otherImages, mainImage: mainImage }).subscribe(e => {
      if (e.type === 4) {
        this.core.message.success(userMessages.success);
        this.product = new Product(JSON.parse(e.body));
        this.productChange.emit(this.product);
        if (productImages.length > 1) {
          this.productImages = new Array<any>();
        }
        this.productImages.splice(this.productImages.indexOf(productImages[0]), 1);

      }
      this.saveLoader = false;
    });
  }

  remove(item) {
    this.productImages.splice(this.productImages.indexOf(item), 1);
  }
  removeAll() {
    delete this.productImages;
    this.productImages = new Array<any>();
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
  deleteImage(id) {
    console.log(id);
    this.productService.deleteImage(this.product.kalaUniqueId, id).subscribe(p => {
      this.core.message.success(userMessages.imageDeleted);
      this.product = p;
      this.productChange.emit(this.product);
    });
  }
  markasMainImage(id) {
    console.log(id);
    this.productService.markasMainImage(this.product.kalaUniqueId, id).subscribe(p => {
      this.core.message.success(userMessages.markasMainImage);
      this.product = p;
      this.productChange.emit(this.product);
    });
  }
}

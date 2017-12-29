// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Retailer, RetailerNotification } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { ProductService } from '../product.service';
import { Product } from '../../../../../models/Product';
import { inputValidations } from './messages';
import { ProductPlace, ProductCategory, ProductSubCategory, ProductType } from '../../../../../models/product-info';
// #endregion imports

@Component({
  selector: 'app-product-add-category',
  templateUrl: './product-add-category.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddCategoryComponent implements OnInit {
  // #region declarations
  @Input() product: Product;
  @Output() productChange = new EventEmitter<Product>();
  @Output() SaveData = new EventEmitter<any>();
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  places = new Array<ProductPlace>();
  categories = new Array<ProductCategory>();
  subCategories = new Array<ProductSubCategory>();
  productTypes = new Array<ProductType>();
  productPlace = new ProductPlace();
  productCategory = new ProductCategory();
  productSubCategory = new ProductSubCategory();
  productType = new ProductType();
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
    this.getPlaces();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      productPlaceName: ['', [Validators.required]],
      productCategoryName: ['', [Validators.required]],
      productSubCategoryName: ['', [Validators.required]],
      productTypeName: ['', [Validators.required]],
    });
  }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
    } else {
      this.saveLoader = true;
      this.productChange.emit(this.product);
      this.SaveData.emit('tab-category');
    }
    return false;
  }


  readForm() {
    return this.product;
  }

  getData(retailerId) {

  }
  getPlaces() {
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res;
    });
  }

  placeChanged(event) {
    this.product.productPlaceName = this.productPlace.PlaceName;
    this.categories = new Array<ProductCategory>();
    this.subCategories = new Array<ProductSubCategory>();
    this.productTypes = new Array<ProductType>();
    this.productCategory = new ProductCategory();
    this.productSubCategory = new ProductSubCategory();
    this.productType = new ProductType();
    this.product.productCategoryName = '';
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.productService.getProductCategories([this.productPlace.PlaceId]).subscribe(res => {
      this.categories = res;
    });
  }
  categoryChanged(event) {
    this.product.productCategoryName = this.productCategory.CategoryName;
    this.subCategories = new Array<ProductSubCategory>();
    this.productTypes = new Array<ProductType>();
    this.productSubCategory = new ProductSubCategory();
    this.productType = new ProductType();
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.productService.getProductSubCategories([this.productCategory.CategoryId]).subscribe(res => {
      this.subCategories = res;
    });
  }
  subCategoryChanged(event) {
    this.product.productSubCategoryName = this.productSubCategory.SubCategoryName;
    this.productTypes = new Array<ProductType>();
    this.productType = new ProductType();
    this.product.productTypeName = '';
    this.productService.getProductTypes([this.productSubCategory.SubCategoryId]).subscribe(res => {
      this.productTypes = res;
    });
  }
  typeChanged(event) {
    this.product.productTypeName = this.productType.TypeName;
  }

}

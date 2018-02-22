// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output, OnChanges } from '@angular/core';
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
export class ProductAddCategoryComponent implements OnInit, OnChanges {
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
  // productPlace: ProductPlace;
  // productCategory: ProductCategory;
  // productSubCategory: ProductSubCategory;
  // productType: ProductType;
  productPlaceDummy: ProductPlace;
  productCategoryDummy: ProductCategory;
  productSubCategoryDummy: ProductSubCategory;
  productTypeDummy: ProductType;
  fG1 = new FormGroup({});
  step = 1;
  errorMsgs = inputValidations;
  saveLoader = true;

  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.setFormValidators();
    if (this.product.productPlaceName) {
      this.setProductData();
    } else {
      this.getPlaces();
    }
  }
  ngOnChanges() {
    this.setProductData();
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      productPlaceName: [null, [Validators.required]],
      productCategoryName: [null, [Validators.required]],
      productSubCategoryName: [null, [Validators.required]],
      productTypeName: [null, [Validators.required]],
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
  setProductData() {
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res;
      if (this.product && this.product.productPlaceName && this.places && this.places.filter(p => p.PlaceName === this.product.productPlaceName).length > 0) {
        this.product.productPlace = this.places.filter(p => p.PlaceName === this.product.productPlaceName)[0];
        if (this.product.productPlace && this.product.productPlace.PlaceId) {
          this.productService.getProductCategories([this.product.productPlace.PlaceId]).subscribe(catres => {
            this.categories = catres;
            if (this.product && this.product.productCategoryName && this.categories && this.categories.filter(p => p.CategoryName === this.product.productCategoryName).length > 0) {
              this.product.productCategory = this.categories.filter(p => p.CategoryName === this.product.productCategoryName)[0];
              if (this.product.productCategory && this.product.productCategory.CategoryId) {
                this.productService.getProductSubCategories([this.product.productCategory.CategoryId]).subscribe(subres => {
                  this.subCategories = subres;
                  if (this.product && this.product.productSubCategoryName && this.subCategories && this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName).length > 0) {
                    this.product.productSubCategory = this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName)[0];
                    this.getTypes();
                  }
                });
              }
            }
          });
        }
      }
    });
  }

  readForm() {
    return this.product;
  }

  getData(retailerId) {

  }
  getPlaces() {
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res;
      this.setPlace();
    });
  }
  setPlace() {

  }
  placeChanged(event) {
    this.product.productPlaceName = this.product.productPlace.PlaceName;
    this.categories = new Array<ProductCategory>();
    this.subCategories = new Array<ProductSubCategory>();
    this.productTypes = new Array<ProductType>();
    delete this.product.productCategory;
    delete this.product.productSubCategory;
    delete this.product.productType;
    this.product.productCategoryName = '';
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.getCategories();
  }
  getCategories() {
    if (this.product.productPlace && this.product.productPlace.PlaceId) {
      this.productService.getProductCategories([this.product.productPlace.PlaceId]).subscribe(res => {
        this.categories = res;
        this.setCategory();
      });
    }
  }
  setCategory() {
    // if (this.product && this.product.productCategoryName && this.categories && this.categories.filter(p => p.CategoryName === this.product.productCategoryName).length > 0) {
    //   this.product.productCategory = this.categories.filter(p => p.CategoryName === this.product.productCategoryName)[0];
    //   this.getSubCategories();
    //   // this.setFormValidators();
    // }
  }
  categoryChanged(event) {
    this.product.productCategoryName = this.product.productCategory.CategoryName;
    this.subCategories = new Array<ProductSubCategory>();
    this.productTypes = new Array<ProductType>();
    delete this.product.productSubCategory;
    delete this.product.productType;
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.getSubCategories();
  }
  getSubCategories() {
    if (this.product.productCategory && this.product.productCategory.CategoryId) {
      this.productService.getProductSubCategories([this.product.productCategory.CategoryId]).subscribe(res => {
        this.subCategories = res;
        this.setSubCategory();
      });
    }
  }
  setSubCategory() {
    // if (this.product && this.product.productSubCategoryName && this.subCategories && this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName).length > 0) {
    //   this.product.productSubCategory = this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName)[0];
    //   this.getTypes();
    //   // this.setFormValidators();
    // }
  }
  subCategoryChanged(event) {
    this.product.productSubCategoryName = this.product.productSubCategory.SubCategoryName;
    this.productTypes = new Array<ProductType>();
    delete this.product.productType;
    this.product.productTypeName = '';
    this.getTypes();
  }
  getTypes() {
    if (this.product.productSubCategory && this.product.productSubCategory.SubCategoryId) {
      this.productService.getProductTypes([this.product.productSubCategory.SubCategoryId]).subscribe(res => {
        this.productTypes = res;
        if (res.length === 0) {
          this.fG1.controls.productTypeName.clearValidators();
        } else {
          this.fG1.controls.productTypeName.setValidators([Validators.required]);
        }
        this.fG1.controls.productTypeName.updateValueAndValidity();
        this.setType();
        // this.setFormValidators();
      });
    }
  }
  setType() {
    if (this.product && this.product.productTypeName && this.productTypes && this.productTypes.filter(p => p.TypeName === this.product.productTypeName).length > 0) {
      this.product.productType = this.productTypes.filter(p => p.TypeName === this.product.productTypeName)[0];
    }
  }
  typeChanged(event) {
    this.product.productTypeName = this.product.productType ? this.product.productType.TypeName : '';
  }
}

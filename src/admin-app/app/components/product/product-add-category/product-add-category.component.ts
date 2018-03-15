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
import { inputValidations, userMessages } from './messages';
import { ProductPlace, ProductCategory, ProductSubCategory, ProductType, ProductTypeLevels, ProductTypeLevel } from '../../../../../models/product-info';
import { CoreService } from '../../../services/core.service';
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
  levels = new ProductTypeLevels();
  // productPlace: ProductPlace;
  // productCategory: ProductCategory;
  // productSubCategory: ProductSubCategory;
  // productType: ProductType;
  productPlaceDummy: ProductPlace;
  productCategoryDummy: ProductCategory;
  productSubCategoryDummy: ProductSubCategory;
  productTypeDummy: ProductType;

  step = 1;
  inputValidations = inputValidations;
  saveLoader = true;
  typesLoading = false;
  required = {
    productPlaceName: false,
    productCategoryName: false,
    productSubCategoryName: false,
    productTypeName: false,
    taxCode: false
  };
  // #endregion declaration
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public validatorExt: ValidatorExt,
    private core: CoreService
  ) {
  }
  ngOnInit() {
    if (this.product.productPlaceName) {
      this.setProductData();
    } else {
      this.getPlaces();
    }
  }
  ngOnChanges() {
    this.setProductData();
  }
  saveData() {
    this.readForm();
    this.required.productPlaceName = this.product.productPlaceName === '';
    this.required.productCategoryName = this.product.productCategoryName === '';
    this.required.productSubCategoryName = this.product.productSubCategoryName === '';
    this.required.productTypeName = this.product.productTypeName === '';
    this.required.taxCode = this.product.taxCode === '';
    if (this.required.productPlaceName || this.required.productCategoryName || this.required.productSubCategoryName
      // || this.required.productTypeName
      // || this.required.taxCode
    ) {
      this.core.message.info(userMessages.requiredFeilds);
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
                    this.getTypes(this.product.productSubCategory.SubCategoryId);
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

  getData(retailerId) { }
  getPlaces() {
    this.typesLoading = true;
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res;
      this.typesLoading = false;
    });
  }
  placeChanged(event) {
    this.product.productPlaceName = this.product.productPlace.PlaceName;
    this.categories = new Array<ProductCategory>();
    this.subCategories = new Array<ProductSubCategory>();
    this.levels = new ProductTypeLevels();

    delete this.product.productCategory;
    delete this.product.productSubCategory;
    delete this.product.productType;
    this.product.productCategoryName = '';
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.product.taxCode = '';
    this.getCategories();
  }
  getCategories() {
    if (this.product.productPlace && this.product.productPlace.PlaceId) {
      this.typesLoading = true;
      this.productService.getProductCategories([this.product.productPlace.PlaceId]).subscribe(res => {
        this.categories = res;
        this.typesLoading = false;
      });
    }
  }
  categoryChanged(event) {
    this.product.productCategoryName = this.product.productCategory.CategoryName;
    this.subCategories = new Array<ProductSubCategory>();
    this.levels = new ProductTypeLevels();
    delete this.product.productSubCategory;
    delete this.product.productType;
    this.product.productSubCategoryName = '';
    this.product.productTypeName = '';
    this.product.taxCode = '';
    this.getSubCategories();
  }
  getSubCategories() {
    if (this.product.productCategory && this.product.productCategory.CategoryId) {
      this.productService.getProductSubCategories([this.product.productCategory.CategoryId]).subscribe(res => {
        this.subCategories = res;
      });
    }
  }
  subCategoryChanged(event) {
    delete this.product.productType;
    this.product.productTypeName = '';
    this.product.taxCode = '';
    this.product.productSubCategoryName = '';
    if (this.product.productSubCategory) {
      this.product.productSubCategoryName = this.product.productSubCategory.SubCategoryName;
      if (this.product.productSubCategory.taxCode) {
        this.product.taxCode = this.product.productSubCategory.taxCode;
      }
      this.getTypes(this.product.productSubCategory.SubCategoryId);
    }
    this.levels = new ProductTypeLevels();
  }
  getTypes(parentId) {
    if (parentId) {
      this.typesLoading = true;
      this.productService.getProductTypes([parentId]).subscribe(res => {
        this.productTypes = res;
        this.typesLoading = false;
        if (res.length > 0) {
          const newLevel = new ProductTypeLevel({ levelOptions: res, levelName: 'level' + this.levels.levels.length });
          this.levels.levels.push(newLevel);
        }
        // if (res.length === 0) {
        //   this.fG1.controls.productTypeName.clearValidators();
        // } else {
        //   this.fG1.controls.productTypeName.setValidators([Validators.required]);
        // }
        // this.fG1.controls.productTypeName.updateValueAndValidity();
        // this.setType();
        // this.setFormValidators();
      });
    }
  }
  setType() {
    if (this.product && this.product.productTypeName && this.productTypes && this.productTypes.filter(p => p.TypeName === this.product.productTypeName).length > 0) {
      this.product.productType = this.productTypes.filter(p => p.TypeName === this.product.productTypeName)[0];
    }
  }
  spliceLevels(parentId) {
    if (this.levels.levels.length > 0 && this.levels.levels.filter(p => p.level.TypeId === parentId).length > 0) {
      const existingLevel = this.levels.levels.filter(p => p.level.TypeId === parentId)[0];
      const levelIndex = this.levels.levels.indexOf(existingLevel);
      this.levels.levels.splice(levelIndex + 1);
    }
    this.product.taxCode = '';
  }
  levelChanged(event, level) {
    // this.product.productTypeName = this.product.productType ? this.product.productType.TypeName : '';
    this.spliceLevels(level.level.TypeId);
    if (level.level.nextLevelProductTypeStatus) {
      this.getTypes(level.level.TypeId);
    }
    if (level.level.taxCode) {
      this.product.taxCode = level.level.taxCode;
    }
  }
}

// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { ProductService } from '../product.service';
import { Product } from '../../../../../models/product';
import { inputValidations, userMessages } from './messages';
import { ProductPlace, ProductCategory, ProductSubCategory, ProductType, ProductTypeLevels, ProductTypeLevel, ProductLevel } from '../../../../../models/product-info';
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
  // levels = new ProductTypeLevels();
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
      // this.setProductData();
    } else {
      this.getPlaces();
      console.log(this.places.length);
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
    this.setProductHirerarchy();
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
  setProductHirerarchy() {
    this.product.productHierarchy = this.product.productTypeLevels.levels.map((p, i) => new ProductLevel({
      levelName: p.level.productTypeName,
      levelId: p.level.productTypeId,
      levelCount: i + 3
    }));
    this.product.productHierarchy.unshift(new ProductLevel({
      levelName: this.product.productSubCategoryName,
      levelId: this.product.productSubCategoryId,
      levelCount: 2
    }));
    this.product.productHierarchy.unshift(new ProductLevel({
      levelName: this.product.productCategoryName,
      levelId: this.product.productCategoryId,
      levelCount: 1
    }));
    this.product.productHierarchy.unshift(new ProductLevel({
      levelName: this.product.productPlaceName,
      levelId: this.product.productPlaceId,
      levelCount: 0
    }));
  }
  async setProductData() {
    if (this.product.productPlaceId && this.product.productCategoryId && this.product.productSubCategoryId) {
      this.productService.getProductPlaces().subscribe(res => {
        this.places = res;
      });
      this.productService.getProductCategories([this.product.productPlaceId]).subscribe(catres => {
        this.categories = catres;
        this.product.productCategory = this.categories.firstOrDefault(p => p.CategoryName === this.product.productCategoryName);
      });
      this.productService.getProductSubCategories([this.product.productCategoryId]).subscribe(subres => {
        this.subCategories = subres;
        this.product.productSubCategory = (this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName).push(this.productSubCategoryDummy))[0];
      });
      this.getTypes(this.product.productSubCategoryId);
    } else {
      this.productService.getProductPlaces().subscribe(res => {
        this.places = res;
        if (this.product && this.product.productPlaceName && this.places && this.places.filter(p => p.PlaceName === this.product.productPlaceName).length > 0) {
          this.product.productPlace = this.places.filter(p => p.PlaceName === this.product.productPlaceName)[0];
          if (this.product.productPlace && this.product.productPlace.PlaceId) {
            this.product.productPlaceId = this.product.productPlace.PlaceId;
            this.productService.getProductCategories([this.product.productPlace.PlaceId]).subscribe(catres => {
              this.categories = catres;
              if (this.product && this.product.productCategoryName && this.categories && this.categories.filter(p => p.CategoryName === this.product.productCategoryName).length > 0) {
                this.product.productCategory = this.categories.filter(p => p.CategoryName === this.product.productCategoryName)[0];
                if (this.product.productCategory && this.product.productCategory.CategoryId) {
                  this.product.productCategoryId = this.product.productCategory.CategoryId;
                  this.productService.getProductSubCategories([this.product.productCategory.CategoryId]).subscribe(subres => {
                    this.subCategories = subres;
                    if (this.product && this.product.productSubCategoryName && this.subCategories && this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName).length > 0) {
                      this.product.productSubCategory = this.subCategories.filter(p => p.SubCategoryName === this.product.productSubCategoryName)[0];
                      if (this.product.productSubCategory && this.product.productSubCategory.SubCategoryId) {
                        this.product.productSubCategoryId = this.product.productSubCategory.SubCategoryId;
                        // this.product.productTypeLevels = new ProductTypeLevels();
                        this.getTypes(this.product.productSubCategory.SubCategoryId);
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }

  readForm() {
    return this.product;
  }

  getData(retailerId) { }
  getPlaces() {
    this.typesLoading = true;
    this.productService.getProductPlaces().toPromise().then(res => {
      this.places = res;
      this.typesLoading = false;
    });
  }
  placeChanged(event) {
    this.product.productPlaceName = this.product.productPlace.PlaceName;
    this.product.productPlaceId = this.product.productPlace.PlaceId;
    this.categories = new Array<ProductCategory>();
    this.subCategories = new Array<ProductSubCategory>();
    this.product.productTypeLevels = new ProductTypeLevels();

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
    this.product.productCategoryId = this.product.productCategory.CategoryId;
    this.subCategories = new Array<ProductSubCategory>();
    this.product.productTypeLevels = new ProductTypeLevels();
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
    this.product.productTypeLevels = new ProductTypeLevels();
    if (this.product.productSubCategory) {
      this.product.productSubCategoryName = this.product.productSubCategory.SubCategoryName;
      this.product.productSubCategoryId = this.product.productSubCategory.SubCategoryId;
      if (this.product.productSubCategory.taxCode) {
        this.product.taxCode = this.product.productSubCategory.taxCode;
      }
      this.getTypes(this.product.productSubCategory.SubCategoryId);
    }
  }
  getProductTypes(id) {
    const level = this.product.productTypeLevels;
    if (level && level.levels && level.levels.filter(p => p.levelOptions && p.levelOptions.length > 0 && p.levelOptions[0].parentId === id).length > 0) {
      return level.levels.filter(p => p.levelOptions[0].parentId === id)[0].levelOptions;
    } else {
      return this.productService.getProductTypes([id]).toPromise().then(res => res);
    }
  }
  async getTypes(parentId) {
    if (parentId) {
      this.typesLoading = true;
      this.productTypes = await this.getProductTypes(parentId);
      this.typesLoading = false;
      const level = this.product.productTypeLevels;
      if (level && level.levels && level.levels.filter(p => p.levelOptions && p.levelOptions.length > 0 && p.levelOptions[0].parentId === parentId).length > 0) {
      } else {
        this.productService.getProductTypes([parentId]).subscribe(res => {
          if (res.length > 0) {
            const newLevel = new ProductTypeLevel({ levelOptions: res, levelName: ' ' });
            if (this.product.productTypeLevels && this.product.productTypeLevels.levels.length === 0) {
              newLevel.levelName = 'Product Type';
              if (res.filter(p => p.productTypeName === this.product.productTypeName).length > 0) {
                newLevel.level = res.filter(p => p.productTypeName === this.product.productTypeName)[0];
              }
            }
            this.product.productTypeLevels.levels.push(newLevel);
          }
          this.setProductHirerarchy();
          // if (res.length === 0) {
          //   this.fG1.controls.productTypeName.clearValidators();
          // } else {
          //   this.fG1.controls.productTypeName.setValidators([Validators.required]);
          // }
          // this.fG1.controls.productTypeName.updateValueAndValidity();
          this.setType();
          // this.setFormValidators();
        });
      }
    }
  }
  setType() {
    if (this.product && this.product.productTypeName && this.productTypes && this.productTypes.filter(p => p.productTypeName === this.product.productTypeName).length > 0) {
      this.product.productType = this.productTypes.filter(p => p.productTypeName === this.product.productTypeName)[0];

    }
  }
  spliceLevels(parentId) {
    if (this.product.productTypeLevels.levels.length > 0 && this.product.productTypeLevels.levels.filter(p => p.level.productTypeId === parentId).length > 0) {
      const existingLevel = this.product.productTypeLevels.levels.filter(p => p.level.productTypeId === parentId)[0];
      const levelIndex = this.product.productTypeLevels.levels.indexOf(existingLevel);
      this.product.productTypeLevels.levels.splice(levelIndex + 1);
    }
    this.product.taxCode = '';
  }
  levelChanged(event, level: ProductTypeLevel) {
    // this.product.productTypeName = this.product.productType ? this.product.productType.TypeName : '';
    this.setProductHirerarchy();
    if (level && level.level && level.level.productTypeId) {
      if (this.product.productSubCategoryId === level.level.parentId) {
        this.product.productTypeId = level.level.productTypeId;
        this.product.productTypeName = level.level.productTypeName;
      }
      this.spliceLevels(level.level.productTypeId);
    }
    if (level.level.nextLevelProductTypeStatus) {
      this.getTypes(level.level.productTypeId);
    }
    if (level.level.taxCode) {
      this.product.taxCode = level.level.taxCode;
    }
  }
}

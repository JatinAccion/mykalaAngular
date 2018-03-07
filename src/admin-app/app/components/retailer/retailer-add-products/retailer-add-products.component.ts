// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue, IdNameParent } from '../../../../../models/nameValue';

import { RetialerService } from '../retialer.service';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';
import { ProductService } from '../../product/product.service';
import { RetailerProductInfo, RetailerProductCategory, RetailerProductPlace, RetailerProductSubCategory, RetailerProductType } from '../../../../../models/retailer-product-info';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-retailer-add-products',
  templateUrl: './retailer-add-products.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddProductsComponent implements OnInit {
  @Input() retailerId: string;
  @Output() SaveData = new EventEmitter<any>();
  @Input() productData: RetailerProductInfo;
  @Output() productDataChange = new EventEmitter<RetailerProductInfo>();


  places = new Array<IdNameParent>();
  selectedPlaces = new Array<IdNameParent>();
  allCategories = new Array<IdNameParent>();
  categories = new Array<IdNameParent>();
  selectedCategories = new Array<IdNameParent>();
  allSubCategories = new Array<IdNameParent>();
  subCategories = new Array<IdNameParent>();
  selectedSubCategories = new Array<IdNameParent>();
  allProductTypes = new Array<IdNameParent>();
  productTypes = new Array<IdNameParent>();
  selectedProductTypes = new Array<IdNameParent>();
  obj = new RetailerProductInfo();
  placesSettings = {};
  categorySettings = {};
  subCategorySettings = {};
  productTypeSettings = {};
  saveLoader = false;
  fG1: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private productService: ProductService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      place: [[], Validators.required],
      category: [[], Validators.required],
      subCategory: [[], Validators.required],
      productType: [[], Validators.required],
    });
  }
  ngOnInit() {
    this.setFormValidators();
    if (this.retailerId) {
      this.getData(this.retailerId);
    } else {
      this.productService.getProductPlaces().subscribe(res => {
        this.places = res.map(p => new IdNameParent(p.PlaceId, p.PlaceName, '', ''));
      });
    }

    this.placesSettings = {
      singleSelection: false,
      text: 'Select Places',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      classes: 'myclass custom-class'
    };
    this.categorySettings = {
      singleSelection: false,
      text: 'Select Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
    this.subCategorySettings = {
      singleSelection: false,
      text: 'Select Sub Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
    this.productTypeSettings = {
      singleSelection: false,
      text: 'Select Types',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
  }
  refreshCategories() {
    this.categories = [];
    this.subCategories = [];
    this.productTypes = [];
    if (this.selectedPlaces && this.selectedPlaces.length > 0) {
      this.productService.getProductCategories(this.selectedPlaces.map(p => p.id)).subscribe(res => {
        this.categories = res.map(p => new IdNameParent(p.CategoryId, p.CategoryName, p.PlaceId, p.PlaceName));
      });
    }
  }
  onPlaceSelect(item: any) { this.refreshCategories(); }
  onPlaceDeSelect(item: any) { this.refreshCategories(); }
  onPlaceSelectAll(items: any) { this.refreshCategories(); }
  onPlaceDeSelectAll(items: any) { this.refreshCategories(); }

  refreshSubCategories() {
    this.subCategories = [];
    this.productTypes = [];
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      this.productService.getProductSubCategories(this.selectedCategories.map(p => p.id)).subscribe(res => {
        this.subCategories = res.map(p => new IdNameParent(p.SubCategoryId, p.SubCategoryName, p.CategoryId, p.CategoryName));
      });
    }
  }
  onCategorySelect(item: any) { this.refreshSubCategories(); }
  onCategoryDeSelect(item: any) { this.refreshSubCategories(); }
  onCategorySelectAll(items: any) { this.refreshSubCategories(); }
  onCategoryDeSelectAll(items: any) { this.refreshSubCategories(); }

  refreshProductTypes() {
    this.productTypes = [];
    if (this.selectedSubCategories && this.selectedSubCategories.length > 0) {
      this.productService.getProductTypes(this.selectedSubCategories.map(p => p.id)).subscribe(res => {
        this.productTypes = res.map(p => new IdNameParent(p.TypeId, p.TypeName, p.parentId, p.parentName));
      });
      this.fG1.controls.productType.setValidators([Validators.required]);
      this.fG1.controls.productType.updateValueAndValidity();
    } else {
      this.fG1.controls.productType.clearValidators();
      this.fG1.controls.productType.updateValueAndValidity();
    }
  }
  onSubCategorySelect(item: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelect(item: any) { this.refreshProductTypes(); }
  onSubCategorySelectAll(items: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelectAll(items: any) { this.refreshProductTypes(); }

  saveData() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
      this.core.message.info('Please complete all mandatory fields');
    } else {
      this.saveLoader = true;
      this.retialerService
        .saveProduct(this.readForm())
        .subscribe(res => {
          this.SaveData.emit('tab-Product');
          this.saveLoader = false;
          this.core.message.success('Product Info Saved');
          return true;
        }, err => this.core.message.success('Not able to Save'), () => this.saveLoader = false);

    }
    return false;
  }
  readForm() {
    this.obj = this.obj || new RetailerProductInfo();
    this.obj.retailerId = this.retailerId;
    this.obj.places = new Array<RetailerProductPlace>();

    for (let pIndex = 0; pIndex < this.selectedPlaces.length; pIndex++) {
      const place = this.selectedPlaces[pIndex];
      const newPlace = new RetailerProductPlace({ placeId: place.id, placeName: place.itemName });
      const relatedCategories = this.selectedCategories.filter(p => p.parentId === newPlace.placeId);
      for (let cIndex = 0; cIndex < relatedCategories.length; cIndex++) {
        const category = relatedCategories[cIndex];
        const newCategory = new RetailerProductCategory({ categoryId: category.id, categoryName: category.itemName });
        const relatedSubCategories = this.selectedSubCategories.filter(p => p.parentId === newCategory.categoryId);
        for (let scIndex = 0; scIndex < relatedSubCategories.length; scIndex++) {
          const subCategory = relatedSubCategories[scIndex];
          const newSubCategory = new RetailerProductSubCategory({ subCategoryId: subCategory.id, subCategoryName: subCategory.itemName });
          const relatedTypes = this.selectedProductTypes.filter(p => p.parentId === newSubCategory.subCategoryId);
          for (let tIndex = 0; tIndex < relatedTypes.length; tIndex++) {
            const type = relatedTypes[tIndex];
            const newType = new RetailerProductType({ typeId: type.id, typeName: type.itemName });
            newSubCategory.types.push(newType);
          }
          newCategory.subCategories.push(newSubCategory);
        }
        newPlace.categories.push(newCategory);
      }
      this.obj.places.push(newPlace);
    }
    return this.obj;
  }
  getData(retailerId) {
    this.retialerService
      .productGet(this.retailerId)
      .subscribe((res) => {
        this.obj = res;
        if (this.obj.places.length > 0) {
          for (let pIndex = 0; pIndex < this.obj.places.length; pIndex++) {
            const place = this.obj.places[pIndex];
            this.selectedPlaces.push(new IdNameParent(place.placeId, place.placeName, '', ''));
            if (place.categories.length > 0) {
              for (let cIndex = 0; cIndex < place.categories.length; cIndex++) {
                const category = place.categories[cIndex];
                this.selectedCategories.push(new IdNameParent(category.categoryId, category.categoryName, place.placeId, place.placeName));
                if (category.subCategories.length > 0) {
                  for (let scIndex = 0; scIndex < category.subCategories.length; scIndex++) {
                    const subCategory = category.subCategories[scIndex];
                    this.selectedSubCategories.push(new IdNameParent(subCategory.subCategoryId, subCategory.subCategoryName, category.categoryId, category.categoryName));
                    if (subCategory.types.length > 0) {
                      for (let tIndex = 0; tIndex < subCategory.types.length; tIndex++) {
                        const ptype = subCategory.types[tIndex];
                        this.selectedProductTypes.push(new IdNameParent(ptype.typeId, ptype.typeName, subCategory.subCategoryId, subCategory.subCategoryName));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.productService.getProductPlaces().subscribe(plaRes => {
          this.places = plaRes.map(p => new IdNameParent(p.PlaceId, p.PlaceName, '', ''));
          this.productService.getProductCategories(this.selectedPlaces.map(p => p.id)).subscribe(catRes => {
            this.categories = catRes.map(p => new IdNameParent(p.CategoryId, p.CategoryName, p.PlaceId, p.PlaceName));
            this.productService.getProductSubCategories(this.selectedCategories.map(p => p.id)).subscribe(subCatRes => {
              this.subCategories = subCatRes.map(p => new IdNameParent(p.SubCategoryId, p.SubCategoryName, p.CategoryId, p.CategoryName));
              this.productService.getProductTypes(this.selectedSubCategories.map(p => p.id)).subscribe(typRes => {
                this.productTypes = typRes.map(p => new IdNameParent(p.TypeId, p.TypeName, p.parentId, p.parentName));
              });
            });
          });
        });
      });
  }
}

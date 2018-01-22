import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products } from '../../../../../models/Product';
import { ProductService } from '../product.service';
import { ProductPlace, ProductCategory, ProductSubCategory } from '../../../../../models/product-info';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { IdNameParent } from '../../../../../models/nameValue';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  retailer: RetailerProfileInfo;
  reatileDummy: RetailerProfileInfo;
  retailers: RetailerProfileInfo[];
  productName: any;
  loading: boolean;
  products: Products;
  // places = new Array<ProductPlace>();
  // categories = new Array<ProductCategory>();
  // subCategories = new Array<ProductSubCategory>();
  productStatus: true;
  productPlace: ProductPlace;
  productCategory: ProductCategory;
  productSubCategory: ProductSubCategory;
  productPlaceDummy: ProductPlace;
  productCategoryDummy: ProductCategory;
  productSubCategoryDummy: ProductSubCategory;

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
  placesSettings = {};
  categorySettings = {};
  subCategorySettings = {};
  productTypeSettings = {};
  isCollapsed = true;
  constructor(private productService: ProductService, private retialerService: RetialerService) {
    this.products = new Products();
  }

  ngOnInit() {
    this.getPage(1);
    this.getPlaces();
    this.getRetailersData();
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
  getPlaces() {
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res.map(p => new IdNameParent(p.PlaceId, p.PlaceName, '', ''));
      // this.getCategories();
    });
  }

  refreshCategories() {
    this.categories = [];
    this.subCategories = [];
    this.productTypes = [];
    this.selectedProductTypes = [];
    if (this.selectedPlaces.length > 0) {
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
    this.selectedProductTypes = [];
    if (this.selectedCategories.length > 0) {
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
    this.selectedProductTypes = [];
    if (this.selectedSubCategories.length > 0) {
      this.productService.getProductTypes(this.selectedSubCategories.map(p => p.id)).subscribe(res => {
        this.productTypes = res.map(p => new IdNameParent(p.TypeId, p.TypeName, p.SubCategoryId, p.SubCategoryName));
      });
      // this.fG1.controls.productType.setValidators([Validators.required]);
      // this.fG1.controls.productType.updateValueAndValidity();
    } else {
      // this.fG1.controls.productType.clearValidators();
      // this.fG1.controls.productType.updateValueAndValidity();
    }
  }
  onSubCategorySelect(item: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelect(item: any) { this.refreshProductTypes(); }
  onSubCategorySelectAll(items: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelectAll(items: any) { this.refreshProductTypes(); }

  getRetailersData() {
    this.retialerService.get(null).subscribe((res) => {
      return this.retailers = res.content;
    });
  }
  getPage(page: number) {
    this.loading = true;

    // const searchParams = {
    //   page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', productStatus: null, productPlaceName: '', productCategoryName: '', productSubCategoryName: '', retailerId: null
    // };

    const searchParams = {
      page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', productStatus: null, product: this.readForm(), retailerId: null
    };

    if (this.productStatus) { searchParams.productStatus = this.productStatus; } else { searchParams.productStatus = true; }
    // if (this.productPlace) { searchParams.productPlaceName = this.productPlace.PlaceName; } else { delete searchParams.productPlaceName; }
    // if (this.productCategory) { searchParams.productCategoryName = this.productCategory.CategoryName; } else { delete searchParams.productCategoryName; }
    // if (this.productSubCategory) { searchParams.productSubCategoryName = this.productSubCategory.SubCategoryName; } else { delete searchParams.productSubCategoryName; }
    if (this.retailer) { searchParams.retailerId = this.retailer.retailerId; } else { delete searchParams.retailerId; }

    this.productService.get(searchParams).subscribe(res => {
      this.products = res;
      this.loading = false;
    });
  }

  readForm() {
    const product = {  places: [] };
    for (let pIndex = 0; pIndex < this.selectedPlaces.length; pIndex++) {
      const place = this.selectedPlaces[pIndex];
      const newPlace = { placeId: place.id, placeName: place.itemName, categories: [] };
      for (let cIndex = 0; cIndex < this.selectedCategories.length; cIndex++) {
        const category = this.selectedCategories[cIndex];
        const newCategory = { categoryId: category.id, categoryName: category.itemName, subCategories: [] };
        for (let scIndex = 0; scIndex < this.selectedSubCategories.length; scIndex++) {
          const subCategory = this.selectedSubCategories[scIndex];
          const newSubCategory = { subCategoryId: subCategory.id, subCategoryName: subCategory.itemName, types: [] };
          for (let tIndex = 0; tIndex < this.selectedProductTypes.length; tIndex++) {
            const type = this.selectedProductTypes[tIndex];
            const newType = { typeId: type.id, typeName: type.itemName, types: [] };
            newSubCategory.types.push(newType);
          }
          newCategory.subCategories.push(newSubCategory);
        }
        newPlace.categories.push(newCategory);
      }
      product.places.push(newPlace);
    }
    return product;
  }





  // placeChanged(event) {
  //   this.categories = new Array<ProductCategory>();
  //   this.subCategories = new Array<ProductSubCategory>();
  //   delete this.productCategory;
  //   delete this.productSubCategory;
  //   this.getCategories();
  // }
  // getCategories() {
  //   this.productService.getProductCategories([this.productPlace.PlaceId]).subscribe(res => {
  //     this.categories = res;
  //     this.getSubCategories();
  //   });
  // }
  // categoryChanged(event) {
  //   this.subCategories = new Array<ProductSubCategory>();
  //   delete this.productSubCategory;
  //   this.getSubCategories();
  // }
  // getSubCategories() {
  //   this.productService.getProductSubCategories([this.productCategory.CategoryId]).subscribe(res => {
  //     this.subCategories = res;
  //   });
  // }
}

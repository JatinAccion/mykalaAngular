import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products, Product } from '../../../../../models/Product';
import { ProductService } from '../product.service';
import { ProductPlace, ProductCategory, ProductSubCategory } from '../../../../../models/product-info';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { IdNameParent } from '../../../../../models/nameValue';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../../../../models/IAlert';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  sourceId: any;
  retailer: RetailerProfileInfo;
  reatileDummy: RetailerProfileInfo;
  retailers: RetailerProfileInfo[];
  productName: any;
  loading: boolean;
  products: Products;
  productStatus: true;
  productStatusDummy: true;
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
  bulkUploadView = false;
  constructor(private productService: ProductService, private retialerService: RetialerService, route: ActivatedRoute, private core: CoreService) {
    this.products = new Products();
    this.sourceId = route.snapshot.params['id'];
    if (this.sourceId) {
      this.bulkUploadView = true;
    }
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
      badgeShowLimit: 1,
      classes: 'myclass custom-class'
    };
    this.categorySettings = {
      singleSelection: false,
      text: 'Select Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 1,
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
      badgeShowLimit: 1,
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
        this.productTypes = res.map(p => new IdNameParent(p.TypeId, p.TypeName, p.parentId, p.parentName));
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
    this.productService.getSellerNames().subscribe((res) => {
      return this.retailers = res;
    });
  }
  getPage(page: number) {
    this.loading = true;

    const searchParams = {
      page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', productName: this.productName, productStatus: [], productPlaceName: [], productCategoryName: [], productSubCategoryName: [], retailerId: [], sourceId: this.sourceId
    };
    if (this.productStatus === undefined) { delete searchParams.productStatus; } else { searchParams.productStatus = [this.productStatus]; }
    if (this.selectedPlaces.length > 0) { searchParams.productPlaceName = this.selectedPlaces.map(p => p.itemName); } else { delete searchParams.productPlaceName; }
    if (this.selectedCategories.length > 0) { searchParams.productCategoryName = this.selectedCategories.map(p => p.itemName); } else { delete searchParams.productCategoryName; }
    if (this.selectedSubCategories.length > 0) { searchParams.productSubCategoryName = this.selectedSubCategories.map(p => p.itemName); } else { delete searchParams.productSubCategoryName; }
    if (this.retailer) { searchParams.retailerId = [this.retailer.retailerId]; } else { delete searchParams.retailerId; }

    this.productService.get(searchParams).subscribe(res => {
      this.products = res;
      this.loading = false;
    });
  }
  getSellerName(retailerId: string) {
    if (this.retailers && this.retailers.length > 0 && this.retailers.filter(p => p.retailerId === retailerId).length > 0) {
      return this.retailers.filter(p => p.retailerId === retailerId)[0].businessName;
    } else {
      return retailerId;
    }
  }
  delete(product: Product) {
    const msg = new Alert(userMessages.delete , 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        this.productService.deleteProduct(product.kalaUniqueId).subscribe(p => {
          this.core.message.success(userMessages.deleteSuccess);
          this.products.content.splice(this.products.content.indexOf(product), 1);
          this.getPage(this.products.number + 1);
        });
      }
    });
  }
  deactivate(product: Product) {
    const msg = new Alert(product.productStatus ? userMessages.deactivate : userMessages.reactivate, 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        this.productService.changeStatus(product.kalaUniqueId, !product.productStatus).subscribe(p => {
          this.core.message.success(product.productStatus ? userMessages.deactivateSuccess : userMessages.reactivateSuccess);
          product.productStatus = !product.productStatus;
        });
      }
    });
  }
}

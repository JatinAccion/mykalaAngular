import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products } from '../../../../../models/Product';
import { ProductService } from '../product.service';
import { ProductPlace, ProductCategory, ProductSubCategory } from '../../../../../models/product-info';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';

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
  places = new Array<ProductPlace>();
  categories = new Array<ProductCategory>();
  subCategories = new Array<ProductSubCategory>();
  productStatus: boolean;
  productPlace: ProductPlace;
  productCategory: ProductCategory;
  productSubCategory: ProductSubCategory;
  productPlaceDummy: ProductPlace;
  productCategoryDummy: ProductCategory;
  productSubCategoryDummy: ProductSubCategory;
  isCollapsed = true;
  constructor(private productService: ProductService, private retialerService: RetialerService) {
    this.products = new Products();
  }

  ngOnInit() {
    this.getPage(1);
    this.getPlaces();
    this.getRetailersData();
  }
  getPlaces() {
    this.productService.getProductPlaces().subscribe(res => {
      this.places = res;
      this.getCategories();

    });
  }
  getRetailersData() {
    this.retialerService.get(null).subscribe((res) => {
      return this.retailers = res.content;
    });
  }
  getPage(page: number) {
    this.loading = true;

    const searchParams = {
      page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', productStatus: null, productPlaceName: '', productCategoryName: '', productSubCategoryName: '', retailerId: null
    };

    if (this.productStatus) { searchParams.productStatus = this.productStatus; } else { delete searchParams.productStatus; }
    if (this.productPlace) { searchParams.productPlaceName = this.productPlace.PlaceName; } else { delete searchParams.productPlaceName; }
    if (this.productCategory) { searchParams.productCategoryName = this.productCategory.CategoryName; } else { delete searchParams.productCategoryName; }
    if (this.productSubCategory) { searchParams.productSubCategoryName = this.productSubCategory.SubCategoryName; } else { delete searchParams.productSubCategoryName; }
    if (this.retailer) { searchParams.retailerId = this.retailer.retailerId; } else { delete searchParams.retailerId; }

    this.productService.get(searchParams).subscribe(res => {
      this.products = res;
      this.loading = false;
    });
  }
  placeChanged(event) {
    this.categories = new Array<ProductCategory>();
    this.subCategories = new Array<ProductSubCategory>();
    delete this.productCategory;
    delete this.productSubCategory;
    this.getCategories();
  }
  getCategories() {
    this.productService.getProductCategories([this.productPlace.PlaceId]).subscribe(res => {
      this.categories = res;
      this.getSubCategories();
    });
  }
  categoryChanged(event) {
    this.subCategories = new Array<ProductSubCategory>();
    delete this.productSubCategory;
    this.getSubCategories();
  }
  getSubCategories() {
    this.productService.getProductSubCategories([this.productCategory.CategoryId]).subscribe(res => {
      this.subCategories = res;
    });
  }
}

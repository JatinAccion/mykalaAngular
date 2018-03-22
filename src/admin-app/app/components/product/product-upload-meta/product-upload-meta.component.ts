import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products, Product } from '../../../../../models/Product';
import { ProductService } from '../product.service';
import { ProductPlace, ProductCategory, ProductSubCategory } from '../../../../../models/product-info';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { IdNameParent } from '../../../../../models/nameValue';
import { CoreService } from '../../../services/core.service';
import { environment } from '../../../../environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ProductUploads } from '../../../../../models/productUpload';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-upload-meta',
  templateUrl: './product-upload-meta.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductUploadMetaComponent implements OnInit {
  product = new Product();
  typesLoading: boolean;
  data = new ProductUploads();
  fileNames = '';
  saveLoader: boolean;
  retailerId: any;
  productFiles: Array<any>;
  progress = 0;
  loading = false;
  page = 1;
  places = new Array<ProductPlace>();
  categories = new Array<ProductCategory>();
  subCategories = new Array<ProductSubCategory>();
  productPlaceDummy: ProductPlace;
  productCategoryDummy: ProductCategory;
  productSubCategoryDummy: ProductSubCategory;
  constructor(private productService: ProductService, public route: ActivatedRoute, private retialerService: RetialerService, public core: CoreService) {
  }

  ngOnInit() {
    this.getPage(this.page);
    this.getPlaces();
  }
  getPage(page: number) {
    const searchParams = {
      page: page - 1, size: 10, sortOrder: 'desc', elementType: 'createdDate,DESC'
    };
    // const locationHash = window.location.hash.split('/page')[0];
    // window.location.hash = locationHash + '/page/' + page;
    this.productService.getUploadSummary(searchParams).subscribe(p => {
      this.data = p;
    });
  }
  upload() {
    this.productService.saveproductFiles(this.retailerId, this.productFiles).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.progress = percentDone;
        console.log(`File is ${percentDone}% uploaded.`);
      } else if (event.type === HttpEventType.Response) {
        this.progress = 0;
        this.fileNames = '';
        this.getPage(1);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    }, err => {
      this.core.message.error('error');
      this.progress = 0;
      this.fileNames = '';
    });
  }
  fileChangeEvent(fileInput: any) {
    this.productFiles = new Array<any>();
    this.fileNames = ''; this.progress = 0;
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const file = fileInput.target.files[i];
        this.productFiles.push({ file: file, mainImage: false });
        this.fileNames += '; ' + file.name;
        this.upload();
        fileInput.target.value = '';
      }
    }
  }

  delete(id) {
    this.productService.deleteuploadSummary(id).subscribe(p => {
      this.core.message.success('deleted successfully');
      this.getPage(this.data.number + 1);
    });

  }

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
    }
  }
}

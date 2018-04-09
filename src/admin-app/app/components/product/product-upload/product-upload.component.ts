import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products } from '../../../../../models/Product';
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
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductUploadComponent implements OnInit {
  data = new ProductUploads();
  fileNames = '';
  saveLoader: boolean;
  retailerId: any;
  productFiles: Array<any>;
  progress = 0;
  loading = false;
  page = 1;
  uploadOperation = '';
  constructor(private productService: ProductService, public route: ActivatedRoute, private retialerService: RetialerService, public core: CoreService) {
    if (window.location.hash.indexOf('/page') > -1) {
      this.page = route.snapshot.params['page'];
    }
    if (!this.page) {
      this.page = 1;
    }

  }

  ngOnInit() {
    this.getPage(this.page);
  }
  getPage(page: number) {
    const searchParams = {
      page: page - 1, size: 10, sortOrder: 'desc', elementType: 'createdDate,DESC'
    };
    const locationHash = window.location.hash.split('/page')[0];
    window.location.hash = locationHash + '/page/' + page;
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
}

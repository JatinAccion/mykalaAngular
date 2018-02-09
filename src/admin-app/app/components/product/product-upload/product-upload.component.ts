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

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductUploadComponent implements OnInit {
  saveLoader: boolean;
  retailerId: any;
  productFiles: Array<any>;

  constructor(private productService: ProductService, private retialerService: RetialerService, private core: CoreService) {

  }

  ngOnInit() {

  }
  upload() {
    this.productService.saveproductFiles(this.retailerId, this.productFiles).subscribe(event => {
      // Via this API, you get access to the raw event stream.
      // Look for upload progress events.
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        console.log(`File is ${percentDone}% uploaded.`);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });
  }
  fileChangeEvent(fileInput: any) {
    this.productFiles =  new Array<any>();
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const file = fileInput.target.files[i];
        this.productFiles.push({ file: file, mainImage: false });
      }
    }
  }
}

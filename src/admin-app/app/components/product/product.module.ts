import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { ProductAddBasicComponent } from './product-add-basic/product-add-basic.component';
import { ProductAddCategoryComponent } from './product-add-category/product-add-category.component';
import { ProductAddDeliveryComponent } from './product-add-delivery/product-add-delivery.component';
import { ProductAddImagesComponent } from './product-add-images/product-add-images.component';
import { ProductAddMoreComponent } from './product-add-more/product-add-more.component';
import { ProductAddPricingComponent } from './product-add-pricing/product-add-pricing.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductMetaComponent } from './product-meta/product-meta.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductUploadComponent } from './product-upload/product-upload.component';
import { GlobalErrorHandler } from '../../../../common/GlobalErrorHandler';
import { ProductUploadMetaComponent } from './product-upload-meta/product-upload-meta.component';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule,
    NgxPaginationModule,
    AngularMultiSelectModule
  ],
  declarations: [
    ProductListComponent,
    ProductAddComponent,
    ProductAddCategoryComponent,
    ProductAddBasicComponent,
    ProductAddDeliveryComponent,
    ProductAddImagesComponent,
    ProductAddMoreComponent,
    ProductAddPricingComponent,
    ProductMetaComponent,
    ProductUploadComponent,
    ProductUploadMetaComponent
  ],
  providers: [ProductService, ValidatorExt, {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }]
})
export class ProductModule { }

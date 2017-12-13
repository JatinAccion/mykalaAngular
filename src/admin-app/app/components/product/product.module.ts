import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from './product.service';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ProductListComponent,
    ProductAddComponent,
  ],
  providers: [ProductService, ValidatorExt]
})
export class ProductModule { }

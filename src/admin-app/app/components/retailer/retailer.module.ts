import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { RetailerRoutingModule } from './retailer-routing.module';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerEditComponent } from './retailer-edit/retailer-edit.component';
import { RetailerAddComponent } from './retailer-add/retailer-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RetialerService } from './retialer.service';
import { RetailerAddShippingComponent } from './retailer-add-shipping/retailer-add-shipping.component';
import { RetailerAddNotificationsComponent } from './retailer-add-notifications/retailer-add-notifications.component';
import { RetailerAddProductsComponent } from './retailer-add-products/retailer-add-products.component';
import { RetailerAddReturnsComponent } from './retailer-add-returns/retailer-add-returns.component';
import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { RetailerAddProfileComponent } from './retailer-add-profile/retailer-add-profile.component';
import { RetailerAddPaymentComponent } from './retailer-add-payment/retailer-add-payment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RetailerAddTaxComponent } from './retailer-add-tax/retailer-add-tax.component';


@NgModule({
  imports: [
    CommonModule,
    RetailerRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule,
    Angular2FontawesomeModule,
    AngularMultiSelectModule,
    NgxPaginationModule
  ],
  declarations: [
    RetailerListComponent,
    RetailerEditComponent,
    RetailerAddComponent,
    RetailerAddProfileComponent,
    RetailerAddPaymentComponent,
    RetailerAddShippingComponent,
    RetailerAddNotificationsComponent,
    RetailerAddProductsComponent,
    RetailerAddReturnsComponent,
    RetailerAddTaxComponent
  ],
  providers: [RetialerService, ValidatorExt]
})
export class RetailerModule { }

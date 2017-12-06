import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RetailerRoutingModule } from './retailer-routing.module';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerEditComponent } from './retailer-edit/retailer-edit.component';
import { RetailerAddComponent } from './retailer-add/retailer-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RetialerService } from './retialer.service';
import { FieldErrorDisplayComponent } from '../../../../common/field-error-display/field-error-display.component';
import { RetailerAddShippingComponent } from './retailer-add-shipping/retailer-add-shipping.component';

@NgModule({
  imports: [
    CommonModule,
    RetailerRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [
    RetailerListComponent,
    RetailerEditComponent,
    RetailerAddComponent,
    FieldErrorDisplayComponent,
    RetailerAddShippingComponent
  ],
  providers: [RetialerService]
})
export class RetailerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderAddComponent } from './order-add/order-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderService } from './order.service';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule
  ],
  declarations: [
    OrderListComponent,
    OrderAddComponent,
  ],
  providers: [OrderService, ValidatorExt]
})
export class OrderModule { }

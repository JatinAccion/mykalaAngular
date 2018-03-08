import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderService } from './order.service';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { ChartModule } from 'angular2-chartjs';
import { OrderDetailsComponent } from './order-details/order-details.component';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule,
    ChartModule 
  ],
  declarations: [
    OrderListComponent,
    OrderDetailsComponent
  ],
  providers: [OrderService, ValidatorExt]
})
export class OrderModule { }

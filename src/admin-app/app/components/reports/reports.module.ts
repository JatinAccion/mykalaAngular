import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { ChartModule } from 'angular2-chartjs';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsService } from './reports.service';
import { CustomersReportComponent } from './customers-report/customers-report.component';
import { InquiriesReportComponent } from './inquiries-report/inquiries-report.component';
import { PaymentsReportComponent } from './payments-report/payments-report.component';
import { ReviewsReportComponent } from './reviews-report/reviews-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule,
    ChartModule
  ],
  declarations: [
    CustomersReportComponent,
    InquiriesReportComponent,
    PaymentsReportComponent,
    ReviewsReportComponent,
    SalesReportComponent
  ],
  providers: [ReportsService, ValidatorExt]
})
export class ReportsModule { }

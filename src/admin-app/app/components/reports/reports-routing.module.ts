import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';
import { CustomersReportComponent } from './customers-report/customers-report.component';
import { InquiriesReportComponent } from './inquiries-report/inquiries-report.component';
import { PaymentsReportComponent } from './payments-report/payments-report.component';
import { ReviewsReportComponent } from './reviews-report/reviews-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';

const appRoutes: Routes = [
  {
    path: 'customers-report',
    component: CustomersReportComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'inquiries-report',
    component: InquiriesReportComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'payments-report',
    component: PaymentsReportComponent,
    canActivate: [EnsureAuthenticated]
  }, {
    path: 'reviews-report',
    component:      ReviewsReportComponent,
    canActivate: [EnsureAuthenticated]
  }, {
    path: 'sales-report',
    component: SalesReportComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }

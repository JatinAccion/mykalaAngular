import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';

const appRoutes: Routes = [
  {
    path: 'order-list',
    component: OrderListComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'order-details',
    component: OrderDetailsComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }

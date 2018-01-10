import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderAddComponent } from './order-add/order-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';

const appRoutes: Routes = [
  {
    path: 'order-list',
    component: OrderListComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'order-add',
    component: OrderAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'order-edit/:id',
    component: OrderAddComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }

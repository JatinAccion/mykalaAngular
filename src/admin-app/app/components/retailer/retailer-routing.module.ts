import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerAddComponent } from './retailer-add/retailer-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';
import { CanDeactivateGuard } from '../../services/candeactivate-guard.service';

const appRoutes: Routes = [
  {
    path: 'retailer-list',
    component: RetailerListComponent,
    canActivate: [EnsureAuthenticated],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'retailer-add',
    component: RetailerAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'retailer-add/tab/:tab',
    component: RetailerAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'retailer-edit/:id',
    component: RetailerAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'retailer-edit/:id/tab/:tab',
    component: RetailerAddComponent,
    canActivate: [EnsureAuthenticated]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class RetailerRoutingModule { }

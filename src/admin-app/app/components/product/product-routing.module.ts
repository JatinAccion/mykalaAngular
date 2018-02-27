import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';
import { ProductMetaComponent } from './product-meta/product-meta.component';
import { CanDeactivateGuard } from '../../services/candeactivate-guard.service';
import { ProductUploadComponent } from './product-upload/product-upload.component';

const appRoutes: Routes = [
  {
    path: 'product-list',
    component: ProductListComponent,
    canActivate: [EnsureAuthenticated],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'product-list/:id',
    component: ProductListComponent,
    canActivate: [EnsureAuthenticated],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'product-add',
    component: ProductAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'product-edit/:id',
    component: ProductAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'product-meta',
    component: ProductMetaComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'product-upload',
    component: ProductUploadComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'product-upload/page/:page',
    component: ProductUploadComponent,
    canActivate: [EnsureAuthenticated]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

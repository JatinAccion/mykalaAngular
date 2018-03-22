import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { InquiryAddComponent } from './inquiry-add/inquiry-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';

const appRoutes: Routes = [
  {
    path: 'inquiry-list',
    component: InquiryListComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'inquiry-add',
    component: InquiryAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'inquiry-edit/:id',
    component: InquiryAddComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }

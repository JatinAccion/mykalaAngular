import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';

const appRoutes: Routes = [
  {
    path: 'enquiry-list',
    component: EnquiryListComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'enquiry-add',
    component: EnquiryAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'enquiry-edit/:id',
    component: EnquiryAddComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EnquiryRoutingModule { }

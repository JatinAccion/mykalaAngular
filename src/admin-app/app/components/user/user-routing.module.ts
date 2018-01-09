import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { LoginRedirect } from '../../services/login-redirect.service';
import { EnsureAuthenticated } from '../../services/ensure-authenticated.service';

const appRoutes: Routes = [
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'user-add',
    component: UserAddComponent,
    canActivate: [EnsureAuthenticated]
  },
  {
    path: 'user-edit/:id',
    component: UserAddComponent,
    canActivate: [EnsureAuthenticated]
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRedirect } from './services/login-redirect.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { StatusComponent } from './components/status/status.component';

import { LogoutComponent } from './components/logout/logout.component';
import { RetailerRoutingModule } from './components/retailer/retailer-routing.module';
import { ProductRoutingModule } from './components/product/product-routing.module';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        // canActivate: [LoginRedirect]
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [EnsureAuthenticated]
    },
    {
        path: 'status',
        component: StatusComponent,
        canActivate: [EnsureAuthenticated]
    },
    {
        path: '**',
        redirectTo: '/home'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
];

@NgModule({
    imports: [RetailerRoutingModule,
        ProductRoutingModule,
        RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

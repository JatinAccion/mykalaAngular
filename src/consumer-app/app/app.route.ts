import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRedirect } from './services/login-redirect.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { StatusComponent } from './components/status/status.component';

import { LogoutComponent } from './components/logout/logout.component';
import { ConversationalComponent } from './components/conversational/conversational.component';
import { JoinKalaComponent } from './components/join-kala/join-kala.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ThankMessageComponent } from './components/thank-message/thank-message.component';
import { ConsumerInterestComponent } from './components/consumer-interest/consumer-interest.component';
import { BrowseProductComponent } from './components/browse-product/browse-product.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { header: 'header1' }
        //canActivate: [LoginRedirect]
    },
    {
        path: 'join-kala',
        component: JoinKalaComponent,
        data: { header: 'header1' }
    },
    {
        path: 'profile-info',
        component: ProfileInfoComponent,
        data: { header: 'header2' }
    },
    {
        path: 'browse-product',
        component: BrowseProductComponent,
        data: { header: 'header2' }
    },
    {
        path: 'interest',
        component: ConsumerInterestComponent,
        data: { header: 'header2' }
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { header: 'header2' }
        // canActivate: [EnsureAuthenticated]
    },
    {
        path: 'browse-product',
        component: BrowseProductComponent,
        data: { header: 'header2' }
        // canActivate: [EnsureAuthenticated]
    },
    {
        path: 'cui',
        component: ConversationalComponent,
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'status',
        component: StatusComponent,
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'thank',
        component: ThankMessageComponent,
        data: { header: 'header1' }
    },
    {
        path: '**',
        redirectTo: '/join-kala'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/join-kala'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

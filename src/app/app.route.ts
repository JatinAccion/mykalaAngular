import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { StatusComponent } from './components/status/status.component';

import { LoginRedirect } from './services/login-redirect.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { LogoutComponent } from './components/logout/logout.component';
import { ConversationalComponent } from './components/conversational/conversational.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginRedirect]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoginRedirect]
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [EnsureAuthenticated]
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
    // {
    //     path: '',
    //     redirectTo: '/login'
    // },
    {
        path: '**',
        redirectTo: '/login'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/login'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

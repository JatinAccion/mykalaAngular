import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.route';

import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';

import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { StatusComponent } from './components/status/status.component';
import { LoginRedirect } from './services/login-redirect.service';
import { LogoutComponent } from './components/logout/logout.component';

import { HomeService } from './components/home/home.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RetailerModule } from './components/retailer/retailer.module';
import { LocalStorageService } from './services/LocalStorage.service';
import { ProductModule } from './components/product/product.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SpinnerComponent } from './components/spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StatusComponent,
    LogoutComponent,
    HeaderComponent,
    FooterComponent,
    ForgotPasswordComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RetailerModule,
    ProductModule,
    Angular2FontawesomeModule,
    AngularMultiSelectModule
  ],
  providers: [AuthService, EnsureAuthenticated, LoginRedirect, HomeService, CoreService, LocalStorageService],
  bootstrap: [AppComponent],
  entryComponents: [HomeComponent, LoginComponent]
})
export class AppModule { }

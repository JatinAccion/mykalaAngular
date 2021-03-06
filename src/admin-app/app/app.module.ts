import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ToastrModule } from 'ngx-toastr';
import { DialogComponent } from './components/dialog/dialog.component';
import { UserModule } from './components/user/user.module';
import { InquiryModule } from './components/inquiry/inquiry.module';
import { OrderModule } from './components/order/order.module';
import { CanDeactivateGuard } from './services/candeactivate-guard.service';
// import { ConfirmService, ConfirmState } from './services/confirm-modal.service';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { GlobalErrorHandler } from '../../common/GlobalErrorHandler';
import { ReportsModule } from './components/reports/reports.module';

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
    SpinnerComponent,
    DialogComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RetailerModule,
    ProductModule,
    UserModule,
    InquiryModule,
    OrderModule,
    ReportsModule,
    Angular2FontawesomeModule,
    AngularMultiSelectModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 3000, progressBar: true, closeButton: true }),
    NgxStripeModule.forRoot(environment.stripePK)
  ],
  providers: [AuthService, EnsureAuthenticated, LoginRedirect, HomeService, CoreService, LocalStorageService, CanDeactivateGuard,
    // ConfirmService, ConfirmState
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [HomeComponent, LoginComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.route';

import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';


import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TilesComponent } from './components/home/tiles/tiles.component';
import { BreadcrumsComponent } from './components/home/breadcrums/breadcrums.component';
import { BrowseProductComponent } from './components/browse-product/browse-product.component';
import { StatusComponent } from './components/status/status.component';
import { LoginRedirect } from './services/login-redirect.service';
import { LogoutComponent } from './components/logout/logout.component';

import { HomeService } from './services/home.service';
import { HeaderComponent } from './components/header/header.component';
import { SubMenusComponent } from './components/sub-menus/sub-menus.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConversationalComponent } from './components/conversational/conversational.component';
import { ConversationalService } from './components/conversational/conversational.service';
import { cmsgComponent } from './components/conversational/cmsg.component';
import { cuiDirective } from './components/conversational/cui.directive';
import { cListComponent } from './components/conversational/cList.component';
import { JoinKalaComponent } from './components/join-kala/join-kala.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { JoinKalaService } from '../app/services/join-kala.service';
import { ProfileInfoService } from '../app/services//profile-info.service';
import { ThankMessageComponent } from './components/thank-message/thank-message.component';
import { VerificationService } from '../app/services/verification.service';
import { LocalStorageService } from '../app/services/LocalStorage.service';
import { ConsumerInterestComponent } from '../app/components/consumer-interest/consumer-interest.component';
import { ConsumerInterestService } from './services/consumer-interest.service';
import { NgbDateFRParserFormatter } from '../../common/ngb-date-fr-parser-formatter';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SidebarModule } from 'ng-sidebar';
import { ResetPasswordService } from './services/resetPassword.service';
import { ForgotPasswordService } from './services/forgotPassword.service';
import { GetoffersComponent } from './components/getoffers/getoffers.component';
import { Step1Component } from './components/getoffers/step1/step1.component';
import { Step2Component } from './components/getoffers/step2/step2.component';
import { Step3Component } from './components/getoffers/step3/step3.component';
import { Step4Component } from './components/getoffers/step4/step4.component';
import { GetOfferService } from './services/getOffer.service';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { MycartComponent } from './components/mycart/mycart.component';
import { DxRangeSliderModule, DxNumberBoxModule } from 'devextreme-angular';
import { StripePocComponent } from './components/stripe-poc/stripe-poc.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StatusComponent,
    LogoutComponent,
    HeaderComponent,
    FooterComponent,
    ConversationalComponent,
    cmsgComponent,
    cListComponent,
    cuiDirective,
    JoinKalaComponent,
    ProfileInfoComponent,
    ThankMessageComponent,
    ConsumerInterestComponent,
    TilesComponent,
    BreadcrumsComponent,
    BrowseProductComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    GetoffersComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    ViewProductComponent,
    MycartComponent,
    SubMenusComponent,
    StripePocComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DxRangeSliderModule,
    DxNumberBoxModule,
    Angular2FontawesomeModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [AuthService, EnsureAuthenticated, LoginRedirect, HomeService, CoreService, ConversationalService, JoinKalaService,
    ProfileInfoService, VerificationService, LocalStorageService, ConsumerInterestService, ResetPasswordService, ForgotPasswordService, GetOfferService,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
  bootstrap: [AppComponent],
  entryComponents: [cmsgComponent, HomeComponent, cListComponent, JoinKalaComponent, LoginComponent]
})
export class AppModule { }

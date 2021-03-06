import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.route';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

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
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { CheckoutService } from './services/checkout.service';
import { MyordersComponent } from './components/myorders/myorders.component';
import { MyOrdersService } from './services/myorder.service';
import { MyaccountComponent } from './components/myaccount/myaccount.component';
import { MyAccountService } from './services/myAccount.service';
import { MyoffersComponent } from './components/myoffers/myoffers.component';
import { MyOffersService } from './services/myOffer.service';
import { LeaveReviewComponent } from './components/leave-review/leave-review.component';
import { MyReviewService } from './services/review.service';
import { ViewProductService } from './services/viewProduct.service';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { MyNewsAlertsComponent } from './components/my-news-alerts/my-news-alerts.component';
import { MyAlertsService } from './services/MyNewsAlertsService';
import { MailEntryModule } from './components/mail-entry/mail-entry.module';
import { ElasticSearchResult } from './components/elastic-search-result/elastic-search-result.component';
import { MyCartService } from './services/mycart.service';
import { ViewOfferComponent } from './components/view-offer/view-offer.component';
import { ViewOfferService } from './services/viewOffer.service';
import { SellOnKalaComponent } from './components/sellOnKala/sell-on-kala.component';
import { SellOnKalaService } from '../app/services/sell-on-kala.service';
import { SharedModule } from '../../common/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

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
    ReversePipe,
    CheckoutComponent,
    MyordersComponent,
    MyaccountComponent,
    MyoffersComponent,
    LeaveReviewComponent,
    TrackOrderComponent,
    MyNewsAlertsComponent,
    ElasticSearchResult,
    ViewOfferComponent,
    SellOnKalaComponent
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
    MailEntryModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    AngularMultiSelectModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [
    AuthService,
    EnsureAuthenticated,
    LoginRedirect,
    HomeService,
    CoreService,
    ConversationalService,
    JoinKalaService,
    MyAccountService,
    MyOrdersService,
    MyReviewService,
    ViewProductService,
    MyOffersService,
    ProfileInfoService,
    MyAlertsService,
    VerificationService,
    LocalStorageService,
    ConsumerInterestService,
    ResetPasswordService,
    ForgotPasswordService,
    GetOfferService,
    CheckoutService,
    MyCartService,
    SellOnKalaService,
    ViewOfferService,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateFRParserFormatter
    }],
  bootstrap: [AppComponent],
  entryComponents: [cmsgComponent, HomeComponent, cListComponent, JoinKalaComponent, LoginComponent]
})
export class AppModule { }

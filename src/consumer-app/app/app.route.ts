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
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GetoffersComponent } from './components/getoffers/getoffers.component';
import { Step1Component } from './components/getoffers/step1/step1.component';
import { Step2Component } from './components/getoffers/step2/step2.component';
import { Step3Component } from './components/getoffers/step3/step3.component';
import { Step4Component } from './components/getoffers/step4/step4.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { MycartComponent } from './components/mycart/mycart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MyordersComponent } from './components/myorders/myorders.component';
import { MyaccountComponent } from './components/myaccount/myaccount.component';
import { MyoffersComponent } from './components/myoffers/myoffers.component';
import { LeaveReviewComponent } from './components/leave-review/leave-review.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { MyNewsAlertsComponent } from './components/my-news-alerts/my-news-alerts.component';
import { MailEntryRoutingModule } from './components/mail-entry/mail-entry-routing.module';
import { ElasticSearchResult } from './components/elastic-search-result/elastic-search-result.component';
import { ViewOfferComponent } from './components/view-offer/view-offer.component';
import { SellOnKalaComponent } from './components/sellOnKala/sell-on-kala.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { header: 'header1' }
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
        path: 'elastic-product',
        component: ElasticSearchResult,
        data: { header: 'header2' }
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { header: 'header1' }
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: { header: 'header1' }
    },
    {
        path: 'interest',
        component: ConsumerInterestComponent,
        data: { header: 'header2' }
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'trackOrder',
        component: TrackOrderComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'getoffer',
        component: GetoffersComponent,
        children: [
            { path: '', redirectTo: 'step1', pathMatch: 'full', data: { header: 'header2' } },
            { path: 'step1', component: Step1Component, data: { header: 'header2' } },
            { path: 'step2', component: Step2Component, data: { header: 'header2' } },
            { path: 'step3', component: Step3Component, data: { header: 'header2' } },
            { path: 'step4', component: Step4Component, data: { header: 'header2' } }
        ]
    },
    {
        path: 'view-product',
        component: ViewProductComponent,
        data: { header: 'header1' }
    },
    {
        path: 'view-offer',
        component: ViewOfferComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'mycart',
        component: MycartComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'myorder',
        component: MyordersComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'myaccount',
        component: MyaccountComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'myoffer',
        component: MyoffersComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'myalerts',
        component: MyNewsAlertsComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'leave-review',
        component: LeaveReviewComponent,
        data: { header: 'header1' },
        canActivate: [EnsureAuthenticated]
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { header: 'header2' }
    },
    {
        path: 'browse-product',
        component: BrowseProductComponent,
        data: { header: 'header2' }
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
        path: 'token/:tokenId/thank',
        component: ThankMessageComponent,
        data: { header: 'header1' }
    },
    {
        path: 'sell-on-kala',
        component: SellOnKalaComponent,
        data: { header: 'header1' }
    },
    {
        path: '**',
        redirectTo: '/home'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    }
];

@NgModule({
    imports: [MailEntryRoutingModule, RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

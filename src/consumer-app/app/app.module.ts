import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.route';

import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';


import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TilesComponent } from './components/home/tiles/tiles.component';
import { BreadcrumsComponent } from './components/home/breadcrums/breadcrums.component';
import { BrowseProductComponent } from './components/home/browse-product/browse-product.component';
import { StatusComponent } from './components/status/status.component';
import { LoginRedirect } from './services/login-redirect.service';
import { LogoutComponent } from './components/logout/logout.component';

import { HomeService } from './services/home.service';
import { HeaderComponent } from './components/header/header.component';
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
import { SidebarModule } from 'ng-sidebar';

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
    BrowseProductComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [AuthService, EnsureAuthenticated, LoginRedirect, HomeService, CoreService, ConversationalService, JoinKalaService,
    ProfileInfoService, VerificationService, LocalStorageService, ConsumerInterestService,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
  bootstrap: [AppComponent],
  entryComponents: [cmsgComponent, HomeComponent, cListComponent, JoinKalaComponent, LoginComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
import { ConversationalComponent } from './components/conversational/conversational.component';
import { ConversationalService } from './components/conversational/conversational.service';
import { cmsgComponent } from './components/conversational/cmsg.component';
import { cuiDirective } from './components/conversational/cui.directive';
import { cListComponent } from './components/conversational/cList.component';
import { JoinKalaComponent } from './components/join-kala/join-kala.component';

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
    JoinKalaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [AuthService, EnsureAuthenticated, LoginRedirect, HomeService, CoreService, ConversationalService],
  bootstrap: [AppComponent],
  entryComponents: [cmsgComponent, HomeComponent, cListComponent, JoinKalaComponent, LoginComponent]
})
export class AppModule { }

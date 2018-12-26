import { Injectable, transition } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { User, UserProfile, BasicAuth } from '../../../models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Promise } from 'q';
import { Alert } from '../../../models/IAlert';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './LocalStorage.service';
import { Router } from '@angular/router';
@Injectable()
export class CoreService {
  user = new UserProfile({});

  navVisible = true;
  spinnerVisible = false;
  message = this.toastr;
  dialogVisible = new Subject<Alert>();
  dialogResponse = new Subject<string>();
  session: any;
  refreshingSession: boolean = false;
  stripe = Stripe(environment.stripePK);

  constructor(private toastr: ToastrService, private http: Http, private localStorageService: LocalStorageService, private route: Router) {
    if (window.localStorage['token'] != undefined) this.startTokenValidation()
  }

  hide() { this.navVisible = false; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }


  hideSpinner() { this.spinnerVisible = false; }

  showSpinner() { this.spinnerVisible = true; }

  toggleSpinner() { this.spinnerVisible = !this.spinnerVisible; }

  showLogout() { return this.user !== null; }

  setUser(usr: UserProfile) {
    this.user = usr;
    this.show();
  }
  clearUser() {
    localStorage.removeItem('token');
    this.user = null;
    this.hide();
  }
  getUser(): UserProfile {
    return this.user;
  }

  showDialog(alert: Alert): Promise<any> {
    return Promise(resolve => {
      this.dialogVisible.next(alert);
      this.dialogResponse.subscribe(sub => {
        return resolve(sub);
      });
    });
  }
  setDialogResponse(response) {
    this.dialogResponse.next(response);
  }
  isZeroValue(subject: string): boolean {
    return /^0*$/.test(subject);
  }
  /// pass key - tab or page or hash to set
  /// pass value as tab name or page number
  setUrl(key: string, value?: string) {
    if (key && value) {
      const locationHash = window.location.hash.split('/' + key)[0];
      window.location.hash = locationHash + '/' + key + '/' + value;
    }
    if (key) {
      window.location.hash = key;
    }
  }

  getBearerToken() {
    let token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
    return token;
  }

  setHeaders() {
    let header = new Headers({
      Authorization: 'Bearer ' + this.getBearerToken()
    });

    return header;
  }

  setRefereshToken(token) {
    window.localStorage['rf_Token'] = token;
  }

  startTokenValidation() {
    if (window.localStorage['token'] != undefined) this.session = setInterval(() => this.callRefereshIfExpired(), 1000);
    else clearInterval(this.session);
  }

  clearTokenValidation() {
    clearInterval(this.session);
  }

  callRefereshIfExpired() {
    let loggedInTime = new Date(JSON.parse(JSON.parse(window.localStorage['token']).timestamp));
    let currentTime = new Date();
    if (currentTime > loggedInTime) {
      this.clearTokenValidation();
      let refereshToken = window.localStorage['rf_Token'];
      let basicAuth = new BasicAuth();
      let headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
        Authorization: `Basic ${basicAuth.encoded}`
      });
      const BASE_URL: string = `${environment.Api}/${environment.apis.Auth.token}client_id=${basicAuth.client_id}&grant_type=refresh_token&refresh_token=${refereshToken}`;
      return this.http.post(BASE_URL, null, { headers: headers }).map((res) => res.json()).subscribe((res) => {
        this.refreshingSession = true;
        this.localStorageService.setItem('token', res.access_token, res.expires_in);
        this.setRefereshToken(res.refresh_token);
        this.startTokenValidation();
        setTimeout(() => this.refreshingSession = false, 3000);
      }, (err) => {
        this.refreshingSession = true;
        setTimeout(() => {
          this.refreshingSession = false;
          this.route.navigateByUrl("/logout");
        }, 3000);
      });
    }
  }
}

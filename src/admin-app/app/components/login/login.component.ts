import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../../services/LocalStorage.service';
import { userMessages, loginInputValidations } from './messages';
import { RememberMe } from '../../../../models/rememberMe';
import { fail } from 'assert';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  userInactive: boolean;
  unAuthorized = false;
  loginKala: FormGroup;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  usernameRegex = new RegExp('^[a-zA-Z0-9_.-]*$');
  user: User = new User();
  userMessages = userMessages;
  loginInputValidations = loginInputValidations;
  credentialModal = new RememberMe();
  getCredentials = window.localStorage['rememberMe'];
  loader = false;
  loginError = false;
  @Input() hideNavi: string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public core: CoreService,
    private localStorageService: LocalStorageService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
    if (this.getCredentials !== '' && this.getCredentials !== undefined) {
      this.loginKala = this.formBuilder.group({
        email: [JSON.parse(this.getCredentials).email, [Validators.required, Validators.pattern(environment.regex.emailRegex)]],
        password: [window.atob(JSON.parse(this.getCredentials).password), Validators.compose([Validators.required])],
        remember: [JSON.parse(this.getCredentials).remember]
      });
    } else {
      this.loginKala = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(environment.regex.emailRegex)]],
        password: ['', Validators.compose([Validators.required])],
        remember: ['']
      });
    }
  }
  onLogin() {
    this.loginError = false;
    this.unAuthorized = false;
    this.loader = true;
    this.user = new User(this.loginKala.controls.email.value.toLowerCase(), this.loginKala.controls.email.value.toLowerCase(), this.loginKala.controls.password.value);
    this.credentialModal.email = this.loginKala.controls.email.value.toLowerCase();
    this.credentialModal.password = window.btoa(this.loginKala.controls.password.value);
    this.credentialModal.remember = this.loginKala.controls.remember.value;
    this.auth.login(this.user).then((res) => {
      this.processRemeberme();
      const resJson = res.json();
      this.localStorageService.setItem('token', `${resJson.token_type} ${resJson.access_token}`, resJson.expires_in);
      this.auth.getUserInfo(resJson.access_token).subscribe(usr => {
        this.loader = false;
        if (usr.userCreateStatus === false) {
          localStorage.removeItem('token');
          this.userInactive = true;
        } else {
          if (usr.roleName && usr.roleName.length > 0 && usr.roleName.indexOf('admin') > -1) {
            window.localStorage['userInfo'] = JSON.stringify(usr);
            this.core.setUser(usr);
            this.router.navigateByUrl('/retailer-list');
          } else {
            this.loader = false;
            this.unAuthorized = true;
          }
        }
      }, err => {
        this.loader = false;
        console.log(err);
      });
    }).catch((err) => {
      this.loader = false;
      this.loginError = true;
      console.log(err);
    });
  }
  processRemeberme() {
    this.credentialModal.email = this.loginKala.controls.email.value.toLowerCase();
    this.credentialModal.password = window.btoa(this.loginKala.controls.password.value);
    this.credentialModal.remember = this.loginKala.controls.remember.value;
    if (this.credentialModal.remember) {
      window.localStorage['rememberMe'] = JSON.stringify(this.credentialModal);
      // console.log(JSON.parse(window.localStorage['rememberMe']));
    } else { localStorage.removeItem('rememberMe'); }
  }
}

import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../../models/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../../services/core.service';
import { CuiComponent, MsgDirection } from '../conversational/cui.interface';
import { Conversation } from '../../models/conversation';
import { inputValidation } from './login.messges';
import { RememberMe } from '../../../../models/rememberMe';
import { LocalStorageService } from '../../services/LocalStorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, CuiComponent {
  loginKala: FormGroup;
  loader: boolean = false;
  loginInputValMsg = inputValidation;
  getCredentials = window.localStorage['rememberMe'];
  credentialModal = new RememberMe();
  userCredential: any;

  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  user: User = new User();
  @Input() hideNavi: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private core: CoreService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
    if (this.getCredentials != '' && this.getCredentials != undefined) {
      this.loginKala = this.formBuilder.group({
        email: [JSON.parse(this.getCredentials).email, [Validators.required, Validators.email]],
        password: [window.atob(JSON.parse(this.getCredentials).password), Validators.compose([Validators.required])],
        remember: [JSON.parse(this.getCredentials).remember]
      });
    }
    else {
      this.loginKala = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.compose([Validators.required])],
        remember: ['']
      });
    }
  }
  onLogin(): void {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.core.hide();
        this.core.showLogout();
        this.clicked.emit(new Conversation(MsgDirection.Out, "Login Completed"));
        this.clicked.emit(new Conversation(MsgDirection.In, "Hi, " + user.json().auth_token));
        this.router.navigateByUrl('/status');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit() {
    this.userCredential = new User(this.loginKala.controls.email.value, this.loginKala.controls.email.value, this.loginKala.controls.password.value)
    this.credentialModal.email = this.loginKala.controls.email.value;
    this.credentialModal.password = window.btoa(this.loginKala.controls.password.value);
    this.credentialModal.remember = this.loginKala.controls.remember.value;
    this.auth.login(this.userCredential).then((res) => {
      this.checkRememberMe();
      const resJson = res.json();
      this.localStorageService.setItem('token', `${resJson.token_type} ${resJson.access_token}`, resJson.expires_in);
      this.core.show();
      this.router.navigateByUrl('/home');
    }).catch((err) => {
      console.log(err);
    });
  }

  checkRememberMe() {
    if (this.credentialModal.remember) {
      window.localStorage['rememberMe'] = JSON.stringify(this.credentialModal);
      console.log(JSON.parse(window.localStorage['rememberMe']));
    }
    else localStorage.removeItem('rememberMe');
  }
}

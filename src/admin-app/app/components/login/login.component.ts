import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../../services/LocalStorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginKala: FormGroup;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  usernameRegex = new RegExp('^[a-zA-Z0-9_.-]*$');
  user: User = new User();
  @Input() hideNavi: string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private core: CoreService,
    private localStorageService: LocalStorageService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
    this.loginKala = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onLogin(): void {
    this.user = new User(this.loginKala.value.email, this.loginKala.value.email, this.loginKala.value.password);
    this.auth.login(this.user)
      .then((res) => {
        const resJson = res.json();
        this.localStorageService.setItem('token', `${resJson.token_type} ${resJson.access_token}`, resJson.expires_in);
        this.core.show();
        this.router.navigateByUrl('/status');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

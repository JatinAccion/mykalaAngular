import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { CuiComponent } from '../conversational/cui.interface';
import { ConversationalService } from '../conversational/conversational.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-join-kala',
  templateUrl: './join-kala.component.mobile.html',
  styleUrls: ['./join-kala.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JoinKalaComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<string>();
  step = 1;
  user: User = new User('', '', '');
  constructor(private router: Router, private auth: AuthService, private core: CoreService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
  }
  onEmailBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onUsernameBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onPasswordBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  isValidEmail() {
    if (true) {
      this.clicked.emit("email: " + this.user.email);
    }
  }
  isValidUsername() {
    if (true) {
      this.clicked.emit("username: " + this.user.username);
    }
  }
  isValidPassword() {
    if (true) {
      this.clicked.emit("password: " + "*******");
    }
  }

  validateInput() {
    if (this.user.email === '' && !this.isValidEmail()) { this.onEmailError(); }
    else if (this.user.username === '' && !this.isValidUsername()) { this.onUsernameError(); }
    else if (this.user.password === '' && !this.isValidPassword()) { this.onPasswordError(); }
    else this.signUp();
  }
  onEmailError() { this.clicked.emit("Please enter valid email Id"); this.step = 1; }
  onUsernameError() { this.clicked.emit("Please enter valid user name"); this.step = 2; }
  onPasswordError() { this.clicked.emit("Please enter valid password"); this.step = 3; }
  signUp() {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.clicked.emit("Join Completed");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClick(item: string) {
    this.clicked.emit(item);
  }
}

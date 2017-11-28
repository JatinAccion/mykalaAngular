import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { CuiComponent, MsgDirection } from '../conversational/cui.interface';
import { ConversationalService } from '../conversational/conversational.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { Conversation } from '../../models/conversation';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { JoinKalaService } from './join-kala.service';
import { UserMessages } from '../../userMessages';
import { ConsumerSignUp } from '../../../../models/consumer-signup';
import { RoleModel } from '../../../../models/userRole';

@Component({
  selector: 'app-join-kala',
  templateUrl: './join-kala.component.html',
  styleUrls: ['./join-kala.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JoinKalaComponent implements OnInit, CuiComponent {
  loader: boolean = false;
  joinKala: FormGroup;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  usernameRegex = new RegExp('^[a-zA-Z0-9.-]*$');
  userModel: ConsumerSignUp;
  signUpResponse = {
    status: false,
    response: "",
    message: ""
  };
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  step = 1;
  user: User = new User('', '', '');
  constructor(private joinKalaService: JoinKalaService, private formBuilder: FormBuilder, private router: Router, private auth: AuthService, private core: CoreService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
    this.joinKala = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern(this.usernameRegex)])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])]
    });
  }
  onUsernameBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onEmailBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  onPasswordBlur(event) { if (event.charCode === 13) { this.validateInput(); } }
  isValidUsername() {
    if (this.user.username !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "username: " + this.user.username));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid user name")); this.step = 1;
      return false;
    }
  }
  isValidEmail() {
    if (this.user.email !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "email: " + this.user.email));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid email Id")); this.step = 2;
      return false;
    }
  }
  isValidPassword() {
    if (this.user.password !== '') {
      this.clicked.emit(new Conversation(MsgDirection.In, "password: " + "*******"));
      return true;
    } else {
      this.clicked.emit(new Conversation(MsgDirection.Out, "Please enter valid password")); this.step = 3;
      return false;
    }
  }

  validateInput() {
    if (this.isValidUsername() && this.isValidEmail() && this.isValidPassword()) {
      this.signUp();
    }
  }

  signUp() {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.clicked.emit(new Conversation(MsgDirection.Out, "Join Completed"));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClick(item: Conversation) {
    this.clicked.emit(item);
  }

  onSubmit() {
    /*Request JSON*/
    this.loader = true;
    this.userModel.username = this.joinKala.value.username;
    this.userModel.password = this.joinKala.value.password;
    this.userModel.email_id = this.joinKala.value.email;
    this.userModel.origin_source = "NA";
    this.userModel.user_status = 1;
    this.userModel.roles = new RoleModel();
    this.userModel.roles.role_name = "consumer";

    this.joinKalaService.joinKalaStepOne(this.userModel).subscribe(res => {
      console.log(res);
      this.loader = false;
      window.localStorage['userInfo'] = JSON.stringify({ 'username': this.userModel.username, 'email': this.userModel.email_id });
      this.signUpResponse.status = true;
      this.signUpResponse.response = res._body;
      if (this.signUpResponse.response === "success") {
        this.signUpResponse.message = UserMessages.createAccount_success;
        setTimeout(function () {
          this.router.navigateByUrl('/profile-info');
        }, 3000)
      }
      else if (this.signUpResponse.response === "alreadyexists") this.signUpResponse.message = UserMessages.createAccount_aleadyExist;
      else this.signUpResponse.message = UserMessages.createAccount_Fail;
      this.joinKala.reset();
    }, err => {
      console.log("Error occured");
    });
  }
}

import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { CuiComponent, MsgDirection } from '../conversational/cui.interface';
import { ConversationalService } from '../conversational/conversational.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { Conversation } from '../../models/conversation';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { JoinKalaService } from '../../services/join-kala.service';
import { RoleModel } from '../../../../models/userRole';
import { ConsumerSignUp } from '../../../../models/consumer-signup';
import { userMessages, inputValidation } from './join.message';

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
  fullname = new RegExp('^[a-zA-Z0-9.-]*$');
  joinUserMsg = userMessages;
  joinInputValMsg = inputValidation;
  userModel = new ConsumerSignUp();
  signUpResponse = {
    status: false,
    message: ""
  };
  userInfo: any;
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  step = 1;
  user: User = new User('', '', '');
  constructor(private joinKalaService: JoinKalaService, private formBuilder: FormBuilder, private router: Router, private auth: AuthService, private core: CoreService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();
    this.joinKala = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.pattern(this.fullname)])],
      lastname: ['', Validators.compose([Validators.required, Validators.pattern(this.fullname)])],
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
    this.userModel.firstName = this.joinKala.value.firstname;
    this.userModel.lastName = this.joinKala.value.lastname;
    this.userModel.password = this.joinKala.value.password;
    this.userModel.emailId = this.joinKala.value.email;
    this.userModel.origin_source = "NA";
    this.userModel.roles = new Array<RoleModel>();
    this.userModel.roles.push(new RoleModel("consumer"));

    this.joinKalaService.joinKalaStepOne(this.userModel).subscribe(res => {
      console.log(res);
      this.loader = false;
      this.userInfo = res;
      this.signUpResponse.status = true;
      if (this.userInfo.userCreateStatus === "success") {
        this.signUpResponse.message = this.joinUserMsg.success;
        window.localStorage['userInfo'] = JSON.stringify(this.userInfo);
        setTimeout((router: Router) => {
          this.router.navigateByUrl('/profile-info');
        }, 3000)
      }
      else if (this.userInfo.userCreateStatus === "alreadyExists") this.signUpResponse.message = this.joinUserMsg.accountExist;
      else if (this.userInfo.userCreateStatus === "emailExists") this.signUpResponse.message = this.joinUserMsg.emailExists;
      this.joinKala.reset();
    }, err => {
      this.loader = false;
      this.signUpResponse.message = this.joinUserMsg.fail;
    });
  }
}

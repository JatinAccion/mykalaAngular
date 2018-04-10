import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { CuiComponent, MsgDirection } from '../conversational/cui.interface';
import { ConversationalService } from '../conversational/conversational.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { User } from '../../../../models/user';
import { Conversation } from '../../models/conversation';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { JoinKalaService } from '../../services/join-kala.service';
import { ConsumerSignUp } from '../../../../models/consumer-signup';
import { userMessages, inputValidation } from './join.message';
import { regexPatterns } from '../../../../common/regexPatterns';

@Component({
  selector: 'app-join-kala',
  templateUrl: './join-kala.component.html',
  styleUrls: ['./join-kala.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JoinKalaComponent implements OnInit, CuiComponent {
  loader: boolean = false;
  joinKala: FormGroup;
  passwordRegex = regexPatterns.password;
  fullname = new RegExp('^[a-zA-Z0-9.-]*$');
  emailRegex = regexPatterns.emailRegex;
  joinUserMsg = userMessages;
  joinInputValMsg = inputValidation;
  userModel = new ConsumerSignUp();
  @Input() hideNavi: string;
  signUpResponse = {
    status: false,
    message: ""
  };
  userInfo: any;
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  step = 1;
  user: User = new User('', '', '');
  firstNameValidation: boolean = false;
  lastNameValidation: boolean = false;
  emailValidation: boolean = false;
  passwordValidation: boolean = false;

  constructor(private routerOutlet: RouterOutlet, private joinKalaService: JoinKalaService, private formBuilder: FormBuilder, private router: Router, private auth: AuthService, public core: CoreService) { }
  ngOnInit() {
    /**Clearing the Logged In Session */
    localStorage.removeItem('token');
    this.core.clearUser();
    this.core.hideUserInfo(true);
    /**Clearing the Logged In Session */
    this.core.show();
    this.joinKala = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.pattern(this.fullname)])],
      lastname: ['', Validators.compose([Validators.required, Validators.pattern(this.fullname)])],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
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

  hideValidation() {
    this.firstNameValidation = false;
    this.lastNameValidation = false;
    this.emailValidation = false;
    this.passwordValidation = false;
    this.loader = false;
    this.signUpResponse.status = false;
  }

  onSubmit() {
    /*Request JSON*/
    this.firstNameValidation = false;
    this.lastNameValidation = false;
    this.emailValidation = false;
    this.passwordValidation = false;
    this.loader = false;
    this.signUpResponse.status = false;
    if (!this.joinKala.controls.firstname.value) this.firstNameValidation = true;
    else if (this.joinKala.controls.firstname.value && this.joinKala.controls.firstname.errors) this.firstNameValidation = true;
    else if (!this.joinKala.controls.lastname.value) this.lastNameValidation = true;
    else if (this.joinKala.controls.lastname.value && this.joinKala.controls.lastname.errors) this.lastNameValidation = true;
    else if (!this.joinKala.controls.email.value) this.emailValidation = true;
    else if (this.joinKala.controls.email.value && this.joinKala.controls.email.errors) this.emailValidation = true;
    else if (!this.joinKala.controls.password.value) this.passwordValidation = true;
    else if (this.joinKala.controls.password.value && this.joinKala.controls.password.errors) this.passwordValidation = true;
    else {
      this.loader = true;
      this.userModel.firstName = this.joinKala.value.firstname;
      this.userModel.lastName = this.joinKala.value.lastname;
      this.userModel.password = this.joinKala.value.password;
      this.userModel.emailId = this.joinKala.value.email.toLowerCase();
      this.userModel.userCreateStatus = false;
      this.userModel.phone = "";
      this.userModel.roleName = [];
      this.userModel.roleName.push("consumer");
      this.joinKalaService.joinKalaStepOne(this.userModel).subscribe(res => {
        console.log(res);
        this.loader = false;
        this.userInfo = res;
        if (this.userInfo.user_status === "success") {
          window.localStorage['userInfo'] = JSON.stringify(this.userInfo);
          this.signUpResponse.status = true;
          this.signUpResponse.message = this.joinUserMsg.success;
          setTimeout(() => {
            if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
            this.router.navigateByUrl('/profile-info');
          }, 3000);
          this.joinKala.reset();
        }
        else if (this.userInfo.user_status === "alreadyExists") {
          if (this.userInfo.userCreateStatus == false) {
            this.userInfo.user_status = "inactive";
            this.signUpResponse.status = true;
            this.signUpResponse.message = this.joinUserMsg.inactiveUser;
          }
          else {
            this.signUpResponse.status = true;
            this.signUpResponse.message = this.joinUserMsg.emailExists;
          }
        }
      }, err => {
        this.loader = false;
        this.signUpResponse.status = true;
        this.signUpResponse.message = this.joinUserMsg.fail;
      });
    }
  }

  verifyAccount() {
    this.loader = true;
    this.signUpResponse.status = false;
    this.auth.verifyAccount(this.joinKala.controls.email.value).subscribe((res) => {
      this.loader = false;
      this.userInfo.user_status = "success";
      this.signUpResponse.status = true;
      this.signUpResponse.message = this.joinUserMsg.success;
    })
  }
}

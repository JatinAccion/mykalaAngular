import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './fp.message';
import { ForgotPasswordService } from '../../services/forgotPassword.service';
import { ForgotPasswordModal } from '../../../../models/forgotPassword.modal';
import { regexPatterns } from '../../../../common/regexPatterns';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  loader: boolean = false;
  forgotPassword: FormGroup;
  fpUserMessage = userMessages;
  fpInputMessage = inputValidation;
  emailId: string;
  resetLink: string;
  emailRegex = regexPatterns.emailRegex;
  fpModal = new ForgotPasswordModal();
  responseHandling = { status: false, response: "" }

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private router: Router,
    public core: CoreService,
    private fpService: ForgotPasswordService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.forgotPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    });
  }

  onSubmit() {
    this.responseHandling.status = false;
    this.loader = true;
    this.fpModal.email = this.forgotPassword.controls.email.value;
    this.fpService.getUserByEmailId(this.fpModal.email).subscribe((res) => {
      if (res.userId != null || res.userId != undefined) {
        if (res.userCreateStatus) {
          let userId = res.userId;
          this.fpModal.resetLink = window.location.origin + `/#/reset-password?id=${userId}`;
          this.fpService.forgotPassword(this.fpModal).subscribe(res => {
            this.loader = false;
            this.responseHandling.status = true;
            this.responseHandling.response = "success";
            window.localStorage['userInfo'] = JSON.stringify(res);
            this.forgotPassword.reset();
          }, err => {
            this.loader = false;
            this.responseHandling.status = true;
            this.responseHandling.response = "fail";
          })
        }
        else {
          this.loader = false;
          this.responseHandling.status = true;
          this.responseHandling.response = "notVerified";
        }
      }
      else {
        this.loader = false;
        this.responseHandling.status = true;
        this.responseHandling.response = "notExists";
      }
    }, (err) => {
      console.log("Error", err)
    });
  }

  verifyAccount() {
    this.loader = true;
    this.responseHandling.status = false;
    this.auth.verifyAccount(this.forgotPassword.controls.email.value).subscribe((res) => {
      this.loader = false;
      this.responseHandling.status = true;
      this.responseHandling.response = "verificationSent";
    })
  }

}

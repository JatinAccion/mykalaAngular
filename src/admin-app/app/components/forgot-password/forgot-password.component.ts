import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './fp.message';
import { ForgotPasswordModal } from '../../../../models/forgotPassword.modal';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../../../models/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  loader = false;
  forgotPassword: FormGroup;
  fpUserMessage = userMessages;
  fpInputMessage = inputValidation;
  emailId: string;
  resetLink: string;
  fpModal = new ForgotPasswordModal();
  userInfo: UserProfile;
  responseHandling = { status: false, response: "" }

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private router: Router,
    private core: CoreService,
    private fpService: AuthService,
  ) { 
    
  }

  ngOnInit() {
    this.forgotPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.responseHandling.status = false;
    this.loader = true;
    this.fpModal.email = this.forgotPassword.controls.email.value;
    this.fpService.getUserByEmail(this.fpModal.email).subscribe(p => {
      this.userInfo = p;
      this.fpModal.resetLink = window.location.origin + `/#/reset-password/${this.userInfo.userId}`;
      this.fpService.forgotPassword(this.fpModal).subscribe(res => {
        this.loader = false;
        this.responseHandling.status = true;
        this.responseHandling.response = 'success';
        window.localStorage['userInfo'] = JSON.stringify(res);
      }, err => {
        this.loader = false;
        this.responseHandling.status = true;
        this.responseHandling.response = 'fail';
      });
    });
  }

}

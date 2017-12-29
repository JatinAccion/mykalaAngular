import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './rp.messages';
import { ResetPasswordService } from '../../services/resetPassword.service';
import { ResetPasswordModal } from '../../../../models/resetPassword.modal';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  loader: boolean = false;
  resetPassword: FormGroup;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  rpUserMessage = userMessages;
  rpInputMessage = inputValidation;
  passwordMissMatch: boolean = false;
  rpModal = new ResetPasswordModal();
  userInfo: any;
  responseHandling = { status: false, response: "" };

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private router: Router,
    private core: CoreService,
    private rpService: ResetPasswordService
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(window.localStorage['userInfo']);
    this.resetPassword = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])]
    });
  }

  onSubmit() {
    this.loader = true;
    if (this.resetPassword.controls.newPassword.value != this.resetPassword.controls.confirmPassword.value) {
      this.passwordMissMatch = true;
      this.loader = false;
    }
    else {
      this.passwordMissMatch = false;
      this.responseHandling.status = false;
      this.rpModal.id = this.userInfo.userId;
      this.rpModal.password = this.resetPassword.controls.confirmPassword.value;
      this.rpService.resetPassword(this.rpModal).subscribe(res => {
        this.loader = false;
        this.responseHandling.status = true;
        this.responseHandling.response = res;
      });
    }
  }
}

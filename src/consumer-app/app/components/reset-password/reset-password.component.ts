import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './rp.messages';

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
  rpInputMessage = inputValidation;
  passwordMissMatch: boolean = false;

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private router: Router,
    private core: CoreService
  ) { }

  ngOnInit() {
    this.resetPassword = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])]
    });
  }

  onSubmit() {
    if (this.resetPassword.controls.newPassword.value != this.resetPassword.controls.confirmPassword.value) this.passwordMissMatch = true;
    else {
      this.passwordMissMatch = false;
      console.log(this.resetPassword)
    }
  }
}

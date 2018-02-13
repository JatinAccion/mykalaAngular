import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './rp.messages';
import { ResetPasswordService } from '../../services/resetPassword.service';
import { ResetPasswordModal } from '../../../../models/resetPassword.modal';
import { regexPatterns } from '../../../../common/regexPatterns';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  userId: string;
  loader: boolean = false;
  resetPassword: FormGroup;
  passwordRegex = regexPatterns.password;
  rpUserMessage = userMessages;
  rpInputMessage = inputValidation;
  passwordMissMatch: boolean = false;
  rpModal = new ResetPasswordModal();
  userInfo: any;
  responseHandling = { status: false, response: "" };

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private route: Router,
    private core: CoreService,
    private rpService: ResetPasswordService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.userId = this.router.snapshot.queryParams.id;
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
      this.rpModal.id = this.userId;
      this.rpModal.password = this.resetPassword.controls.confirmPassword.value;
      this.rpService.resetPassword(this.rpModal).subscribe(res => {
        this.loader = false;
        this.responseHandling.status = true;
        this.responseHandling.response = res;
        setTimeout(() => {
          this.route.navigateByUrl('/login')
        }, 1000);
      });
    }
  }
}

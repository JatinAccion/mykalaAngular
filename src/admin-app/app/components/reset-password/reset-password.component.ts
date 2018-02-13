import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { userMessages, inputValidation } from './rp.messages';
import { ResetPasswordModal } from '../../../../models/resetPassword.modal';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  userId: string;
  loader = false;
  resetPassword: FormGroup;
  passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  rpUserMessage = userMessages;
  rpInputMessage = inputValidation;
  passwordMissMatch = false;
  rpModal = new ResetPasswordModal();
  userInfo: any;
  responseHandling = { status: false, response: "" };

  constructor(
    private routerOutlet: RouterOutlet,
    private formBuilder: FormBuilder,
    private router: Router,
    private core: CoreService,
    private rpService: AuthService,
    private route: ActivatedRoute
  ) {
    this.userId = route.snapshot.params['id'];
  }

  ngOnInit() {
    // this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    // this.userInfo = JSON.parse(window.localStorage['userInfo']);
    this.core.clearUser();

    this.resetPassword = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.pattern(this.passwordRegex), Validators.required, Validators.minLength(8)])]
    });
  }

  onSubmit() {
    if (this.userId) {
      this.loader = true;
      if (this.resetPassword.controls.newPassword.value !== this.resetPassword.controls.confirmPassword.value) {
        this.passwordMissMatch = true;
        this.loader = false;
      } else {
        this.passwordMissMatch = false;
        this.responseHandling.status = false;
        this.rpModal.id = this.userId;
        this.rpModal.password = this.resetPassword.controls.confirmPassword.value;
        this.rpService.resetPassword(this.rpModal).subscribe(res => {
          this.loader = false;
          this.responseHandling.status = true;
          this.responseHandling.response = res;
          this.core.message.success(this.rpUserMessage.success);
          this.router.navigateByUrl('/login');
        });
      }
    }
  }
}

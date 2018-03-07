// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { UserService } from '../user.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { User, UserProfile } from '../../../../../models/user';
import { Promise } from 'q';
import { inputValidations, userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
// #endregion imports


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./../user.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserAddComponent implements OnInit {
  fG1: FormGroup;
  saveLoader: boolean;
  // #region declarations
  userId = '';
  user = new UserProfile();
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = { id: 1, type: 'success', message: '', show: false };
  errorMsgs = inputValidations;
  status = {
    category: false,
    basic: false,
    pricing: false,
    delivery: false,
    images: false,
    more: false
  };
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private userService: UserService,
    public validatorExt: ValidatorExt,
    public core: CoreService
  ) {
    this.userId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setFormValidators();
    if (this.userId) {
      this.getUserData();
    }
  }
  setFormValidators(user?: UserProfile) {
    user = user || new UserProfile();
    this.fG1 = this.formBuilder.group({
      email: this.userId ? [{ value: user.emailId, disabled: true }, []] : ['', [Validators.pattern(environment.regex.emailRegex), Validators.maxLength(250), Validators.required]],
      password: !this.userId ? [{ value: '', disabled: false }, [Validators.pattern(environment.regex.password), Validators.required]] : [{ value: null, disabled: true }, []],
      firstname: [user.firstName, [Validators.pattern(environment.regex.textRegex), Validators.maxLength(250), Validators.required]],
      lastname: [user.lastName, [Validators.pattern(environment.regex.textRegex), Validators.maxLength(250), Validators.required]],
      phone: [user.phone, [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(environment.regex.phoneNumberRegex), Validators.required]],
      role: [user.role, [Validators.pattern(environment.regex.textRegex), Validators.maxLength(250), Validators.required]],
    });
  }
  getUserData() {
    this.userService.getUser(this.userId).subscribe((res) => {
      this.user = res;
      this.setFormValidators(this.user);
    });
  }
  readForm() {
    this.user = this.user || new UserProfile();
    const model = this.fG1.controls;
    this.user.firstName = model.firstname.value;
    this.user.lastName = model.lastname.value;
    this.user.emailId = model.email.value.toLowerCase();
    this.user.phone = model.phone.value;
    this.user.role = model.role.value;
    this.user.password = model.password.value;
    this.user.roleName = ['admin'];
  }
  saveUser() {
    if (!this.fG1.valid) {
      this.core.message.info('Please complete all mandatory fields');
    } else {
      this.saveLoader = true;
      this.readForm();
      this.userService
        .save(this.user)
        .then(res => {
          if (res.user_status === 'alreadyExists') {
            this.saveLoader = false;
            this.core.message.info(userMessages.accountExist);
          } else {
            this.core.message.success(userMessages.success);
            this.saveLoader = false;
            this.router.navigateByUrl('/user-list');
          }
        })
        .catch(err => {
          console.log(err);
          this.alert = { id: 1, type: 'danger', message: 'Not able to Save', show: true };
          this.saveLoader = false;
          return false;
        });
    }
  }
}

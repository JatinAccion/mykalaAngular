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
import { inputValidations } from './messages';
// #endregion imports


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./../user.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserAddComponent implements OnInit {
  fG1: FormGroup;
  saveloader: boolean;
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
    private validatorExt: ValidatorExt
  ) {
    //this.userId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setFormValidators();
    // this.getUserData();
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      email: ['', [Validators.pattern(environment.regex.emailRegex), Validators.required]],
      password: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      roleType: ['', [Validators.required]],
    });
  }
  getUserData() {
    this.userService.get(null).subscribe((res) => {
      // return this.users = res;
    });
  }

  saveUser(): Promise<any> {
    this.saveloader = true;
    return Promise(resolve => {
      // this.userService
      //   .saveUser(this.user)
      //   .then(res => {
      //     this.userId = res.json().kalaUniqueId;
      //     this.user.kalaUniqueId = this.userId;
      //     this.alert = { id: 1, type: 'success', message: 'Saved successfully', show: true };
      //     this.saveloader = false;
      //     resolve(this.userId);
      //     return true;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.alert = { id: 1, type: 'danger', message: 'Not able to Save', show: true };
      //     this.saveloader = false;
      //     return false;
      //   });
    });
  }
}

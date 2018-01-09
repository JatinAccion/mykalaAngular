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
import { User } from '../../../../../models/user';
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
  user = new User();
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
    this.setActiveTab({ nextId: 'tab-category' });
    this.setFormValidators();
    this.getRetailersData();
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      user: [{ value: null, disabled: false }, [Validators.required]],
    });
  }
  getRetailersData() {
    this.userService.get(null).subscribe((res) => {
     // return this.users = res;
    });
  }
  selectSeller(e) {
    // if (this.user) {
    //   this.user.userId = this.user.userId;
    //   this.user.userName = this.user.businessName;
    // } else {
    //   this.user.userId = null;
    //   this.user.userName = '';
    // }
  }
  setActiveTab(event) {
    // if (!this.userId && event.nextId !== 'tab-category') { event.preventDefault(); return; }
    if (this.fG1) {
      this.fG1.controls.user.reset({ value: this.user, disabled: event.nextId !== 'tab-category' });

    }

    if (event.nextId === 'tab-delivery') {
      this.validatorExt.validateAllFormFields(this.fG1);
      if (this.fG1.invalid) {
        event.preventDefault(); return;
      }
    }
    if (!this.userId) {
      switch (event.nextId) {
        case 'tab-images':
        case 'tab-more': // event.preventDefault();
          break;
      }
    }
  }
  saveUserAndShowNext(prevTab) {
    if (prevTab === 'tab-delivery') {
      this.saveUser().then(res => {
        this.showNextTab(prevTab);
      });
    }
  }
  showNextTab(prevTab) {
    switch (prevTab) {
      case 'tab-category': this.status.category = true; this.ngbTabSet.select('tab-basic'); break;
      case 'tab-basic': this.status.basic = true; this.ngbTabSet.select('tab-pricing'); break;
      case 'tab-pricing': this.status.pricing = true; this.ngbTabSet.select('tab-delivery'); break;
      case 'tab-delivery': this.status.delivery = true; this.ngbTabSet.select('tab-images'); break;

      case 'tab-images': if (this.userId) {
        this.status.images = true; this.ngbTabSet.select('tab-more');
      } break;
      case 'tab-more': if (this.userId) {
        this.status.more = true;
        this.router.navigateByUrl('/user-list');
        break;
      }
    }
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
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

}

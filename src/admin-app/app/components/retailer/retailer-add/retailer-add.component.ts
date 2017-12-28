// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetialerService } from '../retialer.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
// #endregion imports

export interface IAlert {
  id: number;
  type: string;
  message: string;
  show: boolean;
}
@Component({
  selector: 'app-retailer-add',
  templateUrl: './retailer-add.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddComponent implements OnInit {
  // #region declarations
  currentOrientation = 'vertial';
  currentJustify = 'end';

  retailer: Retailer;
  retailerId = 1;
  @ViewChild('tabs') ngbTabSet: NgbTabset;
  alert: IAlert = {
    id: 1,
    type: 'success',
    message: '',
    show: false
  };
  status = {
    Profile: false,
    Payment: false,
    Product: false,
    Shipping: false,
    Return: false,
    Notifications: false
  };
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
    //this.retailerId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setActiveTab({ nextId: 'tab-Profile' });
  }
  setActiveTab(event) {
    if (!this.retailerId && event.nextId !== 'tab-Profile') { event.preventDefault(); return; }
  }
  showNextTab(prevTab) {
    this.alert = {
      id: 1,
      type: 'success',
      message: 'Saved successfully',
      show: true
    };
    if (this.retailerId) {
      switch (prevTab) {
        case 'tab-Profile': this.status.Profile = true; this.ngbTabSet.select('tab-Payment'); break;
        case 'tab-Payment': this.status.Payment = true; this.ngbTabSet.select('tab-Product'); break;
        case 'tab-Product': this.status.Product = true; this.ngbTabSet.select('tab-Shipping'); break;
        case 'tab-Shipping': this.status.Shipping = true;
          // this.ngbTabSet.select('tab-Return');
          break;
        case 'tab-Return': this.status.Return = true; this.ngbTabSet.select('tab-Notifications'); break;
        case 'tab-Notifications': this.status.Notifications = true;
          // this.router.navigateByUrl('/retailer-list'); 
          break;
      }
    }
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }
}

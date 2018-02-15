// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { OrderService } from '../order.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { Order } from '../../../../../models/order';
import { Promise } from 'q';
import { inputValidations } from './messages';
// #endregion imports


@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderAddComponent implements OnInit {
  fG1: FormGroup;
  saveLoader: boolean;
  // #region declarations
  orderId = '';
  order = new Order();
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
    private orderService: OrderService,
    public validatorExt: ValidatorExt
  ) {
    //this.orderId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setActiveTab({ nextId: 'tab-category' });
    this.setFormValidators();
    this.getRetailersData();
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      order: [{ value: null, disabled: false }, [Validators.required]],
    });
  }
  getRetailersData() {
    this.orderService.get(null).subscribe((res) => {
     // return this.orders = res;
    });
  }
  selectSeller(e) {
    // if (this.order) {
    //   this.order.orderId = this.order.orderId;
    //   this.order.orderName = this.order.businessName;
    // } else {
    //   this.order.orderId = null;
    //   this.order.orderName = '';
    // }
  }
  setActiveTab(event) {
    // if (!this.orderId && event.nextId !== 'tab-category') { event.preventDefault(); return; }
    if (this.fG1) {
      this.fG1.controls.order.reset({ value: this.order, disabled: event.nextId !== 'tab-category' });

    }

    if (event.nextId === 'tab-delivery') {
      this.validatorExt.validateAllFormFields(this.fG1);
      if (this.fG1.invalid) {
        event.preventDefault(); return;
      }
    }
    if (!this.orderId) {
      switch (event.nextId) {
        case 'tab-images':
        case 'tab-more': // event.preventDefault();
          break;
      }
    }
  }
  saveOrderAndShowNext(prevTab) {
    if (prevTab === 'tab-delivery') {
      this.saveOrder().then(res => {
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

      case 'tab-images': if (this.orderId) {
        this.status.images = true; this.ngbTabSet.select('tab-more');
      } break;
      case 'tab-more': if (this.orderId) {
        this.status.more = true;
        this.router.navigateByUrl('/order-list');
        break;
      }
    }
  }
  saveOrder(): Promise<any> {
    this.saveLoader = true;
    return Promise(resolve => {
      // this.orderService
      //   .saveOrder(this.order)
      //   .then(res => {
      //     this.orderId = res.json().kalaUniqueId;
      //     this.order.kalaUniqueId = this.orderId;
      //     this.alert = { id: 1, type: 'success', message: 'Saved successfully', show: true };
      //     this.saveLoader = false;
      //     resolve(this.orderId);
      //     return true;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.alert = { id: 1, type: 'danger', message: 'Not able to Save', show: true };
      //     this.saveLoader = false;
      //     return false;
      //   });
    });
  }
  closeAlert(alert: IAlert) {
    this.alert.show = false;
  }

}

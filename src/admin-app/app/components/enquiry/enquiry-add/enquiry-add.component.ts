// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { EnquiryService } from '../enquiry.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { IAlert } from '../../../../../models/IAlert';
import { Enquiry } from '../../../../../models/enquiry';
import { Promise } from 'q';
import { inputValidations } from './messages';
// #endregion imports


@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./../enquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class EnquiryAddComponent implements OnInit {
  fG1: FormGroup;
  saveloader: boolean;
  // #region declarations
  enquiryId = '';
  enquiry = new Enquiry();
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
    private enquiryService: EnquiryService,
    private validatorExt: ValidatorExt
  ) {
    //this.enquiryId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.setActiveTab({ nextId: 'tab-category' });
    this.setFormValidators();
    this.getRetailersData();
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      enquiry: [{ value: null, disabled: false }, [Validators.required]],
    });
  }
  getRetailersData() {
    this.enquiryService.get(null).subscribe((res) => {
     // return this.enquirys = res;
    });
  }
  selectSeller(e) {
    // if (this.enquiry) {
    //   this.enquiry.enquiryId = this.enquiry.enquiryId;
    //   this.enquiry.enquiryName = this.enquiry.businessName;
    // } else {
    //   this.enquiry.enquiryId = null;
    //   this.enquiry.enquiryName = '';
    // }
  }
  setActiveTab(event) {
    // if (!this.enquiryId && event.nextId !== 'tab-category') { event.preventDefault(); return; }
    if (this.fG1) {
      this.fG1.controls.enquiry.reset({ value: this.enquiry, disabled: event.nextId !== 'tab-category' });

    }

    if (event.nextId === 'tab-delivery') {
      this.validatorExt.validateAllFormFields(this.fG1);
      if (this.fG1.invalid) {
        event.preventDefault(); return;
      }
    }
    if (!this.enquiryId) {
      switch (event.nextId) {
        case 'tab-images':
        case 'tab-more': // event.preventDefault();
          break;
      }
    }
  }
  saveEnquiryAndShowNext(prevTab) {
    if (prevTab === 'tab-delivery') {
      this.saveEnquiry().then(res => {
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

      case 'tab-images': if (this.enquiryId) {
        this.status.images = true; this.ngbTabSet.select('tab-more');
      } break;
      case 'tab-more': if (this.enquiryId) {
        this.status.more = true;
        this.router.navigateByUrl('/enquiry-list');
        break;
      }
    }
  }
  saveEnquiry(): Promise<any> {
    this.saveloader = true;
    return Promise(resolve => {
      // this.enquiryService
      //   .saveEnquiry(this.enquiry)
      //   .then(res => {
      //     this.enquiryId = res.json().kalaUniqueId;
      //     this.enquiry.kalaUniqueId = this.enquiryId;
      //     this.alert = { id: 1, type: 'success', message: 'Saved successfully', show: true };
      //     this.saveloader = false;
      //     resolve(this.enquiryId);
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

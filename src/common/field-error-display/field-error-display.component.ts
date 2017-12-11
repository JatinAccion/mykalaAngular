import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidatorExt } from '../ValidatorExtensions';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FieldErrorDisplayComponent implements OnInit {
  @Input() errorMsg: any;
  @Input() field: any;
  constructor(private validatorExt: ValidatorExt) { }
  getHasRequired() {
    return this.validatorExt.hasRequiredField(this.field);
  }
  getRequiredMsg() {
    const name = this.validatorExt.getControlName(this.field);
    const errorMsg = this.errorMsg[name];
    if (errorMsg && errorMsg.required) {
      return errorMsg.required;
    } else { return `Please enter the ${name}`; }
  }
  getErrorMsg() {
    const name = this.validatorExt.getControlName(this.field);
    const errorMsg = this.errorMsg[name];
    if (errorMsg && errorMsg.error) {
      return errorMsg.error;
    } else { return `Please enter the valid ${name}`; }
  }
  ngOnInit() {
  }
}

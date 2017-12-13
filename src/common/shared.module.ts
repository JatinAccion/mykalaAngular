import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { CommonModule } from '@angular/common';
import { ValidatorExt } from './ValidatorExtensions';

@NgModule({
    imports: [CommonModule, BrowserModule],
    declarations: [FieldErrorDisplayComponent],
    exports: [FieldErrorDisplayComponent],
    providers: [ValidatorExt]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { CommonModule } from '@angular/common';
import { ValidatorExt } from './ValidatorExtensions';
import { InputMaskDirective } from './input-mask.directive';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule],
    declarations: [FieldErrorDisplayComponent, InputMaskDirective],
    exports: [FieldErrorDisplayComponent, InputMaskDirective],
    providers: [ValidatorExt]
})
export class SharedModule { }

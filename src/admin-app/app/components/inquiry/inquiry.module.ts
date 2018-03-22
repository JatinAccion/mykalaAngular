import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InquiryRoutingModule } from './inquiry-routing.module';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { InquiryAddComponent } from './inquiry-add/inquiry-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InquiryService } from './inquiry.service';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    InquiryRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule
  ],
  declarations: [
    InquiryListComponent,
    InquiryAddComponent,
  ],
  providers: [InquiryService, ValidatorExt]
})
export class InquiryModule { }

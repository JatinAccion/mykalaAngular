import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EnquiryRoutingModule } from './enquiry-routing.module';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EnquiryService } from './enquiry.service';

import { ValidatorExt } from '../../../../common/ValidatorExtensions';
import { SharedModule } from '../../../../common/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    EnquiryRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule
  ],
  declarations: [
    EnquiryListComponent,
    EnquiryAddComponent,
  ],
  providers: [EnquiryService, ValidatorExt]
})
export class EnquiryModule { }

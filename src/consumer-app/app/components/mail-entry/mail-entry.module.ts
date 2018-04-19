import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../../../../common/shared.module';
import { MailProductComponent } from './mail-components/mail-product.component';
import { MailMyaccountComponent } from './mail-components/mail-myaccount.component';
import { MailLeaveReviewComponent } from './mail-components/mail-leavereview.component';
import { MailTrackOrderComponent } from './mail-components/mail-trackorder.component';
import { MailMyoffersComponent } from './mail-components/mail-myoffers.component';
import { MailChangeNotificationComponent } from './mail-components/mail-changenotification.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule, FormsModule, HttpClientModule,
  ],
  declarations: [
    MailProductComponent,
    MailMyaccountComponent,
    MailLeaveReviewComponent,
    MailTrackOrderComponent,
    MailMyoffersComponent,
    MailChangeNotificationComponent
  ],
  providers: []
})
export class MailEntryModule { }

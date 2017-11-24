import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RetailerRoutingModule } from './retailer-routing.module';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerEditComponent } from './retailer-edit/retailer-edit.component';
import { RetailerAddComponent } from './retailer-add/retailer-add.component';

@NgModule({
  imports: [
    CommonModule,
    RetailerRoutingModule,
    NgbModule
  ],
  declarations: [RetailerListComponent, RetailerEditComponent, RetailerAddComponent]
})
export class RetailerModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { CommonModule } from '@angular/common';
import { ValidatorExt } from './ValidatorExtensions';
import { InputMaskDirective } from './input-mask.directive';
import { MemberTileComponent } from '../admin-app/app/components/tile/member/member.component';
import { RetailerTileComponent } from '../admin-app/app/components/tile/retailer/retailer.component';
import { SortableColumnComponent } from './sortable/sortable-column.component';
import { SortableTableDirective } from './sortable/sortable-table.directive';
import { SortService } from './sortable/sort.service';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, RouterModule],
    declarations: [FieldErrorDisplayComponent, InputMaskDirective, MemberTileComponent, RetailerTileComponent, SortableColumnComponent, SortableTableDirective],
    exports: [FieldErrorDisplayComponent, InputMaskDirective, MemberTileComponent, RetailerTileComponent, SortableColumnComponent, SortableTableDirective],
    providers: [ValidatorExt, SortService]
})
export class SharedModule { }

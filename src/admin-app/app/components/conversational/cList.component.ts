import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { CuiComponent, MsgDirection } from './cui.interface';
import { Conversation } from '../../models/conversation';

@Component({
    selector: 'cList',
    template: `
                <div class="">
                    <div *ngFor="let item of data.data" class="btn btn_red_right m-2  " (click)="onClick(item)" >
                        {{item}}
                    </div>
                </div>`,
    encapsulation: ViewEncapsulation.None
})
export class cListComponent implements OnInit, CuiComponent {
    @Input() data: any;
    @Output() clicked = new EventEmitter<Conversation>();
    constructor() {
    }
    ngOnInit() {
    }
    onClick(item: string) {
        this.clicked.emit(new Conversation(MsgDirection.In, item));
    }

}

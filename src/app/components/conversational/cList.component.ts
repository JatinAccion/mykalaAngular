import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CuiComponent } from './cui.interface';

@Component({
    selector: 'cList',
    template: `
                <div class="row">
                <div *ngFor="let item of data.data" class="col-md-3 border border-success rounded mx-1" >
                    {{item}}
                </div>
                </div>`,
    encapsulation: ViewEncapsulation.None
})
export class cListComponent implements OnInit, CuiComponent {
    @Input() data: any;
    constructor() { 
        console.log(this.data);
    }
    ngOnInit() {
        console.log(this.data);
    }

}

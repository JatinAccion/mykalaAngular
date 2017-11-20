import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CuiComponent } from '../conversational/cui.interface';

@Component({
  selector: 'app-usrename',
  templateUrl: './usrename.component.html',
  styleUrls: ['./usrename.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsrenameComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onClick(item: string) {
    this.clicked.emit(item);
  }
}

import { Component, OnInit, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import { CuiComponent } from '../conversational/cui.interface';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onClick(item: string) {
    this.clicked.emit(item);
  }
}

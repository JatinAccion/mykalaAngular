import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-getoffers',
  templateUrl: './getoffers.component.html',
  styleUrls: ['./getoffers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GetoffersComponent implements OnInit {

  constructor(private core: CoreService) { }

  ngOnInit() {
    this.core.searchMsgToggle();
  }

}

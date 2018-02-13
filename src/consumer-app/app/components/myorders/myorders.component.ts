import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOrdersService } from '../../services/myorder.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyordersComponent implements OnInit {
  
  constructor(
    private core: CoreService,
    private myOrder: MyOrdersService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
  }

}

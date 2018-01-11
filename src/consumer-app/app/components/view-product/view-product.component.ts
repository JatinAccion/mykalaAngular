import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProductComponent implements OnInit {

  constructor(private core: CoreService) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.core.hide();
    this.core.searchMsgToggle();
    if (window.localStorage['token'] == undefined) this.core.clearUser();
  }

}

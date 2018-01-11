import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProductComponent implements OnInit {
  selectedProduct: any;
  loader: boolean = false;
  constructor(private core: CoreService) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.core.hide();
    this.core.searchMsgToggle();
    if (window.localStorage['selectedProduct'] != undefined) this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']);
    setTimeout(function () {
      var carouselItem = document.getElementsByClassName("carousel-item")[0] as HTMLElement;
      var listInlineItem = document.getElementsByClassName("list-inline-item")[0] as HTMLElement;
      carouselItem.classList.add("active");
      listInlineItem.classList.add("active");
    }, 1000);
  }

}

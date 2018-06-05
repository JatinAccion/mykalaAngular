import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-browse-product',
  templateUrl: './elastic-search-result.component.html',
  styleUrls: ['./elastic-search-result.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ElasticSearchResult implements OnInit, OnDestroy {
  s3 = environment.s3
  tilesData = [];
  loader: boolean = false;
  productListingModal = new BrowseProductsModal();
  headerMessage: string;

  constructor(
    private homeService: HomeService,
    public core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    this.core.headerScroll();
    this.core.hide();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    if (window.localStorage['esKeyword'] != undefined) this.core.search(window.localStorage['esKeyword']);
    this.core.esKey.subscribe(p => {
      this.loader = true;
      for (var i = 0; i < p.length; i++) {
        let productStatus = p[i].product.productStatus
        if (productStatus) this.tilesData.push(p)
      }
      this.loader = false;
      if (this.tilesData.length > 0) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + ' for you';
      else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
      this.core.show(this.headerMessage);
      window.localStorage['browseProductSearch'] = this.headerMessage;
    }, (err) => {
      this.loader = false;
    });
  }

  ngOnDestroy() {
    window.localStorage['esKeyword'] = this.core.searchBar;
    this.core.searchBar = "";
  }

  viewDetails(tile) {
    window.localStorage['selectedProduct'] = JSON.stringify(tile);
    this.route.navigateByUrl("/view-product");
    window.localStorage['fromES'] = true;
    window.localStorage['esKeyword'] = this.core.searchBar;
  }

}

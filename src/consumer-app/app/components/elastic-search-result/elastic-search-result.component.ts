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
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    if (window.localStorage['esKeyword'] != undefined) this.core.search(window.localStorage['esKeyword']);
    this.core.esKey.subscribe(p => {
      this.loader = true;
      this.tilesData = p;
      this.loader = false;
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

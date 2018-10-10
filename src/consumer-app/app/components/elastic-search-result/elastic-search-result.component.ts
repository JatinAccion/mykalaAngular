import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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
export class ElasticSearchResult implements OnInit, AfterViewInit {
  selectedTilesData: any;
  s3 = environment.s3
  tilesData = [];
  loader: boolean = false;
  productListingModal = new BrowseProductsModal();
  headerMessage: string;
  showMoreBtn: boolean = false;
  callAPILoop: number = 1;

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
    this.core.pageLabel();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    if (window.localStorage['esKeyword'] != undefined) {
      let text = JSON.parse(window.localStorage['esKeyword']).text;
      let parentName = JSON.parse(window.localStorage['esKeyword']).parentName;
      this.core.search(text, parentName);
    }
    this.core.esKey.subscribe(p => {
      if (this.callAPILoop == 1) {
        this.filterResponse(p);
        this.callAPILoop = 0;
      }
    }, (err) => {
      this.loader = false;
    });
  }

  ngAfterViewInit() {
    window.localStorage['esKeyword'] = this.core.searchBar;
    this.core.searchBar = "";
  }

  filterResponse(res) {
    this.loader = false;
    this.tilesData = res.filter(item => {
      if (item.product.productStatus) return new BrowseProductsModal(item.product)
    });
    this.filterIamgeURL();
    this.getMainImage();
    if (this.tilesData.length > 0) {
      if (this.tilesData.length == 1) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' product for you';
      else this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' products for you';
    }
    else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
    this.core.show(this.headerMessage);
    this.core.searchMsgToggle('get offers');
    window.localStorage['browseProductSearch'] = this.headerMessage;
    return false;
  }

  filterIamgeURL() {
    for (var i = 0; i < this.tilesData.length; i++) {
      for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
        let product = this.tilesData[i].product.productImages[j];
        if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
          this.tilesData[i].product.productImages[j].location = this.s3 + product.location;
        }
        if (product.location.indexOf('maxHeight') > -1) {
          this.tilesData[i].product.productImages[j].location = product.location.split(";")[0];
        }
      }
    }
  }

  getMainImage() {
    for (var i = 0; i < this.tilesData.length; i++) {
      for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
        let product = this.tilesData[i].product.productImages[j]
        if (product.mainImage == true) {
          this.tilesData[i].product.mainImageSrc = product.location
        }
      }
    }
  }

  viewDetails(tile) {
    window.localStorage['selectedProduct'] = JSON.stringify(tile);
    this.route.navigateByUrl("/view-product");
    window.localStorage['fromES'] = true;
  }

}

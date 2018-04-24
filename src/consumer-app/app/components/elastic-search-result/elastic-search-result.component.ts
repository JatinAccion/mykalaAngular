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
export class ElasticSearchResult implements OnInit {
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
    this.core.esKey.subscribe(p => {
      this.loader = true;
      this.tilesData = p;
      this.loader = false;
    });
  }

  viewDetails(tile) {
    let updateStorage = JSON.parse(window.localStorage['levelSelections']);
    updateStorage.subType.id = tile.product.kalaUniqueId;
    updateStorage.subType.name = tile.product.productName;
    updateStorage.subType.text = tile.product.productName;
    updateStorage.subType.level = "5";
    updateStorage.subType.imgUrl = tile.product.mainImageSrc;
    window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
    window.localStorage['selectedProduct'] = JSON.stringify(tile);
    this.route.navigateByUrl("/view-product")
  }

}

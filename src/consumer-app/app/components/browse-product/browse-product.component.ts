import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';

@Component({
  selector: 'app-browse-product',
  templateUrl: './browse-product.component.html',
  styleUrls: ['./browse-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BrowseProductComponent implements OnInit {
  @Input() selectedTilesData: any;
  tilesData = [];
  subCategory = [];
  categoryList = [];
  loader: boolean = false;
  loaderCategory: boolean;
  loadersubCategory: boolean;
  @Output() selectTile = new EventEmitter<any>();
  headerMessage: string;
  showSubMenu: boolean;
  selectedCategoryData: any;
  getOffersData;
  productListingModal = new BrowseProductsModal();
  constructor(private homeService: HomeService, private core: CoreService, private route: Router) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    if (window.localStorage['getOffers'] != undefined) {
      this.getOffersData = JSON.parse(window.localStorage['getOffers']);
      this.loadOffersData();
    }
    else this.loadTypes();
    this.core.pageLabel();
  }

  loadTypes() {
    this.loader = true;
    this.tilesData = [];
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    this.homeService.getProductList(this.selectedTilesData.place.name, this.selectedTilesData.category.name, this.selectedTilesData.subcategory.name).subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.content.length; i++) {
        this.productListingModal = new BrowseProductsModal();
        this.productListingModal.product.productImages = new Array<any>();
        let content = res.content[i];
        this.productListingModal.deliveryMethod = '',
          this.productListingModal.retailerName = '',
          this.productListingModal.retailerReturns = '',
          this.productListingModal.product.brandName = content.brandName,
          this.productListingModal.product.createdDate = content.createdDate,
          this.productListingModal.product.kalaPrice = content.kalaPrice,
          this.productListingModal.product.kalaUniqueId = content.kalaUniqueId,
          this.productListingModal.product.productActivatedDate = content.productActivatedDate,
          this.productListingModal.product.productCategoryName = content.productCategoryName,
          this.productListingModal.product.productDescription = content.productDescription,
          this.productListingModal.product.productName = content.productName,
          this.productListingModal.product.productPlaceName = content.productPlaceName,
          this.productListingModal.product.productSkuCode = content.productSkuCode,
          this.productListingModal.product.productStatus = content.productStatus,
          this.productListingModal.product.productSubCategoryName = content.productSubCategoryName,
          this.productListingModal.product.productTypeName = content.productTypeName,
          this.productListingModal.product.productUpcCode = content.productUpcCode,
          this.productListingModal.product.quantity = content.quantity,
          this.productListingModal.product.retailPrice = content.retailPrice,
          this.productListingModal.product.retailerId = content.retailerId,
          this.productListingModal.product.shipProfileId = content.shipProfileId,
          this.productListingModal.product.productImages = content.productImages;
        this.tilesData.push(this.productListingModal);
      }
      this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + this.selectedTilesData.subcategory.name + ' for you';
      this.core.show(this.headerMessage);
      this.core.searchMsgToggle('get offers');
      window.localStorage['browseProductSearch'] = this.headerMessage;
    });
  }

  loadOffersData() {
    this.loader = false;
    this.tilesData = [];
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    for (var i = 0; i < this.getOffersData.length; i++) {
      this.productListingModal = new BrowseProductsModal();
      this.productListingModal.product.productImages = new Array<any>();
      let content = this.getOffersData[i];
      this.productListingModal.deliveryMethod = content.deliveryMethod,
        this.productListingModal.retailerName = content.retailerName,
        this.productListingModal.retailerReturns = content.retailerReturns,
        this.productListingModal.product.brandName = content.product.brandName,
        this.productListingModal.product.createdDate = content.product.createdDate,
        this.productListingModal.product.kalaPrice = content.product.kalaPrice,
        this.productListingModal.product.kalaUniqueId = content.product.kalaUniqueId,
        this.productListingModal.product.productActivatedDate = content.product.productActivatedDate,
        this.productListingModal.product.productCategoryName = content.product.productCategoryName,
        this.productListingModal.product.productDescription = content.product.productDescription,
        this.productListingModal.product.productName = content.product.productName,
        this.productListingModal.product.productPlaceName = content.product.productPlaceName,
        this.productListingModal.product.productSkuCode = content.product.productSkuCode,
        this.productListingModal.product.productStatus = content.product.productStatus,
        this.productListingModal.product.productSubCategoryName = content.product.productSubCategoryName,
        this.productListingModal.product.productTypeName = content.product.productTypeName,
        this.productListingModal.product.productUpcCode = content.product.productUpcCode,
        this.productListingModal.product.quantity = content.product.quantity,
        this.productListingModal.product.retailPrice = content.product.retailPrice,
        this.productListingModal.product.retailerId = content.product.retailerId,
        this.productListingModal.product.shipProfileId = content.product.shipProfileId,
        this.productListingModal.product.productImages = content.product.productImages;
      this.tilesData.push(this.productListingModal);
    }
    this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + this.selectedTilesData.subcategory.name + ' for you';
    this.core.show(this.headerMessage);
    this.core.searchMsgToggle('get offers');
  }

  openNav() {
    this.categoryList = [];
    this.loaderCategory = true;
    document.getElementById("mySidenav").style.width = "300px";
    this.homeService.getTilesCategory(this.selectedTilesData.place.id).subscribe(res => {
      this.loaderCategory = false;
      for (var i = 0; i < res.length; i++) this.categoryList.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2"));
    });
  };

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
  };

  loadSubcategory(e, object) {
    this.loadersubCategory = true;
    this.selectedCategoryData = object;
    this.subCategory = [];
    e.currentTarget.nextElementSibling.style.display = 'block';
    //If Previous Siblings is Present
    if (e.currentTarget.parentElement.parentElement.previousElementSibling.className == 'category_tiles') {
      e.currentTarget.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.style.display = 'none';
    }
    //If Next Siblings is Present
    if (e.currentTarget.parentElement.parentElement.nextElementSibling == null) { }
    else e.currentTarget.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.display = 'none';

    this.homeService.getTilesSubCategory(object.id).subscribe(res => {
      this.loadersubCategory = false;
      for (var i = 0; i < res.length; i++) this.subCategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
    });
  };

  refreshSubcategory(subcategory) {
    let updateStorage = JSON.parse(window.localStorage['levelSelections']);
    updateStorage.subcategory.id = subcategory.id;
    updateStorage.subcategory.name = subcategory.name;
    updateStorage.subcategory.text = subcategory.text;
    updateStorage.category.id = this.selectedCategoryData.id;
    updateStorage.category.name = this.selectedCategoryData.name;
    updateStorage.category.text = this.selectedCategoryData.text;
    window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
    this.subCategory = [];
    this.closeNav();
    this.loadTypes();
  };

  viewDetails(tile) {
    let updateStorage = JSON.parse(window.localStorage['levelSelections']);
    updateStorage.subType.id = tile.product.kalaUniqueId;
    updateStorage.subType.name = tile.product.productName;
    updateStorage.subType.text = tile.product.productName;
    updateStorage.subType.level = "5";
    updateStorage.subType.imgUrl = tile.product.productImages[0].imageUrl;
    window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
    window.localStorage['selectedProduct'] = JSON.stringify(tile);
    this.route.navigateByUrl("/view-product")
  }

}

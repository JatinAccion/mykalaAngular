import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-browse-product',
  templateUrl: './browse-product.component.html',
  styleUrls: ['./browse-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BrowseProductComponent implements OnInit {
  s3 = environment.s3
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
  constructor(private homeService: HomeService, public core: CoreService, private route: Router) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    this.core.headerScroll();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    this.loadTypes();
    this.core.pageLabel();
  }

  /*Sequential Search Result*/
  loadTypes() {
    this.loader = true;
    this.tilesData = [];
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    this.homeService.getProductList(this.selectedTilesData.place.name, this.selectedTilesData.category.name, this.selectedTilesData.subcategory.name).subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.content.length; i++) {
        let content = res.content[i];
        this.productListingModal = new BrowseProductsModal(content);
        if (this.productListingModal.product.productStatus != false) this.tilesData.push(this.productListingModal);
      }
      this.filterIamgeURL();
      this.getMainImage();
      if (this.tilesData.length > 0) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + this.selectedTilesData.category.name + ' for you';
      else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
      if (this.selectedTilesData.subcategory.length == undefined) {
        if (this.tilesData.length > 0) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + this.selectedTilesData.subcategory.name + ' for you';
        else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
      }
      this.core.show(this.headerMessage);
      this.core.searchMsgToggle('get offers');
      window.localStorage['browseProductSearch'] = this.headerMessage;
    });
  }

  filterIamgeURL() {
    for (var i = 0; i < this.tilesData.length; i++) {
      for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
        let product = this.tilesData[i].product.productImages[j];
        if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
          this.tilesData[i].product.productImages[j].location = this.s3 + product.location;
        }
      }
    }
  }

  getMainImage() {
    for (var i = 0; i < this.tilesData.length; i++) {
      for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
        let product = this.tilesData[i].product.productImages[j]
        if (product.mainImage == true) this.tilesData[i].product.mainImageSrc = product.location
      }
    }
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
    updateStorage.subcategory = subcategory;
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
    updateStorage.subType.imgUrl = tile.product.mainImageSrc;
    window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
    window.localStorage['selectedProduct'] = JSON.stringify(tile);
    this.route.navigateByUrl("/view-product")
  }

}

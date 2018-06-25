import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { environment } from '../../../environments/environment';
import { element } from 'protractor';

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
  showMorePageCounter = 0;
  showMoreSizeCounter = 30;
  showMoreBtn: boolean = false;
  showFilterPanel: boolean = false;
  filterModalAPI = { "fieldValues": [] };
  filterSubcategoryData = [];
  filterSelectedSubcategory = [];
  toStr = JSON.stringify;
  filterTypeData_1 = [];
  filterSelectedType_1 = [];
  filterTypeData_2 = [];
  filterSelectedType_2 = [];
  filterTypeData_3 = [];
  filterSelectedType_3 = [];
  idsSubcatProd = [];
  idsTypeProd_1 = [];
  idsTypeProd_2 = [];
  idsTypeProd_3 = [];
  showSubCategoryFilter: boolean = false;
  showTypeFilter1: boolean = false;
  showTypeFilter2: boolean = false;
  showTypeFilter3: boolean = false;
  resetSubcategory = null;
  resetType_1 = null;
  resetType_2 = null;
  resetType_3 = null;

  constructor(private homeService: HomeService, public core: CoreService, private route: Router) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    localStorage.removeItem('GetOfferPrice');
    this.core.headerScroll();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    this.loadTypes(undefined);
    this.core.pageLabel();
    this.loadFilterPanelSubcategory();
    this.showSubCategoryFilter = true;
  }

  /*Sequential Search Result*/
  loadTypes(from?: any) {
    this.loader = true;
    if (from == undefined) this.tilesData = [];
    else this.showMorePageCounter++;
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    this.homeService.getProductList(this.selectedTilesData.place.name, this.selectedTilesData.category.name, this.showMorePageCounter, this.showMoreSizeCounter, this.selectedTilesData.subcategory.name).subscribe(res => {
      this.filterResponse(res);
    });
  }

  filterResponse(res) {
    if (res.content.length < 30) this.showMoreBtn = false;
    else this.showMoreBtn = true;
    this.loader = false;
    for (var i = 0; i < res.content.length; i++) {
      let content = res.content[i];
      this.productListingModal = new BrowseProductsModal(content);
      if (this.productListingModal.product.productStatus != false) this.tilesData.push(this.productListingModal);
    }
    this.filterIamgeURL();
    this.getMainImage();
    if (this.tilesData.length > 0) {
      if (this.tilesData.length == 1) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' product for you';
      else this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' products for you';
    }
    else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
    if (this.selectedTilesData.subcategory.length == undefined) {
      if (this.tilesData.length > 0) {
        if (this.tilesData.length == 1) this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' product for you';
        else this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' products for you';
      }
      else this.headerMessage = 'Sorry, but we don\'t have product matches for you';
    }
    this.core.show(this.headerMessage);
    this.core.searchMsgToggle('get offers');
    window.localStorage['browseProductSearch'] = this.headerMessage;
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

  openNav() {
    this.categoryList = [];
    this.loaderCategory = true;
    document.getElementById("mySidenav").style.width = "300px";
    this.homeService.getTilesCategory(this.selectedTilesData.place.id).subscribe(res => {
      this.loaderCategory = false;
      for (var i = 0; i < res.length; i++) this.categoryList.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", "", "", "", false));
    });
  };

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
  };

  loadSubcategory(e, object) {
    this.loadersubCategory = true;
    this.selectedCategoryData = object;
    this.subCategory = [];
    for (var i = 0; i < this.categoryList.length; i++) this.categoryList[i].expanded = false;
    object.expanded = true;
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

  enableFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  /*Call to load the Subcategory data under Filter Panel*/
  loadFilterPanelSubcategory() {
    let categoryId = this.selectedTilesData.category.id;
    this.filterModalAPI.fieldValues.push(categoryId);
    this.homeService.filterLoadSubcategory(this.filterModalAPI).subscribe((res) => {
      this.filterSubcategoryData = res;
    }, (err) => {
      console.log(err)
    })
  }
  /*Call to load the Subcategory data under Filter Panel*/

  /*Call to load the Type data under Filter Panel*/
  loadFilterPanelTypes(from) {
    this.homeService.filterLoadType(this.filterModalAPI).subscribe((res) => {
      if (from == 'type_1') this.filterTypeData_2 = res;
      else if (from == 'type_2') this.filterTypeData_3 = res;
      else this.filterTypeData_1 = res;
    }, (err) => {
      console.log(err)
    })
  }
  /*Call to load the Type data under Filter Panel*/

  /*Select Change Function*/
  loadFilterData(data, from) {
    var data = JSON.parse(data);
    if (from == 'subCategory') {
      if (data.nextLevelProductTypeStatus) {
        this.showTypeFilter1 = true;
        this.showTypeFilter2 = false;
        this.showTypeFilter3 = false;
        this.filterModalAPI.fieldValues = [];
        this.filterModalAPI.fieldValues.push(data.subCategoryId);
        this.loadFilterPanelTypes('subCategory');
      }
      else {
        this.showTypeFilter1 = false;
        this.showTypeFilter2 = false;
        this.showTypeFilter3 = false;
      }
      this.idsSubcatProd.push(data.subCategoryId);
      this.filterSelectedSubcategory.push(data);
      this.loadProductsParellel(this.idsSubcatProd);
    }
    else if (from == 'type_1') {
      if (data.nextLevelProductTypeStatus) {
        this.showTypeFilter2 = true;
        this.showTypeFilter3 = false;
        this.filterModalAPI.fieldValues = [];
        this.filterModalAPI.fieldValues.push(data.productTypeId);
        this.loadFilterPanelTypes('type_1');
      }
      else {
        this.showTypeFilter2 = false;
        this.showTypeFilter3 = false;
      }
      this.idsTypeProd_1.push(data.productTypeId);
      this.filterSelectedType_1.push(data);
      this.loadProductsParellel(this.idsTypeProd_1);
    }
    else if (from == 'type_2') {
      if (data.nextLevelProductTypeStatus) {
        this.showTypeFilter3 = true;
        this.filterModalAPI.fieldValues = [];
        this.filterModalAPI.fieldValues.push(data.productTypeId);
        this.loadFilterPanelTypes('type_2');
      }
      else this.showTypeFilter3 = false;
      this.idsTypeProd_2.push(data.productTypeId);
      this.filterSelectedType_2.push(data);
      this.loadProductsParellel(this.idsTypeProd_2);
    }
    else if (from == 'type_3') {
      this.idsTypeProd_3.push(data.productTypeId);
      this.filterSelectedType_3.push(data);
      this.loadProductsParellel(this.idsTypeProd_3);
    }
  }
  /*Select Change Function*/

  /*Select Change Function - Loading New Products Based on Ids*/
  loadProductsParellel(ids) {
    this.homeService.loadProductFromFilter(ids).subscribe((res) => {
      this.tilesData = [];
      this.filterResponse(res);
    }, (err) => {
      console.log(err)
    })
  }
  /*Select Change Function - Loading New Products Based on Ids*/

  /*Uncheck the selected Subcategory or Type and reload the product*/
  deleteFilterData(data, from) {
    if (from == 'subCategory') {
      for (var i = 0; i < this.idsSubcatProd.length; i++) {
        if (this.idsSubcatProd[i] == data.subCategoryId) {
          this.idsSubcatProd.splice(i, 1);
        }
      }
      for (var i = 0; i < this.filterSelectedSubcategory.length; i++) {
        if (this.filterSelectedSubcategory[i].subCategoryId == data.subCategoryId) {
          this.filterSelectedSubcategory.splice(i, 1);
        }
      }
      this.loadProductsParellel(this.idsSubcatProd);
    }
    else if (from == 'type_1') {
      for (var i = 0; i < this.idsTypeProd_1.length; i++) {
        if (this.idsTypeProd_1[i] == data.productTypeId) {
          this.idsTypeProd_1.splice(i, 1);
        }
      }
      for (var i = 0; i < this.filterSelectedType_1.length; i++) {
        if (this.filterSelectedType_1[i].productTypeId == data.productTypeId) {
          this.filterSelectedType_1.splice(i, 1);
        }
      }
      if (this.filterSelectedType_1.length == 0) {
        this.resetType_1 = null;
        this.idsTypeProd_2 = [];
        this.idsTypeProd_3 = [];
        this.filterSelectedType_2 = [];
        this.filterSelectedType_3 = [];
        this.filterTypeData_2 = [];
        this.filterTypeData_3 = [];
        this.showTypeFilter2 = false;
        this.showTypeFilter3 = false;
        this.loadProductsParellel(this.idsSubcatProd);
      }
      else this.loadProductsParellel(this.idsTypeProd_1);
    }
    else if (from == 'type_2') {
      for (var i = 0; i < this.idsTypeProd_2.length; i++) {
        if (this.idsTypeProd_2[i] == data.productTypeId) {
          this.idsTypeProd_2.splice(i, 1);
        }
      }
      for (var i = 0; i < this.filterSelectedType_2.length; i++) {
        if (this.filterSelectedType_2[i].productTypeId == data.productTypeId) {
          this.filterSelectedType_2.splice(i, 1);
        }
      }
      if (this.filterSelectedType_2.length == 0) {
        this.resetType_2 = null;
        this.idsTypeProd_3 = [];
        this.filterSelectedType_3 = [];
        this.filterTypeData_3 = [];
        this.showTypeFilter3 = false;
        this.loadProductsParellel(this.idsSubcatProd);
      }
      else this.loadProductsParellel(this.idsTypeProd_2);
    }
    else if (from == 'type_3') {
      for (var i = 0; i < this.idsTypeProd_3.length; i++) {
        if (this.idsTypeProd_3[i] == data.productTypeId) {
          this.idsTypeProd_3.splice(i, 1);
        }
      }
      for (var i = 0; i < this.filterSelectedType_3.length; i++) {
        if (this.filterSelectedType_3[i].productTypeId == data.productTypeId) {
          this.filterSelectedType_3.splice(i, 1);
        }
      }
      if (this.filterSelectedType_3.length == 0) {
        this.resetType_3 = null;
        this.loadProductsParellel(this.idsSubcatProd);
      }
      else this.loadProductsParellel(this.idsTypeProd_3);
    }

    // If Subcategory FilterData is Empty
    if (this.filterSelectedSubcategory.length == 0) {
      this.showTypeFilter1 = false;
      this.resetSubcategory = null;
      this.loadTypes(undefined); //Default
    }
  }
  /*Uncheck the selected Subcategory or Type and reload the product*/

  clearAllFilters() {
    this.enableFilterPanel();
    this.filterSelectedSubcategory = [];
    this.showTypeFilter1 = false;
    this.showTypeFilter2 = false;
    this.showTypeFilter3 = false;
    this.idsSubcatProd = [];
    this.idsTypeProd_1 = [];
    this.idsTypeProd_2 = [];
    this.idsTypeProd_3 = [];
    this.filterSelectedType_1 = [];
    this.filterSelectedType_2 = [];
    this.filterSelectedType_3 = [];
    this.filterTypeData_1 = [];
    this.filterTypeData_2 = [];
    this.filterTypeData_3 = [];
    this.resetSubcategory = null;
    this.resetType_1 = null;
    this.resetType_2 = null;
    this.resetType_3 = null;
    this.loadTypes(undefined);
  }

}

import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { environment } from '../../../environments/environment';
import { element } from 'protractor';
import { DynamicFilters } from '../../../../models/dynamicFilter';

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
  filteredData: Array<DynamicFilters>;
  toStr = JSON.stringify;
  ids: Array<any> = new Array;
  increaseLevel: number = 0;
  newData: Array<any> = new Array;
  lastParentLevel: number;
  nextItemArr: Array<any> = [];
  productAvailabilityModal = {};
  productAvailabilityResponse = [];
  productAvailabilityCategoryIC = [];
  defaultProductLevel: number = 3;

  constructor(private homeService: HomeService, public core: CoreService, private route: Router) { }

  async ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    localStorage.removeItem('changeBackFn');
    localStorage.removeItem('GetOfferPrice');
    this.core.headerScroll();
    localStorage.removeItem("selectedProduct");
    this.loader = true;
    this.loadTypes(undefined);
    this.core.pageLabel();
    this.productAvailabilityModal = { levelName: this.selectedTilesData.category.name, levelId: this.selectedTilesData.category.id, levelCount: this.defaultProductLevel };
    this.productAvailabilityResponse = await this.homeService.checkProductAvailability(this.productAvailabilityModal);
    this.productAvailabilityResponse = this.productAvailabilityResponse.filter(item => item.level = this.defaultProductLevel);
    this.loadFilterData();
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
      let data = { levelName: this.selectedTilesData.place.name, levelId: this.selectedTilesData.place.id, levelCount: 2 };
      this.productAvailability(data, 'c', 2);
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
      let data = { levelName: this.selectedCategoryData.name, levelId: this.selectedCategoryData.id, levelCount: 3 };
      this.productAvailability(data, 'sc', 3);
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

  clearAllFilters() {
    this.defaultProductLevel = 3;
    this.filteredData = [];
    this.increaseLevel = 0;
    this.ids = [];
    this.newData = [];
    this.nextItemArr = [];
    this.productAvailabilityModal = { levelName: this.selectedTilesData.category.name, levelId: this.selectedTilesData.category.id, levelCount: this.defaultProductLevel };
    this.checkProductAvailability();
    this.enableFilterPanel();
    this.loadFilterData();
    this.loadTypes();
  }

  loadFilterData() {
    this.filterModalAPI.fieldValues = [this.selectedTilesData.category.id];
    this.homeService.filterLoadSubcategory(this.filterModalAPI).subscribe((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) res[i].level = this.increaseLevel;
        this.filteredData = new Array<DynamicFilters>();
        this.filteredData.push(new DynamicFilters(false, this.increaseLevel, res, [], "", this.defaultProductLevel));
        this.modifyData();
      }
    }, (err) => {
      console.log(err);
    })
  }

  async changeFilter(data, parent) {
    data = JSON.parse(data);
    //parent.selectedValues.push(data);

    /*Load Types*/
    this.nextItemArr = this.nextItemArr.filter(item => item.level <= parent.level);
    this.filterModalAPI.fieldValues = [parent.level == 0 ? data.subCategoryId : data.productTypeId];
    var res = await this.homeService.filterLoadType(this.filterModalAPI);

    parent.selectedValues.push(data);
    let hashTable = {};
    let deduped = parent.selectedValues.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
    parent.selectedValues = deduped;

    if (res.length > 0) {
      this.defaultProductLevel = parent.pALevel + 1;
      if (this.increaseLevel == parent.level) this.increaseLevel = this.increaseLevel + 1;
      else {
        this.increaseLevel = parent.level + 1;
        this.commonToFilterData();
      }
      for (let i = 0; i < res.length; i++) res[i].level = this.increaseLevel;
      var getExisting = this.filteredData.filter(item => item.level == this.increaseLevel);
      if (getExisting.length > 0) {
        getExisting[0].data.push({ level: this.increaseLevel, label: parent.level == 0 ? data.subCategoryName : data.productTypeName, data: res })
        getExisting[0].selectedValues = [];
        getExisting[0].data = getExisting[0].data.filter((elem, index, self) => self.findIndex((item) => {
          return (item.level === elem.level && item.label === elem.label)
        }) === index);
      }
      else {
        this.newData.push({ level: this.increaseLevel, label: parent.level == 0 ? data.subCategoryName : data.productTypeName, data: res });
        var newDataFiltered = this.newData.filter(item => item.level != parent.level && item.level > parent.level);
        newDataFiltered = newDataFiltered.filter((elem, index, self) => self.findIndex((item) => {
          return (item.level === elem.level && item.label === elem.label)
        }) === index);
        this.filteredData.push(new DynamicFilters(true, this.increaseLevel, newDataFiltered, [], parent.level == 0 ? data.subCategoryName : data.productTypeName, this.defaultProductLevel));
        newDataFiltered = [];
        this.newData = [];
      }
    }
    else {
      if (!data.nextLevelProductTypeStatus) {
        this.nextItemArr.push({ level: parent.level, id: parent.level == 0 ? data.subCategoryId : data.productTypeId });
        this.nextItemArr = this.nextItemArr.filter((elem, index, self) => self.findIndex((item) => {
          return (item.id === elem.id && item.level === elem.level)
        }) === index);
      }
    }
    /*Check product Availability*/
    this.productAvailabilityModal = {
      levelName: parent.level == 0 ? data.subCategoryName : data.productTypeName,
      levelId: parent.level == 0 ? data.subCategoryId : data.productTypeId,
      levelCount: this.defaultProductLevel
    };
    this.checkProductAvailability();
    /*Check product Availability*/
    this.loadProducts(data, parent); /*Load Products*/
  }

  commonToFilterData() {
    for (let i = 0; i < this.filteredData.length; i++) {
      if (this.filteredData[i].level > 0 && this.filteredData[i].level > this.increaseLevel) {
        this.filteredData.splice(i, 1);
        i--;
      }
    }
  }

  clearingDataArr() {
    for (let i = 0; i < this.filteredData.length; i++) {
      let level = this.filteredData[i].level;
      for (let j = 0; j < this.filteredData[i].data.length; j++) {
        if (level > 0 && level != this.filteredData[i].data[j].level) {
          this.filteredData[i].data.splice(j, 1);
          j--;
        }
      }
    }
  }

  async loadProducts(data, parent) {
    this.ids = [];
    for (let i = 0; i < parent.selectedValues.length; i++) {
      let filterId = parent.selectedValues[i].subCategoryId != undefined ? parent.selectedValues[i].subCategoryId : parent.selectedValues[i].productTypeId;
      this.ids.push(filterId);
    }
    if (this.nextItemArr.length > 0) {
      for (let i = 0; i < this.nextItemArr.length; i++) {
        this.ids.push(this.nextItemArr[i].id);
      }
    }
    var ids = Array.from(new Set(this.ids));
    var response = await this.homeService.loadProductFromFilter(ids);
    this.tilesData = [];
    if (response.content.length > 0) {
      this.filterResponse(response);
      this.lastParentLevel = parent.level;
    }
    else {
      this.headerMessage = 'Sorry, but we don\'t have product matches for you';
      this.core.show(this.headerMessage);
      window.localStorage['browseProductSearch'] = this.headerMessage;
    }
  }

  deleteFilter(data, e) {
    e.currentTarget.parentElement.parentElement.children[0].selectedIndex = 0;
    let dataId = data.subCategoryId != undefined ? data.subCategoryId : data.productTypeId;
    this.ids = this.ids.filter(item => item != dataId);
    this.newData = this.newData.filter(item => item.level == data.level);
    this.filteredData = this.filteredData.filter(item => item.level <= data.level);
    this.nextItemArr = this.nextItemArr.filter(item => item.level <= data.level);
    for (let i = 0; i < this.nextItemArr.length; i++) {
      if (this.nextItemArr[i].id == dataId) {
        this.nextItemArr.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < this.filteredData.length; i++) {
      if (data.level == this.filteredData[i].level) {
        for (let j = 0; j < this.filteredData[i].selectedValues.length; j++) {
          let filterId = this.filteredData[i].selectedValues[j].subCategoryId != undefined ? this.filteredData[i].selectedValues[j].subCategoryId : this.filteredData[i].selectedValues[j].productTypeId;
          if (dataId == filterId) {
            this.filteredData[i].selectedValues.splice(j, 1);
            if (this.filteredData[i].selectedValues.length == 0) {
              this.filteredData.splice(i, 1);
              break;
            }
          }
        }
      }
    }

    for (let i = 0; i < this.filteredData.length; i++) {
      var ifDataPresent = this.filteredData.filter(item => item.level === data.level);
      if (ifDataPresent.length > 0) {
        if (data.level == this.filteredData[i].level) {
          for (let j = 0; j < this.filteredData[i].selectedValues.length; j++) {
            this.changeFilter(this.toStr(this.filteredData[i].selectedValues[j]), this.filteredData[i]);
          }
        }
      }
      else {
        if (this.filteredData[i].level == (data.level - 1)) {
          for (let j = 0; j < this.filteredData[i].selectedValues.length; j++) {
            this.changeFilter(this.toStr(this.filteredData[i].selectedValues[j]), this.filteredData[i]);
          }
        }
      }
    }

    if (this.filteredData.length == 0) this.clearAllFilters();
  }

  async checkProductAvailability() {
    this.productAvailabilityResponse = await this.homeService.checkProductAvailability(this.productAvailabilityModal);
    this.productAvailabilityResponse = this.productAvailabilityResponse.filter(item => item.level = this.defaultProductLevel);
    this.modifyData();
  }

  modifyData() {
    for (let i = 0; i < this.productAvailabilityResponse.length; i++) {
      for (let j = 0; j < this.filteredData.length; j++) {
        if (this.productAvailabilityResponse[i].level == this.filteredData[j].pALevel) {
          for (let k = 0; k < this.filteredData[j].data.length; k++) {
            /*If Level 0 (Subcategory)*/
            if (this.filteredData[j].data[k].level == 0) {
              let name = this.filteredData[j].data[k].subCategoryName;
              if (this.productAvailabilityResponse[i].name == name && (this.filteredData[j].data[k].isProductAvailable == undefined)) {
                this.filteredData[j].data[k].isProductAvailable = true;
                break;
              }
            }
            /*If Level > 0 (Types)*/
            else {
              for (let l = 0; l < this.filteredData[j].data[k].data.length; l++) {
                let name = this.filteredData[j].data[k].data[l].productTypeName;
                if (this.productAvailabilityResponse[i].name == name && (this.filteredData[j].data[k].data[l].isProductAvailable == undefined)) {
                  this.filteredData[j].data[k].data[l].isProductAvailable = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  productAvailability(data, from, level) {
    this.homeService.productAvailability(data).subscribe((res) => {
      this.productAvailabilityCategoryIC = res.filter(item => item.level = level);
      this.modifyCatSubData(from);
    }, (err) => {
      console.log("Error from Product Availability");
    })
  }

  modifyCatSubData(from) {
    for (let i = 0; i < this.productAvailabilityCategoryIC.length; i++) {
      if (from == 'c') {
        for (let j = 0; j < this.categoryList.length; j++) {
          if (this.productAvailabilityCategoryIC[i].name == this.categoryList[j].name) {
            this.categoryList[j].isProductAvailable = true;
          }
        }
      }
      else {
        for (let j = 0; j < this.subCategory.length; j++) {
          if (this.productAvailabilityCategoryIC[i].name == this.subCategory[j].name) {
            this.subCategory[j].isProductAvailable = true;
          }
        }
      }
    }
  }
}

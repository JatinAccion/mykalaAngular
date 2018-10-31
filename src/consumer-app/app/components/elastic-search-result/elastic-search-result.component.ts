import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { environment } from '../../../environments/environment';
import { DynamicFilters } from '../../../../models/dynamicFilter';
import { FilterMapPlaceData, FilterMapCategoryData } from '../../../../models/filterMapData';

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
  loaderShowMore: boolean = false;
  productListingModal = new BrowseProductsModal();
  headerMessage: string;
  showMoreBtn: boolean = true;
  callAPILoop: number = 1;
  esSizeCounter = 30;
  esFromCounter = 0;
  showFilterPanel: boolean = false;
  filterModalAPI = { "fieldValues": [] };
  filteredData: Array<DynamicFilters>;
  increaseLevel: number = 0;
  defaultProductLevel: number = 3;
  nextItemArr: Array<any> = [];
  ids: Array<any> = new Array;
  newData: Array<any> = new Array;
  productAvailabilityModal = {};
  productAvailabilityResponse = [];
  lastParentLevel: number;
  toStr = JSON.stringify;
  textAsSearchedTerm: string;
  parentNameAsCategoryName: string;
  parentIdAsCategoryId: string;

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
    if (window.localStorage['searchedWithoutSuggestion'] != undefined) this.core.isSearchWithoutSuggestion = true;
    if (window.localStorage['esKeyword'] != undefined) {
      this.textAsSearchedTerm = JSON.parse(window.localStorage['esKeyword']).text;
      this.parentNameAsCategoryName = JSON.parse(window.localStorage['esKeyword']).parentName;
      this.parentIdAsCategoryId = JSON.parse(window.localStorage['esKeyword']).parentId;
      this.loadType();
    }
  }

  async loadType() {
    this.core.isSearchWithoutSuggestion ? this.defaultProductLevel = 1 : this.defaultProductLevel = 3;
    var response = await this.core.searchProduct(this.textAsSearchedTerm, this.parentNameAsCategoryName, this.esSizeCounter, this.esFromCounter);
    if (response.products.length > 0) this.filterResponse(response);
    this.productAvailabilityModal = { levelName: this.parentNameAsCategoryName, levelId: this.parentIdAsCategoryId, levelCount: this.defaultProductLevel };
    this.productAvailabilityResponse = await this.homeService.checkProductAvailability(this.productAvailabilityModal);
    this.productAvailabilityResponse = this.productAvailabilityResponse.filter(item => item.level = this.defaultProductLevel);
    if (this.core.isSearchWithoutSuggestion) this.loaderPlaces()
    else this.loadFilterData();
  }

  ngAfterViewInit() {
    this.core.searchBar = '';
  }

  filterResponse(res) {
    this.loader = false;
    if (res.content) res = res.content.map((item) => new BrowseProductsModal(item));
    if (res.products) res = res.products.map((item) => new BrowseProductsModal(item));
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
    this.tilesData.length <= 30 ? this.showMoreBtn = false : this.showMoreBtn = true;
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

  async showMore() {
    this.loaderShowMore = true;
    this.esFromCounter = this.esFromCounter + 30;
    let text = JSON.parse(window.localStorage['esKeyword']).text;
    let parentName = JSON.parse(window.localStorage['esKeyword']).parentName;
    var response = await this.core.searchProduct(text, parentName, this.esSizeCounter, this.esFromCounter);
    if (response.products.length > 0) {
      this.loaderShowMore = false;
      response = response.products.map(p => new BrowseProductsModal(p));
      if (response.length <= 30) this.showMoreBtn = false;
      this.tilesData = [...this.tilesData, ...response];
      this.filterResponse(this.tilesData);
    }
    else {
      this.showMoreBtn = false;
      this.loaderShowMore = false;
    }
  }

  enableFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  loaderPlaces() {
    let data = [];
    for (let i = 0; i < this.tilesData.length; i++) {
      for (let j = 0; j < this.tilesData[i].product.productHierarchyWithIds.length; j++) {
        let item = this.tilesData[i].product.productHierarchyWithIds[j];
        if (item.levelCount == 1) data.push(item);
      }
    }
    data = data.filter((elem, index, self) => self.findIndex((item) => {
      return (item.levelCount === elem.levelCount && item.levelName === elem.levelName)
    }) === index);
    this.increaseLevel = 1;
    let placeList = new Array<FilterMapPlaceData>();
    for (let i = 0; i < data.length; i++) placeList.push(new FilterMapPlaceData(1, data[i].levelName, data[i].levelId))
    this.filteredData = new Array<DynamicFilters>();
    this.filteredData.push(new DynamicFilters(false, this.increaseLevel, placeList, [], "", this.defaultProductLevel));
    this.modifyData();
  }

  loadFilterData() {
    this.filterModalAPI.fieldValues = [this.parentIdAsCategoryId];
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
    this.esSizeCounter = 30;
    this.esFromCounter = 0;
    data = JSON.parse(data);
    this.nextItemArr = this.nextItemArr.filter(item => item.level <= parent.level);
    var res;
    if (this.core.isSearchWithoutSuggestion) {
      this.filterModalAPI.fieldValues = [this.getId(data, parent)];
      if (parent.level == 1) {
        this.defaultProductLevel = 2;
        res = await this.homeService.filterLoadCategories(this.filterModalAPI);
        let categoryList = new Array<FilterMapCategoryData>();
        for (let i = 0; i < res.length; i++) categoryList.push(new FilterMapCategoryData(0, res[i].categoryName, res[i].categoryId, res[i].placeName, res[i].placeId));
      }
      else if (parent.level == 2) {
        this.defaultProductLevel = 3;
        res = await this.homeService.filterLoadSubcategoryAsync(this.filterModalAPI);
      }
      else {
        res = await this.homeService.filterLoadType(this.filterModalAPI);
      }
    }
    else {
      this.nextItemArr = this.nextItemArr.filter(item => item.level <= parent.level);
      this.filterModalAPI.fieldValues = [parent.level == 0 ? data.subCategoryId : data.productTypeId];
      var res = await this.homeService.filterLoadType(this.filterModalAPI);
    }

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
        if (this.core.isSearchWithoutSuggestion) {
          getExisting[0].data.push({ level: this.increaseLevel, label: this.getLabel(data, parent), data: res })
        }
        else {
          getExisting[0].data.push({ level: this.increaseLevel, label: parent.level == 0 ? data.subCategoryName : data.productTypeName, data: res })
        }
        getExisting[0].selectedValues = [];
        getExisting[0].data = getExisting[0].data.filter((elem, index, self) => self.findIndex((item) => {
          return (item.level === elem.level && item.label === elem.label)
        }) === index);
      }
      else {
        if (this.core.isSearchWithoutSuggestion) {
          this.newData.push({ level: this.increaseLevel, label: this.getLabel(data, parent), data: res });
        }
        else {
          this.newData.push({ level: this.increaseLevel, label: parent.level == 0 ? data.subCategoryName : data.productTypeName, data: res });
        }
        var newDataFiltered = this.newData.filter(item => item.level != parent.level && item.level > parent.level);
        newDataFiltered = newDataFiltered.filter((elem, index, self) => self.findIndex((item) => {
          return (item.level === elem.level && item.label === elem.label)
        }) === index);
        if (this.core.isSearchWithoutSuggestion) {
          this.filteredData.push(new DynamicFilters(true, this.increaseLevel, newDataFiltered, [], this.getLabel(data, parent), this.defaultProductLevel));
        }
        else {
          this.filteredData.push(new DynamicFilters(true, this.increaseLevel, newDataFiltered, [], parent.level == 0 ? data.subCategoryName : data.productTypeName, this.defaultProductLevel));
        }
        newDataFiltered = [];
        this.newData = [];
      }
    }
    else {
      if (!data.nextLevelProductTypeStatus) {
        if (this.core.isSearchWithoutSuggestion) {
          this.nextItemArr.push({ level: parent.level, id: this.getId(data, parent) });
        }
        else {
          this.nextItemArr.push({ level: parent.level, id: parent.level == 0 ? data.subCategoryId : data.productTypeId });
        }
        this.nextItemArr = this.nextItemArr.filter((elem, index, self) => self.findIndex((item) => {
          return (item.id === elem.id && item.level === elem.level)
        }) === index);
      }
    }
    /*Check product Availability*/
    if (this.core.isSearchWithoutSuggestion) {
      this.productAvailabilityModal = {
        levelName: this.getLabel(data, parent),
        levelId: this.getId(data, parent),
        levelCount: this.defaultProductLevel
      };
    }
    else {
      this.productAvailabilityModal = {
        levelName: parent.level == 0 ? data.subCategoryName : data.productTypeName,
        levelId: parent.level == 0 ? data.subCategoryId : data.productTypeId,
        levelCount: this.defaultProductLevel
      };
    }
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

  getId(data, parent) {
    let id;
    if (parent.level == 1) id = data.placeId;
    else if (parent.level == 2) id = data.categoryId;
    else if (parent.level == 3) id = data.subCategoryId
    else id = data.productTypeId;
    return id;
  }

  getLabel(data, parent) {
    let label;
    if (parent.level == 1) label = data.placeName;
    else if (parent.level == 2) label = data.categoryName;
    else if (parent.level == 3) label = data.subCategoryName
    else label = data.productTypeName;
    return label;
  }

  async loadProducts(data, parent) {
    this.ids = [];
    let filterId;
    for (let i = 0; i < parent.selectedValues.length; i++) {
      if (this.core.isSearchWithoutSuggestion) {
        if (parent.level == 1) this.ids.push(parent.selectedValues[i].placeId)
        else if (parent.level == 2) this.ids.push(parent.selectedValues[i].categoryId)
        else if (parent.level == 3) this.ids.push(parent.selectedValues[i].subCategoryId)
        else this.ids.push(parent.selectedValues[i].productTypeId)
      }
      else {
        filterId = parent.selectedValues[i].subCategoryId != undefined ? parent.selectedValues[i].subCategoryId : parent.selectedValues[i].productTypeId;
        this.ids.push(filterId);
      }
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
    let dataId;
    if (this.core.isSearchWithoutSuggestion) {
      if (data.level == 1) dataId = data.placeId;
      else if (data.level == 2) dataId = data.categoryId;
      else if (data.level == 3) dataId = data.subCategoryId;
      else dataId = data.productTypeId;
    }
    else dataId = data.subCategoryId != undefined ? data.subCategoryId : data.productTypeId;
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
        if (this.core.isSearchWithoutSuggestion) {
          for (let j = 0; j < this.filteredData[i].selectedValues.length; j++) {
            let filterId;
            if (this.filteredData[i].selectedValues[j].level == 1) filterId = this.filteredData[i].selectedValues[j].placeId;
            else if (this.filteredData[i].selectedValues[j].level == 2) filterId = this.filteredData[i].selectedValues[j].categoryId;
            else if (this.filteredData[i].selectedValues[j].level == 3) filterId = this.filteredData[i].selectedValues[j].subCategoryId;
            else filterId = this.filteredData[i].selectedValues[j].productTypeId;
            this.filteredData[i].selectedValues[j].subCategoryId != undefined ? this.filteredData[i].selectedValues[j].subCategoryId : this.filteredData[i].selectedValues[j].productTypeId;
            if (dataId == filterId) {
              this.filteredData[i].selectedValues.splice(j, 1);
              if (this.filteredData[i].selectedValues.length == 0) {
                this.filteredData.splice(i, 1);
                break;
              }
            }
          }
        }
        else {
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

  clearAllFilters() {
    this.loader = true;
    this.defaultProductLevel = 3;
    this.filteredData = [];
    this.increaseLevel = 0;
    this.ids = [];
    this.newData = [];
    this.nextItemArr = [];
    this.esSizeCounter = 30;
    this.esFromCounter = 0;
    this.productAvailabilityModal = { levelName: this.parentNameAsCategoryName, levelId: this.parentIdAsCategoryId, levelCount: this.defaultProductLevel };
    this.checkProductAvailability();
    this.enableFilterPanel();
    this.loadType();
  }

  modifyData() {
    if (this.core.isSearchWithoutSuggestion) {
      for (let i = 0; i < this.productAvailabilityResponse.length; i++) {
        for (let j = 0; j < this.filteredData.length; j++) {
          if (this.productAvailabilityResponse[i].level == this.filteredData[j].pALevel) {
            for (let k = 0; k < this.filteredData[j].data.length; k++) {
              if (this.filteredData[j].data[k].level == 1) {
                let name = this.filteredData[j].data[k].placeName;
                if (this.productAvailabilityResponse[i].name == name && (this.filteredData[j].data[k].isProductAvailable == undefined)) {
                  this.filteredData[j].data[k].isProductAvailable = true;
                  break;
                }
              }
              else if (this.filteredData[j].data[k].level == 2) {
                for (let l = 0; l < this.filteredData[j].data[k].data.length; l++) {
                  let name = this.filteredData[j].data[k].data[l].categoryName;
                  if (this.productAvailabilityResponse[i].name == name && (this.filteredData[j].data[k].data[l].isProductAvailable == undefined)) {
                    this.filteredData[j].data[k].data[l].isProductAvailable = true;
                    break;
                  }
                }
              }
              else if (this.filteredData[j].data[k].level == 3) {
                for (let l = 0; l < this.filteredData[j].data[k].data.length; l++) {
                  let name = this.filteredData[j].data[k].data[l].subCategoryName;
                  if (this.productAvailabilityResponse[i].name == name && (this.filteredData[j].data[k].data[l].isProductAvailable == undefined)) {
                    this.filteredData[j].data[k].data[l].isProductAvailable = true;
                    break;
                  }
                }
              }
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
    else {
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
  }
}

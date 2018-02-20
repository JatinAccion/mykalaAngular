import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { CoreService } from '../../../services/core.service';
import { Router } from '@angular/router';
import { SearchDataModal } from '../../../../../models/searchData.modal';
import { GetOfferModal } from '../../../../../models/getOffer.modal';
import { OfferInfo1 } from '../../../../../models/steps.modal';
import { GetOfferService } from '../../../services/getOffer.service';


@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step1Component implements OnInit {
  pageLabel: string;
  loader_place: boolean;
  loader_category: boolean;
  loader_subCategory: boolean;
  loader_Type: boolean;
  levelSelection: any;
  userResponse = { place: [], type: [], category: [], subcategory: [] };
  headerMessage: string;
  getPlaceId: string;
  getCategoryId: string;
  getSubcategoryId: string;
  spliceElem;
  Step1SelectedValues = { place: "", type: [], category: "", subcategory: "" };
  gSCM = { productType: "" };
  gSCMRequestModal = { productType: "", attributes: {} };
  Step1Modal = new GetOfferModal();
  viewSavedData;
  checkIfStored: boolean = false;
  loadedPlaces: boolean = false;
  loadedCategory: boolean = false;
  loadedSubCategory: boolean = false;
  noTypesAvailable: boolean = false;
  getObjectFromOrder = { key: "", data: "" }

  constructor(
    private homeService: HomeService,
    private getoffers: GetOfferService,
    public core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.headerScroll();
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    this.pageLabel = window.localStorage['browseProductSearch'];
    this.core.pageLabel(this.pageLabel);
    if (window.localStorage['levelSelections'] != undefined) this.levelSelection = JSON.parse(window.localStorage['levelSelections']);
    if (window.localStorage['GetOfferStep_1'] != undefined) {
      this.checkIfStored = true;
      this.loadedPlaces = true;
      this.loadedCategory = true;
      this.loadedSubCategory = true;
      this.viewSavedData = JSON.parse(window.localStorage['GetOfferStep_1']);
      for (var i = 0; i < this.viewSavedData.length; i++) {
        this.userResponse.place.push(this.viewSavedData[i].place);
        this.Step1SelectedValues.place = this.viewSavedData[i].place;
        this.getPlaceId = this.viewSavedData[i].place.id;
        this.userResponse.category.push(this.viewSavedData[i].category);
        this.Step1SelectedValues.category = this.viewSavedData[i].category;
        this.getCategoryId = this.viewSavedData[i].category.id;
        this.userResponse.subcategory.push(this.viewSavedData[i].subCategory);
        this.Step1SelectedValues.subcategory = this.viewSavedData[i].subCategory;
        this.getSubcategoryId = this.viewSavedData[i].subCategory.id;
        for (var j = 0; j < this.viewSavedData[i].type.length; j++) {
          this.userResponse.type.push(this.viewSavedData[i].type[j]);
          this.Step1SelectedValues.type.push(this.viewSavedData[i].type[j]);
        }
      }
    }
    else {
      this.loadedPlaces = true;
      this.loadedCategory = true;
      this.loadedSubCategory = true;
      this.userResponse.place.push(this.levelSelection.place);
      this.Step1SelectedValues.place = this.levelSelection.place;
      this.userResponse.type.push(this.levelSelection.type);
      this.userResponse.category.push(this.levelSelection.category);
      this.Step1SelectedValues.category = this.levelSelection.category;
      this.userResponse.subcategory.push(this.levelSelection.subcategory);
      this.Step1SelectedValues.subcategory = this.levelSelection.subcategory;
      this.Step1SelectedValues.type.push(this.levelSelection.type);
      this.getPlaceId = this.levelSelection.place.id;
      this.getCategoryId = this.levelSelection.category.id;
      this.getSubcategoryId = this.levelSelection.subcategory.id;
      //this.getType();
    }
  }

  getPlaces() {
    this.noTypesAvailable = false;
    this.loader_place = true;
    this.userResponse.place = [];
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader_place = false;
      this.loadedPlaces = false;
      for (var i = 0; i < res.length; i++) this.userResponse.place.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1", ""));
    })
  };

  getCategory() {
    this.noTypesAvailable = false;
    this.loader_category = true;
    this.userResponse.category = [];
    this.homeService.getTilesCategory(this.getPlaceId).subscribe(res => {
      this.loader_category = false;
      this.loadedCategory = false;
      for (var i = 0; i < res.length; i++) this.userResponse.category.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", ""));
    });
  };

  getSubCategory() {
    this.noTypesAvailable = false;
    this.loader_subCategory = true;
    this.userResponse.subcategory = [];
    this.homeService.getTilesSubCategory(this.getCategoryId).subscribe(res => {
      this.loader_subCategory = false;
      this.loadedSubCategory = false;
      for (var i = 0; i < res.length; i++) this.userResponse.subcategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3", ""));
    });
  };

  getofferSubCategory(obj) {
    this.loader_Type = true;
    this.noTypesAvailable = false;
    this.gSCM.productType = obj.name;
    this.getoffers.getofferSubCategory(this.gSCM).subscribe(res => {
      this.loader_Type = false;
      console.log(res);
      this.getObjectFromOrderNo(res);
    });
  }

  getObjectFromOrderNo(res) {
    let array = []; let data; let keyword;
    array.push(res.attributes_orders.attributes_metadata)
    var resultObject = search("1", array);
    function search(nameKey, myArray) {
      for (var i = 0; i < myArray.length; i++) {
        for (var key in myArray[i]) {
          if (myArray[i][key].order === nameKey) {
            data = myArray[i][key];
            keyword = key;
          }
        }
      }
    }
    this.getObjectFromOrder.data = data;
    this.getObjectFromOrder.key = keyword;
    for (var key in res.attributes) {
      if (key === this.getObjectFromOrder.key) {
        data = res.attributes[key]
      }
    }
    this.getObjectFromOrder.data = data;
    this.userResponse.type = [];
    if (this.getObjectFromOrder.data.length === 0) this.noTypesAvailable = true;
    else {
      for (var i = 0; i < this.getObjectFromOrder.data.length; i++) {
        let type = this.getObjectFromOrder.data[i]
        this.userResponse.type.push(new SearchDataModal('id' + i, type, type, '4', ''));
      }
    }
  }

  getType() {
    this.noTypesAvailable = false;
    this.loader_Type = true;
    this.userResponse.type = [];
    this.homeService.getTilesType(this.getSubcategoryId).subscribe(res => {
      this.loader_Type = false;
      if (res.length === 0) this.noTypesAvailable = true;
      else for (var i = 0; i < res.length; i++) this.userResponse.type.push(new SearchDataModal(res[i].productTypeId, res[i].productTypeName, res[i].productTypeName, "4", ""));
    });
  };

  loadData(obj, elemName, e?: any) {
    if (elemName == 'place') {
      e.currentTarget.className = "categ_outline_red m-2";
      this.getPlaceId = obj.id;
      this.getCategory();
      this.clearItems(elemName);
      this.userResponse.place = [obj];
      this.Step1SelectedValues.place = obj;
    }
    else if (elemName == 'category') {
      e.currentTarget.className = "categ_outline_red m-2";
      this.getCategoryId = obj.id;
      this.getSubCategory();
      this.clearItems(elemName);
      this.userResponse.category = [obj];
      this.Step1SelectedValues.category = obj;
    }
    else if (elemName == 'subcategory') {
      e.currentTarget.className = "categ_outline_red m-2";
      this.checkIfStored = false;
      this.getSubcategoryId = obj.id;
      this.getofferSubCategory(obj);
      //this.getType();
      this.clearItems(elemName);
      this.userResponse.subcategory = [obj];
      this.Step1SelectedValues.subcategory = obj;
    }
    else {
      e.currentTarget.className = "categ_outline_red m-2";
      for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
        if (this.Step1SelectedValues.type[i].length == 0) this.Step1SelectedValues.type.splice(i, 1);
        else if (this.Step1SelectedValues.type[i].name == obj.name) {
          this.Step1SelectedValues.type.splice(i, 1);
          e.currentTarget.className = "categ_outline_gray m-2";
          this.getUpdateTypes();
          return false;
        }
      }
      this.Step1SelectedValues.type.push(obj);
    }
    if (this.Step1SelectedValues.type.length > 0) this.getUpdateTypes();
  };

  getUpdateTypes() {
    if (this.Step1SelectedValues.type.length > 0) {
      this.gSCMRequestModal.productType = this.Step1SelectedValues.subcategory['name'];
      this.gSCMRequestModal.attributes[this.getObjectFromOrder.key] = [];
      for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
        let typeName = this.Step1SelectedValues.type[i].name;
        this.gSCMRequestModal.attributes[this.getObjectFromOrder.key].push(typeName)
      }
    }
    else this.gSCMRequestModal.attributes[this.getObjectFromOrder.key] = [];
  }

  delete(obj, elemName) {
    if (elemName == 'place') {
      this.spliceElem = this.userResponse.place;
      this.splice(obj, this.spliceElem);
      this.clearItems(elemName);
    }
    else if (elemName == 'category') {
      this.spliceElem = this.userResponse.category;
      this.splice(obj, this.spliceElem);
      this.clearItems(elemName);
    }
    else if (elemName == 'subcategory') {
      this.spliceElem = this.userResponse.subcategory;
      this.splice(obj, this.spliceElem);
      this.clearItems(elemName);
    }
  }

  splice(obj, spliceElem) {
    for (var i = 0; i < spliceElem.length; i++) {
      if (obj.id == spliceElem[i].id) spliceElem.splice(i, 1);
    }
  }

  clearItems(elemName) {
    if (elemName == 'place') {
      this.userResponse.category = [];
      this.userResponse.subcategory = [];
      this.userResponse.type = [];
    }
    else if (elemName == 'category') {
      this.userResponse.subcategory = [];
      this.userResponse.type = [];
    }
    else if (elemName == 'subcategory') {
      this.userResponse.type = [];
      this.Step1SelectedValues.type = [];
    }
  };

  next() {
    this.checkIfStored = true;
    this.Step1Modal.getoffer_1 = new Array<OfferInfo1>();
    this.Step1Modal.getoffer_1.push(new OfferInfo1(this.Step1SelectedValues.place, this.Step1SelectedValues.category, this.Step1SelectedValues.subcategory, this.Step1SelectedValues.type));
    window.localStorage['GetOfferStep_1'] = JSON.stringify(this.Step1Modal.getoffer_1);
    window.localStorage['GetOfferStep_2'] = JSON.stringify(this.gSCMRequestModal);
    this.route.navigate(['/getoffer', 'step2']);
  };

}

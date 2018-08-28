import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
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
  gSCM = { productType: "", placeName: "", categoryName: "" };
  gSCMRequestModal = { productType: "", placeName: "", categoryName: "", attributes: {} };
  Step1Modal = new GetOfferModal();
  viewSavedData;
  checkIfStored: boolean = false;
  loadedPlaces: boolean = false;
  loadedCategory: boolean = false;
  loadedSubCategory: boolean = false;
  noTypesAvailable: boolean = false;
  getObjectFromOrder = { key: "", data: "", selection: {} };
  showAvailableTypes: boolean = false;
  @ViewChild('selectValidationModal') selectValidationModal: ElementRef;
  validationMsg: string;
  skipTrue: boolean = false;

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
    localStorage.removeItem('changeBackFn');
    if (window.localStorage['GetOfferStep_2Request'] != undefined) this.gSCMRequestModal = JSON.parse(window.localStorage['GetOfferStep_2Request'])
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
        this.gSCM.placeName = this.viewSavedData[i].place.name;
        this.gSCM.categoryName = this.viewSavedData[i].category.name;
        this.gSCM.productType = this.viewSavedData[i].subCategory.name;
        if (!this.viewSavedData[i].noType) {
          this.skipTrue = false;
          this.showAvailableTypes = true;
          for (var j = 0; j < this.viewSavedData[i].type.length; j++) {
            this.userResponse.type.push(this.viewSavedData[i].type[j]);
            this.Step1SelectedValues.type.push(this.viewSavedData[i].type[j]);
          }
        }
        else {
          this.skipTrue = true;
          this.showAvailableTypes = false;
        }
      }
    }
    else {
      this.loadedPlaces = true;
      this.loadedCategory = true;
      this.loadedSubCategory = true;
      this.userResponse.place.push(this.levelSelection.place);
      this.Step1SelectedValues.place = this.levelSelection.place;
      this.gSCM.placeName = this.levelSelection.place.name;
      this.userResponse.type.push(this.levelSelection.type);
      this.userResponse.category.push(this.levelSelection.category);
      this.Step1SelectedValues.category = this.levelSelection.category;
      this.gSCM.categoryName = this.levelSelection.category.name;
      this.userResponse.subcategory.push(this.levelSelection.subcategory);
      this.Step1SelectedValues.subcategory = this.levelSelection.subcategory;
      this.gSCM.productType = this.levelSelection.subcategory.name;
      this.Step1SelectedValues.type.push(this.levelSelection.type);
      this.getPlaceId = this.levelSelection.place.id;
      this.getCategoryId = this.levelSelection.category.id;
      this.getSubcategoryId = this.levelSelection.subcategory.id;
      //this.getofferSubCategory(this.Step1SelectedValues.subcategory);
      if (this.Step1SelectedValues.subcategory.length == 0) this.getSubCategory();
      else this.getofferSubCategory(this.Step1SelectedValues.subcategory);
      //else this.getType();
    }
  }

  getPlaces() {
    let productAvalabilityReq = { levelName: null, levelId: null, levelCount: 1 };
    this.noTypesAvailable = false;
    this.loader_place = true;
    this.userResponse.place = [];
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader_place = false;
      this.loadedPlaces = false;
      for (var i = 0; i < res.length; i++) this.userResponse.place.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1", ""));
      this.checkProductAvailability(1, productAvalabilityReq);
    })
  };

  getCategory(data?: any) {
    let productAvalabilityReq = {};
    if (data != undefined) productAvalabilityReq = { levelName: data.name, levelId: data.id, levelCount: 2 };
    else productAvalabilityReq = { levelName: this.Step1SelectedValues.place['name'], levelId: this.Step1SelectedValues.place['id'], levelCount: 2 };
    this.noTypesAvailable = false;
    this.loader_category = true;
    this.userResponse.category = [];
    this.homeService.getTilesCategory(this.getPlaceId).subscribe(res => {
      this.loader_category = false;
      this.loadedCategory = false;
      for (var i = 0; i < res.length; i++) this.userResponse.category.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", ""));
      this.checkProductAvailability(2, productAvalabilityReq);
    });
  };

  getSubCategory(data?: any) {
    let productAvalabilityReq = {};
    if (data != undefined) productAvalabilityReq = { levelName: data.name, levelId: data.id, levelCount: 3 };
    else productAvalabilityReq = { levelName: this.Step1SelectedValues.category['name'], levelId: this.Step1SelectedValues.category['id'], levelCount: 3 };
    this.showAvailableTypes = false;
    this.noTypesAvailable = false;
    this.loader_subCategory = true;
    this.userResponse.subcategory = [];
    this.homeService.getTilesSubCategory(this.getCategoryId).subscribe(res => {
      this.loader_subCategory = false;
      this.loadedSubCategory = false;
      for (var i = 0; i < res.length; i++) this.userResponse.subcategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3", ""));
      this.checkProductAvailability(3, productAvalabilityReq);
    });
  };

  getofferSubCategory(obj) {
    this.loader_Type = true;
    this.showAvailableTypes = true;
    this.noTypesAvailable = false;
    this.getoffers.getofferSubCategory(this.gSCM).subscribe(res => {
      this.loader_Type = false;
      if (res.noType) {
        this.skipTrue = true;
        this.showAvailableTypes = false;
        this.gSCMRequestModal.attributes = {};
        this.gSCMRequestModal.placeName = this.gSCM.placeName;
        this.gSCMRequestModal.categoryName = this.gSCM.categoryName;
        this.gSCMRequestModal.productType = this.gSCM.productType;
      }
      else {
        this.skipTrue = false;
        this.getObjectFromOrderNo(res);
      }
    });
  }

  getObjectFromOrderNo(res) {
    let data; let keyword; let selection;
    let resultObject = search("1", res.attributes_orders.attributes_metadata);
    function search(nameKey, myArray) {
      for (var key in myArray) {
        if (myArray[key].order === nameKey) {
          data = myArray[key];
          keyword = key;
        }
      }
    }
    this.getObjectFromOrder.data = data;
    this.getObjectFromOrder.key = keyword;
    for (var key in res.attributes) {
      if (key === this.getObjectFromOrder.key) {
        data = res.attributes[key];
        selection = res.attributes_orders.attributes_metadata[key];
      }
    }
    this.getObjectFromOrder.data = data;
    this.getObjectFromOrder.selection = selection;
    this.userResponse.type = [];
    if (this.getObjectFromOrder.data.length === 0) this.noTypesAvailable = true;
    else {
      for (var i = 0; i < this.getObjectFromOrder.data.length; i++) {
        let type = this.getObjectFromOrder.data[i];
        if (type != '' && type != ' ') {
          this.userResponse.type.push(new SearchDataModal('id' + i, type, type, '4', '', '', this.getObjectFromOrder.selection));
        }
      }
    }
    this.showAvailableTypes = true;
  }

  getType() {
    this.showAvailableTypes = true;
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
      this.gSCM.placeName = obj.name;
      this.gSCM.categoryName = "";
      e.currentTarget.className = "categ_outline_red m-2";
      this.getPlaceId = obj.id;
      this.getCategory(obj);
      this.clearItems(elemName);
      this.userResponse.place = [obj];
      this.Step1SelectedValues.place = obj;
    }
    else if (elemName == 'category') {
      this.gSCM.categoryName = obj.name;
      this.gSCM.productType = "";
      e.currentTarget.className = "categ_outline_red m-2";
      this.getCategoryId = obj.id;
      this.getSubCategory(obj);
      this.clearItems(elemName);
      this.userResponse.category = [obj];
      this.Step1SelectedValues.category = obj;
    }
    else if (elemName == 'subcategory') {
      this.gSCM.productType = obj.name;
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
      if (obj.selection.multiSelect == 'N' && obj.name != 'No Preference') {
        this.Step1SelectedValues.type = [];
        this.activeInactive();
        e.currentTarget.className = "categ_outline_red m-2 typeList";
      }
      else if (obj.selection.multiSelect == 'Y' && obj.name != 'No Preference') {
        for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
          if (this.Step1SelectedValues.type[i].name == 'No Preference') {
            this.Step1SelectedValues.type = [];
            this.activeInactive();
            break;
          }
        }
        e.currentTarget.className = "categ_outline_red m-2 typeList";
        for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
          if (this.Step1SelectedValues.type[i].length == 0) this.Step1SelectedValues.type.splice(i, 1);
          else if (this.Step1SelectedValues.type[i].name == obj.name) {
            this.Step1SelectedValues.type.splice(i, 1);
            e.currentTarget.className = "categ_outline_gray m-2 typeList";
            this.getUpdateTypes();
            return false;
          }
        }
      }
      else {
        for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
          if (this.Step1SelectedValues.type[i].name == 'No Preference') {
            this.Step1SelectedValues.type = [];
            this.activeInactive();
            return false;
          }
        }
        this.Step1SelectedValues.type = [];
        this.activeInactive();
        e.currentTarget.className = "categ_outline_red m-2 typeList";
      }
      this.Step1SelectedValues.type.push(obj);
    }
    if (this.Step1SelectedValues.type.length > 0 && this.Step1SelectedValues.type[0].hasOwnProperty("id")) this.getUpdateTypes();
  };

  activeInactive() {
    let elements = document.querySelectorAll(".typeList");
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("categ_outline_red") == true) {
        elements[i].classList.remove("categ_outline_red")
        elements[i].classList.add("categ_outline_gray")
      }
    }
  }

  getUpdateTypes() {
    let userSelection = JSON.parse(window.localStorage['levelSelections']);
    this.gSCMRequestModal.placeName = this.gSCM.placeName;
    this.gSCMRequestModal.categoryName = this.gSCM.categoryName;
    if (this.Step1SelectedValues.type.length > 0) {
      this.gSCMRequestModal.productType = this.Step1SelectedValues.subcategory['name'];
      if (this.getObjectFromOrder.key == "") this.getObjectFromOrder.key = Object.keys(this.gSCMRequestModal.attributes)[0]
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
    if (!this.gSCM.placeName) {
      this.validationMsg = "Please select a place";
      this.core.openModal(this.selectValidationModal);
    }
    else if (!this.gSCM.categoryName) {
      this.validationMsg = "Please select a category";
      this.core.openModal(this.selectValidationModal);
    }
    else if (!this.gSCM.productType) {
      this.validationMsg = "Please select a subcategory";
      this.core.openModal(this.selectValidationModal);
    }
    else if (!this.skipTrue && (this.Step1SelectedValues.type[0] == undefined || this.Step1SelectedValues.type[0] == "")) {
      this.validationMsg = "Please select a type"
      this.core.openModal(this.selectValidationModal);
    }
    else {
      this.checkIfStored = true;
      this.Step1Modal.getoffer_1 = new Array<OfferInfo1>();
      this.Step1Modal.getoffer_1.push(new OfferInfo1(this.Step1SelectedValues.place, this.Step1SelectedValues.category, this.Step1SelectedValues.subcategory, this.Step1SelectedValues.type, this.skipTrue ? true : false));
      window.localStorage['GetOfferStep_1'] = JSON.stringify(this.Step1Modal.getoffer_1);
      window.localStorage['GetOfferStep_2Request'] = JSON.stringify(this.gSCMRequestModal);
      this.route.navigate(['/getoffer', 'step2']);
    }
  };

  async checkProductAvailability(level, data) {
    let productAvailability = [];
    let response = await this.homeService.checkProductAvailability(data);
    productAvailability = response.filter(item => item.level = level);
    this.modifyData(productAvailability, level);
  }

  modifyData(productAvailability, level) {
    if (level == 1) {
      for (let i = 0; i < productAvailability.length; i++) {
        for (let j = 0; j < this.userResponse.place.length; j++) {
          if (productAvailability[i].level == parseInt(this.userResponse.place[j].level)
            && productAvailability[i].name == this.userResponse.place[j].name) {
            this.userResponse.place[j].isProductAvailable = true;
            break;
          }
        }
      }
    }
    else if (level == 2) {
      for (let i = 0; i < productAvailability.length; i++) {
        for (let j = 0; j < this.userResponse.category.length; j++) {
          if (productAvailability[i].level == parseInt(this.userResponse.category[j].level)
            && productAvailability[i].name == this.userResponse.category[j].name) {
            this.userResponse.category[j].isProductAvailable = true;
            break;
          }
        }
      }
    }
    else if (level == 3) {
      for (let i = 0; i < productAvailability.length; i++) {
        for (let j = 0; j < this.userResponse.subcategory.length; j++) {
          if (productAvailability[i].level == parseInt(this.userResponse.subcategory[j].level)
            && productAvailability[i].name == this.userResponse.subcategory[j].name) {
            this.userResponse.subcategory[j].isProductAvailable = true;
            break;
          }
        }
      }
    }
    else {
      console.log("Type");
    }
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { SearchDataModal } from '../../home/searchData.modal';
import { CoreService } from '../../../services/core.service';
import { GetOfferModal } from '../getOffer.modal';
import { Router } from '@angular/router';
import { OfferInfo1 } from '../steps.modal';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step1Component implements OnInit {
  loader_place: boolean;
  loader_category: boolean;
  loader_subCategory: boolean;
  loader_Type: boolean;
  levelSelection = JSON.parse(window.localStorage['levelSelections']);
  userResponse = { place: [], type: [], category: [], subcategory: [] };
  headerMessage: string;
  getPlaceId: string;
  getCategoryId: string;
  getSubcategoryId: string;
  spliceElem;
  Step1SelectedValues = { place: "", type: [], category: "", subcategory: "" };
  Step1Modal = new GetOfferModal();
  viewSavedData;
  checkIfStored: boolean = false;

  constructor(
    private homeService: HomeService,
    private core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    if (window.localStorage['GetOfferStep_1'] != undefined) {
      this.checkIfStored = true;
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
      this.getType();
    }
  }

  getPlaces() {
    this.loader_place = true;
    this.userResponse.place = [];
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader_place = false;
      for (var i = 0; i < res.length; i++) this.userResponse.place.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1"));
    })
  };

  getCategory() {
    this.loader_category= true;
    this.userResponse.category = [];
    this.homeService.getTilesCategory(this.getPlaceId).subscribe(res => {
      this.loader_category = false;
      for (var i = 0; i < res.length; i++) this.userResponse.category.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2"));
    });
  };

  getSubCategory() {
    this.loader_subCategory = true;
    this.userResponse.subcategory = [];
    this.homeService.getTilesSubCategory(this.getCategoryId).subscribe(res => {
      this.loader_subCategory = false;
      for (var i = 0; i < res.length; i++) this.userResponse.subcategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
    });
  };

  getType() {
    this.loader_Type = true;
    this.userResponse.type = [];
    this.homeService.getTilesType(this.getSubcategoryId).subscribe(res => {
      this.loader_Type = false;
      for (var i = 0; i < res.length; i++) this.userResponse.type.push(new SearchDataModal(res[i].productTypeId, res[i].productTypeName, res[i].productTypeName, "4"));
    });
  };

  loadData(obj, elemName, e?: any) {
    if (elemName == 'place') {
      this.getPlaceId = obj.id;
      this.getCategory();
      this.clearItems(elemName);
      this.userResponse.place = [obj];
      this.Step1SelectedValues.place = obj;
    }
    else if (elemName == 'category') {
      this.getCategoryId = obj.id;
      this.getSubCategory();
      this.clearItems(elemName);
      this.userResponse.category = [obj];
      this.Step1SelectedValues.category = obj;
    }
    else if (elemName == 'subcategory') {
      this.checkIfStored = false;
      this.getSubcategoryId = obj.id;
      this.getType();
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
          return false;
        }
      }
      this.Step1SelectedValues.type.push(obj);
    }
  };

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
    this.route.navigate(['/getoffer', 'step2']);
  };

}

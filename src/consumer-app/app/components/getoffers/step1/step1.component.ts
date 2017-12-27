import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { SearchDataModal } from '../../home/searchData.modal';
import { CoreService } from '../../../services/core.service';
import { GetOfferModal } from '../getOffer.modal';
import { Router } from '@angular/router';
import { OfferInfo1 } from '../step1.modal';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Step1Component implements OnInit {
  levelSelection = JSON.parse(window.localStorage['levelSelections']);
  userResponse = { place: [], type: [], category: [], subcategory: [] };
  headerMessage: string;
  getPlaceId: string;
  getCategoryId: string;
  getSubcategoryId: string;
  spliceElem;
  Step1SelectedValues = { place: "", type: [], category: "", subcategory: "" };
  Step1Modal = new GetOfferModal();

  constructor(
    private homeService: HomeService,
    private core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.headerMessage = 'get offers';
    this.core.show(this.headerMessage);
    this.userResponse.place.push(this.levelSelection.place);
    this.userResponse.type.push(this.levelSelection.type);
    this.userResponse.category.push(this.levelSelection.category);
    this.userResponse.subcategory.push(this.levelSelection.subcategory);
  }

  getPlaces() {
    this.userResponse.place = [];
    this.homeService.getTilesPlace().subscribe(res => {
      this.getPlaceId = res.placeId;
      for (var i = 0; i < res.length; i++) this.userResponse.place.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1"));
    })
  };

  getCategory() {
    this.userResponse.category = [];
    this.homeService.getTilesCategory(this.getPlaceId).subscribe(res => {
      this.getCategoryId = res.categoryId;
      for (var i = 0; i < res.length; i++) this.userResponse.category.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2"));
    });
  };

  getSubCategory() {
    this.userResponse.subcategory = [];
    this.homeService.getTilesSubCategory(this.getCategoryId).subscribe(res => {
      this.getSubcategoryId = res.subCategoryId;
      for (var i = 0; i < res.length; i++) this.userResponse.subcategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
    });
  };

  getType() {
    this.userResponse.type = [];
    this.homeService.getTilesType(this.getSubcategoryId).subscribe(res => {
      for (var i = 0; i < res.length; i++) this.userResponse.type.push(new SearchDataModal(res[i].typeId, res[i].typeName, res[i].typeName, "4"));
    });
  };

  loadData(obj, elemName, e?: any) {
    if (elemName == 'place') {
      this.getPlaceId = obj.id;
      this.getCategory();
      this.clearItems(elemName);
      this.userResponse.place = [obj];
      this.Step1SelectedValues.place = obj.name;
    }
    else if (elemName == 'category') {
      this.getCategoryId = obj.id;
      this.getSubCategory();
      this.clearItems(elemName);
      this.userResponse.category = [obj];
      this.Step1SelectedValues.category = obj.name;
    }
    else if (elemName == 'subcategory') {
      this.getSubcategoryId = obj.id;
      this.getType();
      this.clearItems(elemName);
      this.userResponse.subcategory = [obj];
      this.Step1SelectedValues.subcategory = obj.name;
    }
    else {
      e.currentTarget.className = "categ_outline_red mr-2";
      for (var i = 0; i < this.Step1SelectedValues.type.length; i++) {
        if (this.Step1SelectedValues.type[i] == obj.name) {
          this.Step1SelectedValues.type.splice(i, 1);
          e.currentTarget.className = "categ_outline_gray mr-2";
          return false;
        }
      }
      this.Step1SelectedValues.type.push(obj.name);
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
    }
  };

  next() {
    this.Step1Modal.getoffer_1 = new Array<OfferInfo1>();
    this.Step1Modal.getoffer_1.push(new OfferInfo1(this.Step1SelectedValues.place, this.Step1SelectedValues.category, this.Step1SelectedValues.subcategory, this.Step1SelectedValues.type));
    window.localStorage['GetOfferModal'] = JSON.stringify(this.Step1Modal);
    this.route.navigate(['/getoffer', 'step2']);
  };

}

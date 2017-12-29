import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { SearchDataModal } from '../home/searchData.modal';

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
  constructor(private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    this.loader = true;
    this.loadTypes();
  }

  loadTypes() {
    this.tilesData = [];
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    this.homeService.getTilesType(this.selectedTilesData.subcategory.id).subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) this.tilesData.push(new SearchDataModal(res[i].productTypeId, res[i].productTypeName, res[i].productTypeName, "4"));
      this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + this.selectedTilesData.subcategory.name;
      this.core.show(this.headerMessage);
      this.core.searchMsgToggle('get offers');
    });
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
    e.currentTarget.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.style.display = 'none';
    e.currentTarget.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.display = 'none';
    this.homeService.getTilesSubCategory(object.id).subscribe(res => {
      this.loadersubCategory = false;
      for (var i = 0; i < res.length; i++) this.subCategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
    });
  };

  refreshSubcategory(subcategory) {
    let updateStorage = JSON.parse(window.localStorage['levelSelections'])
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
  }

}

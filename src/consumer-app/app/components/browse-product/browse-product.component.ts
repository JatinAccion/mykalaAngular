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
    this.loaderCategory = true;
    document.getElementById("mySidenav").style.width = "300px";
    this.homeService.getTilesCategory(this.selectedTilesData.place.id).subscribe(res => {
      this.loaderCategory = false;
      this.categoryList = res;
    });
  };

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
  };

  loadSubcategory(e, object) {
    this.selectedCategoryData = object;
    this.subCategory = [];
    var cat_subMenu = <HTMLElement>document.getElementsByClassName('cat_subMenu')[0];
    cat_subMenu.style.display = 'none';
    if (e.currentTarget.nextElementSibling.style.display == 'block') e.currentTarget.nextElementSibling.style.display = 'none';
    else e.currentTarget.nextElementSibling.style.display = 'block';
    this.homeService.getTilesSubCategory(object.categoryId).subscribe(res => {
      for (var i = 0; i < res.length; i++) this.subCategory.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
    });
  };

  refreshSubcategory(subcategory) {
    let updateStorage = JSON.parse(window.localStorage['levelSelections'])
    updateStorage.subcategory.id = subcategory.id;
    updateStorage.subcategory.name = subcategory.name;
    updateStorage.subcategory.text = subcategory.text;
    updateStorage.category.id = this.selectedCategoryData.categoryId;
    updateStorage.category.name = this.selectedCategoryData.categoryName;
    updateStorage.category.text = this.selectedCategoryData.categoryName;
    window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
    this.closeNav();
    this.loadTypes();
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { SearchDataModal } from './searchData.modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  loader: boolean;
  tiles: any;
  searchData = [];

  userResponse = { place: '', type: '', category: '', subcategory: '' };
  response: any;
  breadCrums = [];
  customers: any = [];
  constructor(private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    this.core.hide();
    if (window.localStorage['token'] == undefined) this.core.clearUser();
    this.loader = true;
    this.getPlace();
  }

  //Get All Places
  getPlace() {
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1"));
      this.tiles = this.searchData;
    });
  }

  tileSelected(tile, IsBc) {
    var tile = tile['tile'];
    if (tile == undefined) this.breadCrums = [];
    for (var i = 0; i < this.breadCrums.length; i++) {
      let bc = this.breadCrums[i];
      if (bc.id == tile.id) this.breadCrums.splice(i + 1, 1);
    }
    if (IsBc == undefined) this.breadCrums.push(tile);
    this.searchData = [];

    //Get Category
    if (tile && tile.level == "1") {
      this.userResponse.place = tile.name;
      this.homeService.getTilesCategory(tile.id).subscribe((res) => {
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2"));
        this.tiles = this.searchData;
      });
    }
    //Get Sub Category
    else if (tile && tile.level == "2") {
      this.userResponse.category = tile.name;
      this.homeService.getTilesSubCategory(tile.id).subscribe((res) => {
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
        this.tiles = this.searchData;
      });
    }
    //Get Place
    else this.getPlace();
  }
}

import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { SearchDataModal } from './searchData.modal';
import { Router, RouterOutlet } from '@angular/router';

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

  userResponse = { place: [], type: [], category: [], subcategory: [] };
  response: any;
  breadCrums = [];
  customers: any = [];
  constructor(private routerOutlet: RouterOutlet, private router: Router, private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    this.core.hide();
    this.core.searchMsgToggle();
    if (window.localStorage['token'] == undefined) this.core.clearUser();
    this.getPlace();
  }

  //Get All Places
  getPlace() {
    this.loader = true;
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
      this.loader = true;
      this.userResponse.place = tile;
      this.homeService.getTilesCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2"));
        this.tiles = this.searchData;
      });
    }
    //Get Sub Category
    else if (tile && tile.level == "2") {
      this.loader = true;
      this.userResponse.category = tile;
      this.homeService.getTilesSubCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3"));
        this.tiles = this.searchData;
      });
    }
    //Get Type
    else if (tile && tile.level == "3") {
      this.userResponse.subcategory = tile;
      window.localStorage['levelSelections'] = JSON.stringify(this.userResponse);
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      this.router.navigateByUrl('/browse-product');
    }
    //Get Place
    else this.getPlace();
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  tiles: any;
  searchData = [];
  userResponse = { place: '', type: '', category: '', subcategory: '' };
  response: any;

  customers: any = [];
  constructor(private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    this.core.hide();
    this.tileSelected({ name: '' });
  }

  getNextMsg(name) {
    const search = this.searchData.filter(p => p.name === name);
    if (search && search.length > 0) {
      this.userResponse[search[0].level] = search[0].name;
      if (search[0].parent) {
        this.getNextMsg(search[0].parent);
      }
      return this.response = this.searchData.filter(p => p.parent === name);
    } else {
      return this.searchData.filter(p => p.parent === name);
    }
  }

  tileSelected(tile) {
    this.homeService.getTiles(tile.name).subscribe(res => {
      console.log(res);
      this.searchData = res;
      if (tile.name != '') {
        this.getNextMsg(tile.name);
        this.tiles = this.response;
      }
      else {
        this.getNextMsg('');
        this.tiles = this.searchData;
      }
    }, err => {
      console.log('Error Occured');
    });
  }
}

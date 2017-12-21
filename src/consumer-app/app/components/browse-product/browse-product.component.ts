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
  @Output() selectTile = new EventEmitter<any>();
  headerMessage: string;
  constructor(private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    this.selectedTilesData = JSON.parse(window.localStorage['levelSelections']);
    this.homeService.getTilesType(this.selectedTilesData.subcategory.id).subscribe(res => {
      for (var i = 0; i < res.length; i++) this.tilesData.push(new SearchDataModal(res[i].typeId, res[i].typeName, res[i].typeName, "4"));
      this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + 'wood ceiling lamps for you.';
      this.core.show(this.headerMessage);
      this.core.searchMsgToggle('get offers');
    });
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main_nav").style.marginLeft = "-250px";
  };

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main_nav").style.marginLeft = "0px";
  }

}

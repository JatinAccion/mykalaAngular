import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-browse-product',
  templateUrl: './browse-product.component.html',
  styleUrls: ['./browse-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BrowseProductComponent implements OnInit {
  @Input() selectedTilesData: any;
  @Input() tilesData: Array<any>;
  headerMessage: string;
  constructor(private core: CoreService) { }

  ngOnInit() {
    this.headerMessage = 'Nice! We matched' + ' ' + this.tilesData.length + ' ' + 'wood ceiling lamps for you.';
    this.core.show(this.headerMessage);
    this.core.searchMsgToggle('get offers');
  }

}

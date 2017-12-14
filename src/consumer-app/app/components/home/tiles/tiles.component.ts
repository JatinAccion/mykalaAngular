import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TilesComponent implements OnInit {
  @Input() tilesData: Array<any>;
  @Output() selectTile = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  getSelectedTile(tile) {
    this.selectTile.emit(tile)
  }

}

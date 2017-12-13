import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CuiComponent } from '../conversational/cui.interface';
import { Conversation } from '../../models/conversation';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  loadLevelOne: any;

  customers: any = [];
  constructor(private homeService: HomeService, private core: CoreService) { }

  ngOnInit() {
    this.core.hide();
    this.homeService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.homeService.getLevelOne().subscribe(
      res => {
        console.log(res);
        this.loadLevelOne = res;
      },
      err => {
        console.log('Error Occured');
      })
  }

  loadLevelTwo(element) {
    console.log(element)
  }
}

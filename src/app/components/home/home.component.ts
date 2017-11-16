import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HomeService } from './home.service';
import { CuiComponent } from '../conversational/cui.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, CuiComponent {
  @Input() data: any;
  customers: any = [];
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.getCustomers().subscribe(customers => {
    this.customers = customers;
      console.log(this.customers);
    });
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  customers: any = [];
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.getCustomers().subscribe(customers => {
    this.customers = customers;
      console.log(this.customers);
    });
  }

}

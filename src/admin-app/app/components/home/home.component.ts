import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { HomeService } from './home.service';
import { CoreService } from '../../services/core.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  customers: any = [];
  constructor(private core: CoreService, private router: Router) { }

  ngOnInit() {
    // this.homeService.getCustomers().subscribe(customers => {
    //   this.customers = customers;
    // });
    if (!this.core.user || !this.core.user.username) {
      this.router.navigateByUrl('/login');
    }
  }

}

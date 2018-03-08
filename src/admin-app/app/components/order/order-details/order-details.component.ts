
// #region imports
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Order } from '../../../../../models/order';
import { OrderService } from '../order.service';
// #endregion imports


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
  orders: Array<Order>;
  isCollapsed = true;
  constructor(private orderService: OrderService) {
    this.orders = new Array<Order>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.orderService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.orders.push(new Order(obj)); });
    });
  }
}

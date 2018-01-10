import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Order } from '../../../../../models/order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {
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

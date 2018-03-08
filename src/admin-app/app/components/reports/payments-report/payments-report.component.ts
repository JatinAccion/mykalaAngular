import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Order } from '../../../../../models/order';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsReportComponent implements OnInit {
  orders: Array<Order>;
  isCollapsed = true;
  type = 'line';
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  constructor(private reportsService: ReportsService) {
    this.orders = new Array<Order>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.reportsService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.orders.push(new Order(obj)); });
    });
  }
}

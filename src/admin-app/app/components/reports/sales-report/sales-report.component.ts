import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class SalesReportComponent implements OnInit {
  orders: ReportOrders;
  isCollapsed = true;
  type = 'line';
  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  constructor(private orderService: ReportsService) {
    this.orders = new ReportOrders();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.orderService.get(null).subscribe((res) => {
      // return res.forEach(obj => { this.orders.push(new Order(obj)); });
    });
  }
}

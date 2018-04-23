import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsReportComponent implements OnInit {
  loading: boolean;
  orders: ReportOrders;
  isCollapsed = true;
  reportModel = 'Monthly';
  details = { widgetType: 'TOTAL', year: 2018, month: 2 };
  widget = {
    'total': { widgetType: 'TOTAL', year: 2018, month: 2, value: 0 },
    'automatic': { widgetType: 'AUTOMATIC', year: 2018, month: 2, value: 0 },
    'manual': { widgetType: 'MANUAL', year: 2018, month: 2, value: 0 },
    'pending': { widgetType: 'PAENDING', year: 2018, month: 2, value: 0 }
  };
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  backgroundColors = ['#df7970', '#4c9ca0', '#ae7d99', '#c9d45c', '#5592ad', '#6d78ad', '#51cda0', '#f8f378', '#ae6653', '#60df63', '#60c9df'];
  type = 'pie';
  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Consumer Payment Types',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: this.backgroundColors,
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Consumer Payment Types'
    },
    legend: {
      display: true,
      position: 'left'
    },
    plugins: {
      datalabels: {
        color: 'white',
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 15;
        },
        font: {
          weight: 'bold'
        },
        formatter: Math.round
      }
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const allData = data.datasets[tooltipItem.datasetIndex].data;
          const tooltipLabel = data.labels[tooltipItem.index];
          const tooltipData = allData[tooltipItem.index];
          const total = Object.values(data.datasets[0]._meta)[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).reduce((a, b) => a + b);

          const tooltipPercentage = Math.round((tooltipData / total) * 100);
          return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
        }
      }
    }
  };
  constructor(private reportsService: ReportsService) {
    this.orders = new ReportOrders();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.goto('total', 0);
    this.goto('automatic', 0);
    this.goto('manual', 0);
    // this.goto('pending', 0);
    // this.getDetails('total');
  }
  goto(type, incr) {
    let date = new Date();
    let widget = this.widget.total;
    switch (type) {
      case 'total': widget = this.widget.total; break;
      case 'automatic': widget = this.widget.automatic; break;
      case 'manual': widget = this.widget.manual; break;
      case 'pending': widget = this.widget.pending; break;
    }
    date = new Date(widget.year, widget.month, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() || 0;
    this.reportsService.getPaymentCounts(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { widget.value = res.values; });
    this.getDetails(type);
  }
  getDetails(type) {
    let widget = this.widget.total;
    switch (type) {
      case 'one': widget = this.widget.total; break;
      case 'two': widget = this.widget.automatic; break;
      case 'three': widget = this.widget.manual; break;
      case 'four': widget = this.widget.pending; break;
    }
    this.reportsService.getPaymentReports(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
    this.reportsService.getconsumerPaymentReports(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
    this.details.widgetType = widget.widgetType;
    this.details.year = widget.year;
    this.details.month = widget.month;
    this.getPage(1);
  }
  setupSummary(res) {
    if (res) {
      this.summary.totalCostOfGoods = res.totalCostOfGoods;
      this.summary.totalShipCost = res.totalShipCost;
      this.summary.totalTaxesCost = res.totalTaxesCost;

      this.summary.saleRevenue = this.summary.totalCostOfGoods + this.summary.totalShipCost + this.summary.totalTaxesCost;
      this.summary.netRevenue = this.summary.totalCostOfGoods + this.summary.totalShipCost + + this.summary.totalTaxesCost;
    }
  }
  setupChartData(res) {
    this.data = {
      labels: res.map(p => p.paymentSource),
      datasets: [
        {
          label: 'Consumer Payment Types',
          data: res.map(p => p.count),
          backgroundColor: this.backgroundColors,
        }
      ]
    };
  }
  getPage(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate' };
    this.reportsService.getOrders(this.details.widgetType, this.details.year.toString(), (this.details.month + 1).toString(), searchParams).subscribe(res => {
      this.orders = res;
      this.loading = false;
    });
  }
}

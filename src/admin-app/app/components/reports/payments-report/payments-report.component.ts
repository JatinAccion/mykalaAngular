import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsReportComponent implements OnInit {
  orders: ReportOrders;
  isCollapsed = true;
  widget = {
    'total': { year: 2018, month: 2, value: 100 },
    'automatic': { year: 2018, month: 2, value: 100 },
    'manual': { year: 2018, month: 2, value: 100 },
    'pending': { year: 2018, month: 2, value: 100 }
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
          const total = data.datasets[0]._meta[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).reduce((a, b) => a + b);

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
    this.goto('pending', 0);
    this.getDetails('total');
  }
  goto(type, incr) {
    let date = new Date();
    switch (type) {
      case 'total':
        date = new Date(this.widget.total.year, this.widget.total.month, 1);
        date.setMonth(this.widget.total.month + incr);
        this.widget.total.year = date.getFullYear();
        this.widget.total.month = date.getMonth() || 0;
        this.reportsService.getPaymentCounts('Total', this.widget.total.year.toString(), (this.widget.total.month + 1).toString()).subscribe((res) => { this.widget.total.value = res.values; });
        break;
      case 'automatic': date = new Date(this.widget.automatic.year, this.widget.automatic.month, 1);
        date.setMonth(this.widget.automatic.month + incr);
        this.widget.automatic.year = date.getFullYear();
        this.widget.automatic.month = date.getMonth() || 0;
        this.reportsService.getPaymentCounts('Automatic', this.widget.automatic.year.toString(), (this.widget.automatic.month + 1).toString()).subscribe((res) => { this.widget.automatic.value = res.values; });
        break;
      case 'manual': date = new Date(this.widget.manual.year, this.widget.manual.month, 1);
        date.setMonth(this.widget.manual.month + incr);
        this.widget.manual.year = date.getFullYear();
        this.widget.manual.month = date.getMonth() || 0;
        this.reportsService.getPaymentCounts('Manual', this.widget.manual.year.toString(), (this.widget.manual.month + 1).toString()).subscribe((res) => { this.widget.manual.value = res.values; });
        break;
      case 'pending': date = new Date(this.widget.pending.year, this.widget.pending.month, 1);
        date.setMonth(this.widget.pending.month + incr);
        this.widget.pending.year = date.getFullYear();
        this.widget.pending.month = date.getMonth() || 0;
        this.reportsService.getPaymentCounts('Pending', this.widget.pending.year.toString(), (this.widget.pending.month + 1).toString()).subscribe((res) => { this.widget.pending.value = res.values; });
        break;
    }
  }
  getDetails(type) {
    switch (type) {
      case 'total':
        this.reportsService.getPaymentReports('Total', this.widget.total.year.toString(), (this.widget.total.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
        this.reportsService.getconsumerPaymentReports('Total', this.widget.total.year.toString(), (this.widget.total.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
        break;
      case 'automatic':
        this.reportsService.getPaymentReports('Automatic', this.widget.automatic.year.toString(), (this.widget.automatic.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
        this.reportsService.getconsumerPaymentReports('Automatic', this.widget.automatic.year.toString(), (this.widget.automatic.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
        break;
      case 'manual':
        this.reportsService.getPaymentReports('Manual', this.widget.manual.year.toString(), (this.widget.manual.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
        this.reportsService.getconsumerPaymentReports('Manual', this.widget.manual.year.toString(), (this.widget.manual.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
        break;
      case 'pending':
        this.reportsService.getPaymentReports('Pending', this.widget.pending.year.toString(), (this.widget.pending.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
        this.reportsService.getconsumerPaymentReports('Pending', this.widget.pending.year.toString(), (this.widget.pending.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
        break;
    }
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
}

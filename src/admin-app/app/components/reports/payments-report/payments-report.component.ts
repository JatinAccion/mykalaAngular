import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportOrders, ReportPaymentDatas } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';
import DateUtils from '../../../../../common/utils';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsReportComponent implements OnInit {
  sortDirection: 'DESC';
  sortColumn = 'paymentInitiatedDate';
  page = 0;
  activeWidget: { widgetType: string; year: number; month: number; value: number; };
  summaryType = 'TOTAL';
  loading: boolean;
  orders: ReportPaymentDatas;
  dateUtils = new DateUtils();
  isCollapsed = true;
  reportModel = 'Monthly';
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  details = { widgetType: 'TOTAL/PAID', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth) };
  widget = {
    'total': { widgetType: 'TOTAL/PAID', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'automatic': { widgetType: 'AUTOMATIC/PAID', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'manual': { widgetType: 'MANUAL/PAID', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'pending': { widgetType: 'TOTAL/PENDING', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 }
  };
  summaryTotal = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0, stripeProcessingFees: 0, commissionFees: 0, totalPayment: 1 };
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0, stripeProcessingFees: 0, commissionFees: 0, totalPayment: 1 };
  backgroundColors = ['#df7970', '#4c9ca0', '#ae7d99', '#c9d45c', '#5592ad', '#6d78ad', '#51cda0', '#f8f378', '#ae6653', '#60df63', '#60c9df'];
  type = 'pie';
  data = {
    labels: [],//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Consumer Payment Types',
        data: [],//[65, 59, 80, 81, 56, 55, 40],
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
          return context.dataset.data[context.dataIndex] > 0;
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
    this.orders = new ReportPaymentDatas();
  }

  ngOnInit() {
    this.getData();
    this.getPage(1);
  }
  getData(event?:any) {
    if(event && event.target.value)
    {
        this.reportModel= event.target.value; 
    }
    this.goto('total', 0);
    this.goto('automatic', 0);
    this.goto('manual', 0);
    this.goto('pending', 0);
    this.getDetails('total');
  }
  gotoAll(type, incr) {
    this.goto('total', incr);
    this.goto('automatic', incr);
    this.goto('manual', incr);
    this.goto('pending', incr);
    this.getDetails('total');
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
    date = new Date(widget.year, widget.month - 1, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month - 1 + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() + 1;
    widget.monthName = this.dateUtils.getMonthName(widget.month || 12);
    this.reportsService.getPaymentCounts(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month).toString()).subscribe((res) => { widget.value = res.values; });
    // this.getDetails(type);
  }
  getDetails(type) {
    let widget = this.widget.total;
    this.activeWidget = this.widget.total;
    switch (type) {
      case 'total': widget = this.widget.total; break;
      case 'automatic': widget = this.widget.automatic; break;
      case 'manual': widget = this.widget.manual; break;
      case 'pending': widget = this.widget.pending; break;
    }
    this.activeWidget = widget;
    this.summaryTotal.saleRevenue = 0;
    this.getSummary();
    this.reportsService.getconsumerPaymentReports(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month).toString()).subscribe((res) => { this.setupChartData(res); });
    this.details.widgetType = widget.widgetType;
    this.details.year = widget.year;
    this.details.month = widget.month;
    // this.getPage(1);
  }
  async getSummary() {
    if (this.summaryType === 'AVG') {
      if (this.summaryTotal.saleRevenue === 0) {
        await this.getPaymentReportSummary();
      }
      this.summary.totalCostOfGoods = this.summaryTotal.totalCostOfGoods / this.summaryTotal.totalPayment;
      this.summary.totalShipCost = this.summaryTotal.totalShipCost / this.summaryTotal.totalPayment;
      this.summary.totalTaxesCost = this.summaryTotal.totalTaxesCost / this.summaryTotal.totalPayment;
      this.summary.stripeProcessingFees = this.summaryTotal.stripeProcessingFees / this.summaryTotal.totalPayment;
      this.summary.commissionFees = this.summaryTotal.commissionFees / this.summaryTotal.totalPayment;
      this.summary.totalPayment = this.summaryTotal.totalPayment / this.summaryTotal.totalPayment;
      this.summary.saleRevenue = this.summaryTotal.saleRevenue / this.summaryTotal.totalPayment;
      this.summary.netRevenue = this.summaryTotal.netRevenue / this.summaryTotal.totalPayment;
    } else {
      await this.getPaymentReportSummary();
      this.summary.totalCostOfGoods = this.summaryTotal.totalCostOfGoods;
      this.summary.totalShipCost = this.summaryTotal.totalShipCost;
      this.summary.totalTaxesCost = this.summaryTotal.totalTaxesCost;
      this.summary.stripeProcessingFees = this.summaryTotal.stripeProcessingFees;
      this.summary.commissionFees = this.summaryTotal.commissionFees;
      this.summary.totalPayment = this.summaryTotal.totalPayment;
      this.summary.saleRevenue = this.summaryTotal.saleRevenue;
      this.summary.netRevenue = this.summaryTotal.netRevenue;
    }
  }
  getPaymentReportSummary() {
    return this.reportsService.getPaymentReports(this.activeWidget.widgetType, this.summaryType, this.activeWidget.year.toString(), this.reportModel !== 'Monthly' ? '' : (this.activeWidget.month).toString()).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.summaryTotal.totalCostOfGoods = res[0].totalCostOfGoods;
        this.summaryTotal.totalShipCost = res[0].totalShipCost;
        this.summaryTotal.totalTaxesCost = res[0].totalTaxesCost;
        this.summaryTotal.stripeProcessingFees = res[0].stripeProcessingFees;
        this.summaryTotal.commissionFees = res[0].commissionFees;
        this.summaryTotal.totalPayment = res[0].totalPayment;
        this.summaryTotal.saleRevenue = res[0].sellerPayment;
        this.summaryTotal.netRevenue = this.summaryTotal.commissionFees;
      } else {
        this.summaryTotal.totalCostOfGoods = 0;
        this.summaryTotal.totalShipCost = 0;
        this.summaryTotal.totalTaxesCost = 0;
        this.summaryTotal.saleRevenue = 0;
        this.summaryTotal.netRevenue = 0;
        this.summaryTotal.stripeProcessingFees = 0;
        this.summaryTotal.commissionFees = 0;
        this.summaryTotal.totalPayment = 1;
      }
    });
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
  // getPage(page: number) {
  //   this.loading = true;
  //   const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate,ASC' };
  //   this.reportsService.getPaymentDetails(searchParams).subscribe(res => {
  //     this.orders = res;
  //     this.loading = false;
  //   });
  // }
  getPage(page: number) {
    this.page = page;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
  getPageSorted(page: number, sortColumn: string, sortDirection: string = 'desc') {
    this.loading = true;

    const searchParams = {
      page: page - 1, size: 10, sortOrder: sortDirection, sort: `${sortColumn},${sortDirection.toUpperCase()}`
    };

    this.reportsService.getPaymentDetails(searchParams).subscribe(res => {
      this.orders = res;
      this.loading = false;
    });
  }
  onSorted($event) { // $event = {sortColumn: 'id', sortDirection:'asc'}
    this.sortColumn = $event.sortColumn;
    this.sortDirection = $event.sortDirection;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
}

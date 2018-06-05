import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders, ReportProductSolds } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';
import DateUtils from '../../../../../common/utils';
import { ReviewItem } from '../../../../../models/report-review';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class SalesReportComponent implements OnInit {
  sortDirection: any;
  sortColumn: any;
  gridData: ReportProductSolds;
  dateUtils = new DateUtils();
  currentJustify = 'start';
  currentOrientation = 'horizontal';
  loading: boolean;
  orders: ReportOrders;
  isCollapsed = true; p = 1; size = 5;
  type = 'bar';
  data: any;
  options: any;
  reportModel = 'Monthly';
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  details = { widgetType: 'one', year: this.currentYear, month: this.currentMonth };
  widget: any;
  reportYears = 5;
  stacks = ['stack 0'];
  backgroundColors = [];
  colors = [];
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  constructor(private reportsService: ReportsService) {
    this.orders = new ReportOrders();
  }
  initializeWidget() {
    this.widget = {
      'one': { widgetType: 'one', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'two': { widgetType: 'two', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'three': { widgetType: 'three', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'four': { widgetType: 'four', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], countValues: [], countValue: 0, first: false, last: true, index: 0 },
      'grid': { widgetType: 'grid', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 }
    };
  }
  initializeBackGroundColors() {
    this.backgroundColors = ['#df7970', '#4c9ca0', '#ae7d99', '#c9d45c', '#5592ad', '#6d78ad', '#51cda0', '#f8f378', '#ae6653', '#60df63', '#60c9df'];
    this.colors = ['#94A5B7', '#D6ECF6', '#ff0000', '#2A4B70'];
  }
  inititializeData(dataLables?: Array<ReviewItem>,
    orders?: Array<number>,
    offers?: Array<number>,
    returns?: Array<number>) {
    if (dataLables && orders && offers && returns) {
      this.data = {
        labels: this.reportModel === 'Monthly'
          ? dataLables.map(p => this.reportsService.formatDate(new Date(p.year, p.month - 1, 1), 'MMM YYYY'))
          : dataLables.map(p => p.year),
        datasets: [
          {
            label: 'Orders',
            data: orders,
            backgroundColor: this.colors[0],
            stack: this.stacks[0],
          },
          {
            label: 'Offers',
            data: offers,
            backgroundColor: this.colors[1],
            stack: this.stacks[0],
          },
          {
            label: 'Returns',
            data: returns.map(p => -p),
            backgroundColor: this.colors[2],
            stack: this.stacks[0],
          },
        ]
      };
    }
  }
  initializeOptions() {
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
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
  }
  getReportData(reportModel) {
    let reportData = new Array<ReviewItem>();
    if (reportModel === 'Monthly') {
      reportData = this.reportsService.getPrev12Months(this.details.year, this.details.month);
    } else {
      reportData = this.reportsService.getPrev5Years(this.details.year);
    }
    return reportData;
  }
  ngOnInit() {
    this.initializeWidget();
    this.inititializeData();
    this.initializeOptions();
    this.initializeBackGroundColors();
    this.getData();
    this.setupChartData();
    this.getGridData(1);
  }
  getData() {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth() + 1;
    this.initializeWidget();
    this.getWidData();
    this.setupChartData();
    this.getGridData(1);
  }
  getWidData() {
    const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();

    this.reportsService.srGetWidOneData(this.currentYear.toString(), this.reportModel !== 'Monthly' ? '' : (this.currentMonth).toString()).subscribe(res => {
      const reportData = this.getReportData(this.reportModel);
      for (let i = 0; i < reportData.length; i++) {
        const element = reportData[i];
        const dataElement = res.firstOrDefault(p => (p.year === element.year && p.month === 0) || (p.month === element.month && p.year === 0));
        if (dataElement) {
          element.count = dataElement.count || 0;
          element.total = dataElement.total || 0;
        } else {
          element.count = 0;
          element.total = 0;
        }
      }
      this.widget.one.values = reportData.map(p => p.count);

      this.widget.one.index = this.widget.one.values.length - 1;
      this.widget.one.value = this.widget.one.values[this.widget.one.index];

    });
    this.reportsService.srGetWidTwoData(this.currentYear.toString(), this.reportModel !== 'Monthly' ? '' : (this.currentMonth).toString()).subscribe(res => {
      const reportData = this.getReportData(this.reportModel);
      for (let i = 0; i < reportData.length; i++) {
        const element = reportData[i];
        const dataElement = res.firstOrDefault(p => (p.year === element.year && p.month === 0) || (p.month === element.month && p.year === 0));
        if (dataElement) {
          element.count = dataElement.count || 0;
          element.total = dataElement.total || 0;
        } else {
          element.count = 0;
          element.total = 0;
        }
      }
      this.widget.two.values = reportData.map(p => p.total);

      this.widget.two.index = this.widget.two.values.length - 1;
      this.widget.two.value = this.widget.two.values[this.widget.two.index];

    });
    this.reportsService.srGetWidFourData(this.currentYear.toString(), this.reportModel !== 'Monthly' ? '' : (this.currentMonth).toString()).subscribe(res => {
      const reportData = this.getReportData(this.reportModel);
      for (let i = 0; i < reportData.length; i++) {
        const element = reportData[i];
        element.count = 0;
        element.total = 0;
        const dataElements = res.filter(p => (p.year === element.year && p.month === 0) || (p.month === element.month && p.year === 0));
        if (dataElements && dataElements.length > 0) {
          dataElements.forEach(p => {
            if (p.count > 0) {
              element.count = p.count;
            }
            if (p.total > 0) {
              element.total = p.total;
            }
          });
        }
      }
      this.widget.four.countValues = reportData.map(p => p.count);
      this.widget.four.values = reportData.map(p => p.total);
      this.widget.four.index = this.widget.four.values.length - 1;
      this.widget.four.value = this.widget.four.values[this.widget.four.index];
      this.widget.four.countValue = this.widget.four.countValues[this.widget.four.index];
    });
  }

  goto(type, incr) {
    let date = new Date();
    let widget = this.widget.one;

    const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
    switch (type) {
      case 'one': widget = this.widget.one; break;
      case 'two': widget = this.widget.two; break;
      // case 'three': widget = this.widget.three; break;
      case 'four': widget = this.widget.four; break;
      case 'grid': widget = this.widget.grid; break;
    }
    widget.index += incr;
    widget.first = false;
    widget.last = false;
    if (widget.index <= 0) {
      widget.index = 0;
      widget.first = true;
      widget.last = false;
    }
    if (widget.index >= widget.values.length - 1) {
      widget.index = widget.values.length - 1;
      widget.first = false;
      widget.last = true;
    }
    date = new Date(widget.year, widget.month - 1, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month - 1 + incr);
    }
    widget.year = date.getFullYear();
    widget.month = (date.getMonth() || 0) + 1;
    widget.monthName = this.dateUtils.getMonthName(widget.month || 12);

    if (type !== 'grid') {
      widget.value = widget.values[widget.index];
      if (type === 'four') {
        widget.countValue = widget.countValues[widget.index];
      }
    } else {
      this.getGridData(1);
    }
  }
  getDetails(type) {
    // let widget = this.widget.one;
    // switch (type) {
    //   case 'one': widget = this.widget.one; break;
    //   case 'two': widget = this.widget.two; break;
    //   case 'three': widget = this.widget.three; break;
    //   case 'four': widget = this.widget.four; break;
    // }
    // this.reportsService.srGetWidOneData(widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { this.setupSummary(res[0]); });
    // this.reportsService.getconsumerPaymentReports(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { this.setupChartData(res); });
    // this.details.widgetType = widget.widgetType;
    // this.details.year = widget.year;
    // this.details.month = widget.month;
    // this.getPage(1);
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
  setupChartData() {
    const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();

    this.reportsService.srGetChartData(this.currentYear.toString(), this.reportModel !== 'Monthly' ? '' : (this.currentMonth).toString()).subscribe(res => {
      const reportData = this.getReportData(this.reportModel);
      for (let i = 0; i < reportData.length; i++) {
        const element = reportData[i];
        const dataElement = res.firstOrDefault(p => (p.year === element.year && p.month === 0) || (p.month === element.month && p.year === 0));
        if (dataElement) {
          element.orderCount = dataElement.orderCount || 0;
          element.offerCount = dataElement.offerCount || 0;
          element.returns = dataElement.returns || 0;
        } else {
          element.orderCount = 0;
          element.offerCount = 0;
          element.returns = 0;
        }
      }
      this.inititializeData(reportData,
        reportData.map(p => p.orderCount),
        reportData.map(p => p.offerCount),
        reportData.map(p => p.returns));
      this.initializeOptions();
    });
  }

  getGridData(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 1000, sortOrder: 'asc', elementType: 'createdDate' };
    this.reportsService.srGetGridData(this.widget.grid.year.toString(), this.reportModel !== 'Monthly' ? '' : (this.widget.grid.month).toString(), searchParams).subscribe(res => {
      this.gridData = res;
      this.widget.grid.values = this.getReportData(this.reportModel).map(p => p.count);
      this.widget.grid.index = this.widget.grid.values.length - 1;
      this.loading = false;
    });
  }
  onSorted($event) { // $event = {sortColumn: 'id', sortDirection:'asc'}
    this.sortColumn = $event.sortColumn;
    this.sortDirection = $event.sortDirection;
    const sortDirectionIndex = this.sortDirection === 'asc' ? 1 : -1;
    switch (this.sortColumn) {
      case 'productPlace':
        this.gridData.content = this.gridData.content.sort((a, b) => a.productPlace < b.productPlace ? -1 * sortDirectionIndex : 1 * sortDirectionIndex);

        break;
      case 'productCategory':
        this.gridData.content = this.gridData.content.sort((a, b) => a.productCategory < b.productCategory ? -1 * sortDirectionIndex : 1 * sortDirectionIndex);

        break;
      case 'productSubCategory':
        this.gridData.content = this.gridData.content.sort((a, b) => a.productSubCategory < b.productSubCategory ? -1 * sortDirectionIndex : 1 * sortDirectionIndex);

        break;
      case 'totalproduct':
        this.gridData.content = this.gridData.content.sort((a, b) => a.totalproduct < b.totalproduct ? -1 * sortDirectionIndex : 1 * sortDirectionIndex);

        break;
    }
  }
}

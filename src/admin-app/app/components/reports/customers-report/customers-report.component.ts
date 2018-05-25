import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';
import DateUtils from '../../../../../common/utils';
import { ReportConsumers } from '../../../../../models/report-consumer';
import { ReportReviewSummary, ReviewItem } from '../../../../../models/report-review';

@Component({
  selector: 'app-customers-report',
  templateUrl: './customers-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomersReportComponent implements OnInit {
  sortDirection = 'asc';
  sortColumn = 'firstName';
  page = 0;
  consumerName: any;
  consumers: ReportConsumers;
  loading: boolean;
  isCollapsed = true;
  reportModel = 'Monthly';
  dateUtils = new DateUtils();
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  details = { widgetType: 'new', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), };
  widget = {
    'new': { widgetType: 'New', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'active': { widgetType: 'Active', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'total': { widgetType: 'Total', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 },
    'closed': { widgetType: 'Closed', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0 }
  };
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  stacks = ['stack 0'];
  backgroundColors = ['#60c9df', '#06c9df', '#609cdf'];
  colors = ['#94A5B7', '#D6ECF6', '#ff0000', '#2A4B70'];
  type = 'bar';
  data = this.chartDataObj();
  options = this.chartOptionsObj();
  constructor(private reportsService: ReportsService) {
    this.consumers = new ReportConsumers();
  }
  chartDataObj(dataLables?: Array<ReviewItem>,
    existingConsumers?: Array<number>,
    newConsumers?: Array<number>,
    closedConsumers?: Array<number>) {
    if (dataLables && existingConsumers && newConsumers && closedConsumers) {
      const data = {
        labels: this.reportModel === 'Monthly'
          ? dataLables.map(p => this.reportsService.formatDate(new Date(p.year, p.month - 1, 1), 'MMM YYYY'))
          : dataLables.map(p => p.year), // new Date(p.year, 0, 1)),
        datasets: [
          {
            label: 'Existing',
            data: existingConsumers,
            backgroundColor: this.colors[0],
            stack: this.stacks[0],
          },
          {
            label: 'New',
            data: newConsumers,
            backgroundColor: this.colors[1],
            stack: this.stacks[0],
          },
          {
            label: 'Closed',
            data: closedConsumers.map(p => -p),
            backgroundColor: this.colors[2],
            stack: this.stacks[0],
          },
        ]
      };
      return data;
    }
    return null;
  }
  chartOptionsObj() {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Consumers'
      },
      legend: {
        display: true,
        position: 'top'
      },
      // scales: {
      //   xAxes: [{
      //     display: true,
      //     type: 'time',
      //     stacked: true,
      //     time: {
      //       unit: this.reportModel === 'Monthly' ? 'month' : 'year',
      //       format: this.reportModel === 'Monthly' ? 'MMM YY' : 'YYYY',
      //     }
      //   }],
      // },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
      plugins: {
        datalabels: {
          color: 'blue',
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
          font: {
            weight: 'bold'
          },
          formatter: Math.round && Math.abs
        }
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        // callbacks: {
        //   label: function (tooltipItem, data) {
        //     const allData = data.datasets[tooltipItem.datasetIndex].data;
        //     const tooltipLabel = data.datasets[tooltipItem.datasetIndex].label;
        //     const tooltipData = allData[tooltipItem.index];
        //     const total = Object.values(data.datasets[0]._meta)[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).pop();

        //     const tooltipPercentage = Math.round((tooltipData / total) * 100);
        //     return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
        //   }
        // }
      }
    };
    return options;
  }
  ngOnInit() {
    this.getData();
    this.getPage(1);
  }
  getData() {
    this.goto('new', 0);
    this.goto('active', 0);
    this.goto('total', 0);
    this.goto('closed', 0);
    // this.getDetails('new');
  }
  goto(type, incr) {
    let date = new Date();
    let widget = this.widget.new;
    switch (type) {
      case 'new': widget = this.widget.new; break;
      case 'active': widget = this.widget.active; break;
      case 'total': widget = this.widget.total; break;
      case 'closed': widget = this.widget.closed; break;
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
    this.reportsService.getConsumerCount(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month).toString()).subscribe((res) => { widget.value = res.count; });
    this.getDetails(type);
  }
  getDetails(type) {
    let widget = this.widget.new;
    switch (type) {
      case 'new': widget = this.widget.new; break;
      case 'active': widget = this.widget.active; break;
      case 'total': widget = this.widget.total; break;
      case 'closed': widget = this.widget.closed; break;
    }

    this.reportsService.getConsumerYearlyReport(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month).toString()).subscribe((res) => { this.setupChartData(res, widget.widgetType); });
    this.details.widgetType = widget.widgetType;
    this.details.year = widget.year;
    this.details.month = widget.month;
  }
  setupChartData(res: ReportReviewSummary, widgetType) {
    const reportData = this.getReportData(this.reportModel);
    for (let i = 0; i < reportData.length; i++) {
      const element = reportData[i];
      const dataElement = res.consumerRecords.firstOrDefault(p => p.year === element.year && p.month === element.month);
      if (dataElement) {
        element.totalMembers = dataElement.totalMembers || 0;
        element.newMembers = dataElement.newMembers || 0;
        element.closedAccounts = dataElement.closedAccounts || 0;
      } else {
        if (i > 0) {
          const prevElement = reportData[i - 1];
          element.totalMembers = prevElement.totalMembers + prevElement.newMembers;
        } else {
          element.totalMembers = 0;
        }
        element.newMembers = 0;
        element.closedAccounts = 0;
      }
    }

    this.data = this.chartDataObj(reportData,
      reportData.map(p => p.totalMembers),
      reportData.map(p => p.newMembers),
      reportData.map(p => p.closedAccounts));
    this.options = this.chartOptionsObj();
  }


  private getReportData(reportModel) {
    let reportData = new Array<ReviewItem>();
    if (reportModel === 'Monthly') {
      reportData = this.reportsService.getPrev12Months(this.details.year, this.details.month);
    } else {
      reportData = this.reportsService.getPrev5Years(this.details.year);
    }
    return reportData;
  }

  // getPage(page: number) {
  //   this.loading = true;
  //   const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', firstName: this.consumerName };
  //   this.reportsService.getConsumers(searchParams).subscribe(res => {
  //     this.consumers = res;
  //     this.loading = false;
  //   });
  // }
  getPage(page: number) {
    this.page = page;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
  getPageSorted(page: number, sortColumn: string, sortDirection: string = 'desc') {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: sortDirection, elementType: sortColumn, firstName: this.consumerName };

    this.reportsService.getConsumers(searchParams).subscribe(res => {
      this.consumers = res;
      this.loading = false;
    });
  }
  onSorted($event) { // $event = {sortColumn: 'id', sortDirection:'asc'}
    this.sortColumn = $event.sortColumn;
    this.sortDirection = $event.sortDirection;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
}

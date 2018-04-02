import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-customers-report',
  templateUrl: './customers-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomersReportComponent implements OnInit {
  loading: boolean;
  orders: ReportOrders;
  isCollapsed = true;
  reportModel = 'Monthly';
  details = { widgetType: 'new', year: 2018, month: 2 };
  widget = {
    'new': { widgetType: 'New', year: 2018, month: 2, value: 0 },
    'active': { widgetType: 'Active', year: 2018, month: 2, value: 0 },
    'total': { widgetType: 'Total', year: 2018, month: 2, value: 0 },
    'closed': { widgetType: 'Closed', year: 2018, month: 2, value: 0 }
  };
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  backgroundColors = '#60c9df';
  type = 'bar';
  data = {
    labels: [],
    datasets: [
      {
        label: 'Consumer',
        data: [],
        backgroundColor: this.backgroundColors,
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Consumers'
    },
    legend: {
      display: false,
      position: 'left'
    },
    plugins: {
      datalabels: {
        color: 'blue',
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
          const total = data.datasets[0]._meta[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).pop();

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
    this.goto('new', 0);
    this.goto('active', 0);
    this.goto('total', 0);
    // this.goto('closed', 0);
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
    date = new Date(widget.year, widget.month, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() || 0;
    this.reportsService.getConsumerCount(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { widget.value = res.count; });
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

    this.reportsService.getConsumerYearlyReport(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe((res) => { this.setupChartData(res, widget.widgetType); });
    this.details.widgetType = widget.widgetType;
    this.details.year = widget.year;
    this.details.month = widget.month;
    this.getPage(1);
  }
  setupChartData(res, widgetType) {
    const reportData = new Array<any>();
    const date = new Date(this.details.year, this.details.month, 1);
    let year = this.details.year - 1;
    let month = this.details.month + 2;
    let runningTotal = 0;
    for (let i = 0; i < 12; i++) {
      // const filter = res.filter(p => p.year.year === year && p.year.month === month);
      const filter = res.filter(p => p.month === month);
      if (widgetType !== 'Total' && widgetType !== 'Active') {
        runningTotal = 0;
      }
      if (filter.length > 0) {
        runningTotal = filter[0].count || 0;
      }
      reportData.push({ count: runningTotal, month: `${year}-${month}` });

      if (month === 12) {
        month = 1; year++;
      } else { month++; }
    }
    this.data = {
      labels: reportData.map(p => p.month),
      datasets: [
        {
          label: 'Consumer Payment Types',
          data: reportData.map(p => p.count),
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

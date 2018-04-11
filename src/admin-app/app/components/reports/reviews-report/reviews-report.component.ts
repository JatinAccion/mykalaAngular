import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';

import { forkJoin } from 'rxjs/observable/forkJoin';
import { RetailerReviews, RetailerReview } from '../../../../../models/retailer';

import { Chart } from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import DateUtils from '../../../../../common/utils';

@Component({
  selector: 'app-reviews-report',
  templateUrl: './reviews-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewsReportComponent implements OnInit {
  dateUtils = new DateUtils();
  currentMonth = 1;
  retailers = new RetailerReviews();
  review_days: number[];
  review_no_count: number[];
  review_count: number[];
  review_avg: number;
  rating_data: number[];
  loading: boolean;
  orders: ReportOrders;
  isCollapsed = true;
  reportModel = 'Yearly';
  currentYear = new Date().getFullYear();
  retailerName = '';
  ratings = [1, 2, 3, 4, 5];
  details = { widgetType: 'one', year: this.currentYear, month: this.currentMonth };
  widget = {
    'one': { widgetType: 'Average', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'two': { widgetType: 'Ratings', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'three': { widgetType: 'Completed', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'four': { widgetType: 'NotCompleted', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 }
  };
  colors = ['#94A5B7', '#D6ECF6', '#436798', '#2A4B70'];
  reportYears = 5;
  stacks = ['stack 0'];
  labels = ['Average Ratings', 'Total Ratings', 'Reviews Completed', 'Reviews Not Completed', 'Average Reviews'];
  yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => (p - i).toString()).reverse();
  monthLabels = this.dateUtils.getMonths();
  type = 'bar';
  rating_avg = 1.67;
  data_avg = {
    labels: this.yearLabels,
    datasets: [
      {
        type: 'line',
        label: this.labels[0],
        fill: false,
        borderColor: this.colors[3],
        borderDash: [5, 5],
        borderWidth: 2,
        data: this.yearLabels.map(p => this.rating_avg)
      },
      {
        type: 'line',
        label: this.labels[1],
        backgroundColor: this.colors[3],
        fill: false,
        data: [0, 0, 5, 1, 3.34]
      }
    ]
  };
  data = {
    labels: this.yearLabels,
    datasets: [
      {
        type: 'line',
        label: this.labels[0],
        fill: false,
        borderColor: this.colors[3],

        borderDash: [5, 5],
        borderWidth: 2,
        data: [10, 10, 10, 10, 10]
      },
      {
        label: this.labels[2], stack: this.stacks[0],
        backgroundColor: this.colors[0],
        data: [0, 0, 8, 6, 82]
      },
      {
        label: this.labels[3], stack: this.stacks[0],
        backgroundColor: this.colors[1],
        data: [0, 0, 0, 0, 32]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Retailer Reviews'
    },
    plugins: {
      datalabels: {
        color: 'blue',
        display: function (context) {
          return false; // context.dataset.data[context.dataIndex] > 0;
        },
        font: {
          weight: 'bold'
        },
        formatter: Math.round
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        time: {
          unit: 'year',
          // year: 'YYYY',
          format: this.reportModel === 'Monthly' ? 'MMM' : 'YYYY',
          //  round: 'day'
        }
      }],
    },
  };
  options_avg = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Retailer Average Ratings'
    },
    plugins: {
      datalabels: {
        color: 'blue',
        display: function (context) { return false; },
        font: { weight: 'bold' },
        formatter: Math.round
      }
    },
    scales: {
      xAxes: [{
        display: true,
        type: 'time',
        time: {
          unit: this.reportModel === 'Monthly' ? 'month' : 'year',
          format: this.reportModel === 'Monthly' ? 'MMM YYYY' : 'YYYY',
        }
      }],
    },
  };
  options_retailerRatings = {
    maintainAspectRatio: true,
    responsive: true,
    legend: false,
    title: {
      display: false,
      text: 'Retailer Ratings'
    },
    plugins: {
      datalabels: {
        color: 'blue',
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 0;
        },
        font: {
          weight: 'bold'
        },
        formatter: Math.round
      }
    },
    scales:
      {
        xAxes: [{
          gridLines: {
            display: false,
          },
          display: false
        }]
      }
  };

  constructor(private reportsService: ReportsService, ) {
    this.orders = new ReportOrders();
  }

  ngOnInit() {
    Chart.pluginService.register(ChartDataLabels);
    this.getData();
    this.getPage(1);
  }
  getData() {
    this.yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => (p - i).toString()).reverse();
    this.getChartData();
  }
  initializeWidget() {
    this.widget = {
      'one': { widgetType: 'Average', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'two': { widgetType: 'Ratings', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'three': { widgetType: 'Completed', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
      'four': { widgetType: 'NotCompleted', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 }
    };
  }
  getChartData() {
    let date = new Date();
    let year = this.currentYear;
    let month = this.currentMonth;
    const completedReview = this.reportsService.getCompletedReview(year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    const avgReview = this.reportsService.getAvgReview(year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    const avgResponseTime = this.reportsService.getAvgResponseTime(year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    this.initializeWidget();
    forkJoin([completedReview, avgReview, avgResponseTime]).subscribe((res) => {
      const monthLabels = [];
      const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
      this.rating_avg = res[1].avg;
      this.review_avg = res[0].avg;
      this.review_days = [];
      this.review_count = [];
      this.review_no_count = [];
      this.rating_data = [];
      if (this.reportModel === 'Monthly') {
        const reportData = new Array<any>();
        date = new Date(this.currentYear, this.currentMonth, 1);
        year = this.currentYear - 1;
        month = this.currentMonth + 1;
        for (let i = 0; i < 12; i++) {
          monthLabels.push({ month: month - 1, year: year });
          const filter = res[1].avgReviewCount.filter(p => p.month === month);
          this.rating_data.push(filter.length > 0 ? filter[0].avg : 0);
          const filter1 = res[0].reviewOrderAggregation.filter(p => p.month === month);
          this.review_count.push(filter1.length > 0 ? filter1[0].completed : 0);
          const filter2 = res[0].reviewOrderAggregation.filter(p => p.month === month);
          this.review_no_count.push(filter2.length > 0 ? filter2.map(r => r.total - r.completed)[0] : 0);
          const filter3 = res[2].filter(p => p.month === month);
          this.review_days.push(filter3.length > 0 ? filter3.map(r => r.diff)[0] : 0);

          if (month === 12) { month = 1; year++; } else { month++; }
        }
      } else {
        this.rating_data = yearLabels.map(p => res[1].avgReviewCount.filter(q => q.year === p).length > 0 ? res[1].avgReviewCount.filter(q => q.year === p)[0].avg : 0);
        this.review_count = yearLabels.map(p => res[0].reviewOrderAggregation.filter(q => q.year === p).length > 0 ? res[0].reviewOrderAggregation.filter(q => q.year === p)[0].completed : 0);
        this.review_no_count = yearLabels.map(p => res[0].reviewOrderAggregation.filter(q => q.year === p).length > 0 ? res[0].reviewOrderAggregation.filter(q => q.year === p).map(r => r.total - r.completed)[0] : 0);
        this.review_days = yearLabels.map(p => res[2].filter(q => q.year === p).length > 0 ? res[2].filter(q => q.year === p).map(r => r.diff)[0] : 0);
      }



      this.widget.one.values = this.review_count;
      this.widget.two.values = this.review_days;
      this.widget.three.values = this.review_no_count;
      this.widget.four.values = this.rating_data;

      this.widget.one.index = this.review_count.length - 1;
      this.widget.two.index = this.review_days.length - 1;
      this.widget.three.index = this.review_no_count.length - 1;
      this.widget.four.index = this.rating_data.length - 1;

      this.widget.one.value = this.widget.one.values[this.widget.one.index];
      this.widget.two.value = this.widget.two.values[this.widget.two.index];
      this.widget.three.value = this.widget.three.values[this.widget.three.index];
      this.widget.four.value = this.widget.four.values[this.widget.four.index];

      this.data_avg = {
        labels: this.reportModel === 'Monthly' ? monthLabels.map(p => new Date(p.year, p.month, 1)) : yearLabels.map(p => new Date(p, 0, 1)),
        datasets: [
          {
            type: 'line',
            label: this.labels[0],
            fill: false,
            borderColor: this.colors[3],
            borderDash: [5, 5],
            borderWidth: 2,
            data: this.reportModel === 'Monthly' ? monthLabels.map(p => this.rating_avg) : yearLabels.map(p => this.rating_avg)
          },
          {
            type: 'line',
            label: this.labels[1],
            backgroundColor: this.colors[3],
            fill: false,
            data: this.rating_data
          }
        ]
      };
      this.data = {
        labels: this.reportModel === 'Monthly' ? monthLabels.map(p => new Date(p.year, p.month, 1)) : yearLabels.map(p => new Date(p, 0, 1)),
        datasets: [
          {
            type: 'line',
            label: this.labels[4],
            fill: false,
            borderColor: this.colors[3],

            borderDash: [5, 5],
            borderWidth: 2,
            data: this.reportModel === 'Monthly' ? monthLabels.map(p => this.review_avg) : yearLabels.map(p => this.review_avg)
          },
          {
            label: this.labels[2], stack: this.stacks[0],
            backgroundColor: this.colors[0],
            data: this.review_count
          },
          {
            label: this.labels[3], stack: this.stacks[0],
            backgroundColor: this.colors[1],
            data: this.review_no_count
          }
        ]
      };
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Retailer Reviews'
        },
        plugins: {
          datalabels: {
            color: 'blue',
            display: function (context) { return false; },
            font: { weight: 'bold' },
            formatter: Math.round
          }
        },
        scales: {
          xAxes: [{
            display: true,
            type: 'time',
            time: {
              unit: this.reportModel === 'Monthly' ? 'month' : 'year',
              format: this.reportModel === 'Monthly' ? 'MMM YYYY' : 'YYYY',
            }
          }],
        },
      };
      this.options_avg = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Retailer Average Ratings'
        },
        plugins: {
          datalabels: {
            color: 'blue',
            display: function (context) { return false; },
            font: { weight: 'bold' },
            formatter: Math.round
          }
        },
        scales: {
          xAxes: [{
            display: true,
            type: 'time',
            time: {
              unit: this.reportModel === 'Monthly' ? 'month' : 'year',
              format: this.reportModel === 'Monthly' ? 'MMM YYYY' : 'YYYY',
            }
          }],
        },
      };
    });
  }


  goto(type, incr) {
    let date = new Date();
    let widget = this.widget.one;

    const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
    switch (type) {
      case 'one': widget = this.widget.one; break;
      case 'two': widget = this.widget.two; break;
      case 'three': widget = this.widget.three; break;
      case 'four': widget = this.widget.four; break;
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

    widget.value = widget.values[widget.index];
    date = new Date(widget.year, widget.month, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() || 0;
    widget.monthName = this.dateUtils.getMonthName(widget.month || 12);
  }
  getPage(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'retailerId', retailerName: this.retailerName };
    this.reportsService.getReviews(searchParams).subscribe(res => {
      this.retailers = res;
      this.loading = false;
    });
  }
  getRetailerReviewRatings(retailer: RetailerReview) {
    retailer.isCollapsed = !retailer.isCollapsed;
    if (!retailer.isCollapsed && retailer.totalReviews > 0) {
      this.loading = true;
      this.reportsService.getRetailerReviewRatings(retailer.retailerId).subscribe(res => {
        retailer.avgRatings = res.content;
        this.getRetailerChartData(retailer);
        this.loading = false;
      });
    }
  }
  getRetailerChartData(retailer) {
    retailer.chartData = {
      labels: ['1 star', '2 star', '3 star', '4 star', '5 star'],
      datasets: [{
        label: 'Ratings',
        backgroundColor: 'red',
        borderColor: 'pink',
        borderWidth: 0,
        data: this.ratings.map(p => retailer.avgRatings.filter(q => q.rating === p).length > 0 ? retailer.avgRatings.filter(q => q.rating === p)[0].count : 0)
      }]
    };
  }
}

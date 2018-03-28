import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';

import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-reviews-report',
  templateUrl: './reviews-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewsReportComponent implements OnInit {
  retailers: any;
  review_days: number;
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
  details = { widgetType: 'one', year: this.currentYear, month: 2 };
  widget = {
    'one': { widgetType: 'Average', year: this.currentYear, month: 2, value: 0 },
    'two': { widgetType: 'Ratings', year: this.currentYear, month: 2, value: 0 },
    'three': { widgetType: 'Completed', year: this.currentYear, month: 2, value: 0 },
    'four': { widgetType: 'NotCompleted', year: this.currentYear, month: 2, value: 0 }
  };
  summary = { threeCostOfGoods: 0, threeTaxesCost: 0, threeShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  colors = ['#94A5B7', '#D6ECF6', '#436798', '#2A4B70'];
  reportYears = 5;
  stacks = ['stack 0'];
  labels = ['Average', 'Ratings', 'Completed', 'Not Completed'];
  yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => (p - i).toString()).reverse();
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
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        time: {
          format: 'YYYY',
          // round: 'day'
        }
      }],
    },
  };
  options_avg = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        time: {
          format: 'YYYY',
          // round: 'day'
        }
      }],
    },
  };
  constructor(private reportsService: ReportsService) {
    this.orders = new ReportOrders();
  }

  ngOnInit() {
    this.getData();
    this.getPage(1);
  }
  getData() {
    this.yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => (p - i).toString()).reverse();
    this.getChartData();
  }
  getChartData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() || 0;
    const completedReview = this.reportsService.getCompletedReview(year.toString(), this.reportModel !== 'Monthly' ? '' : (month + 1).toString());
    const avgReview = this.reportsService.getAvgReview(year.toString(), this.reportModel !== 'Monthly' ? '' : (month + 1).toString());
    const avgResponseTime = this.reportsService.getAvgResponseTime(year.toString(), this.reportModel !== 'Monthly' ? '' : (month + 1).toString());

    forkJoin([completedReview, avgReview, avgResponseTime]).subscribe((res) => {
      const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
      this.rating_avg = res[1].avg;
      this.rating_data = yearLabels.map(p => res[1].avgReviewCount.filter(q => q.year === p).length > 0 ? res[1].avgReviewCount.filter(q => q.year === p)[0].avg : 0);
      this.review_avg = res[0].avg;
      this.review_count = yearLabels.map(p => res[0].reviewOrderAggregation.filter(q => q.year === p).length > 0 ? res[0].reviewOrderAggregation.filter(q => q.year === p)[0].completed : 0);
      this.review_no_count = yearLabels.map(p => res[0].reviewOrderAggregation.filter(q => q.year === p).length > 0 ? res[0].reviewOrderAggregation.filter(q => q.year === p).map(r => r.total - r.completed)[0] : 0);
      this.review_days = res[2];

      this.widget.one.value = this.review_count[this.review_count.length - 1];
      this.widget.two.value = this.review_days;
      this.widget.three.value = this.review_no_count[this.review_no_count.length - 1];
      this.widget.four.value = this.rating_data[this.rating_data.length - 1];

      this.data_avg = {
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
            data: this.rating_data
          }
        ]
      };
      this.data = {
        labels: this.yearLabels,
        datasets: [
          {
            type: 'line',
            label: this.labels[0],
            fill: false,
            borderColor: this.colors[3],

            borderDash: [5, 5],
            borderWidth: 2,
            data: this.yearLabels.map(p => this.review_avg)
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
    });
  }

  goto(type, incr) {
    let date = new Date();
    let widget = this.widget.one;

    const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
    switch (type) {
      case 'one': widget = this.widget.one; widget.value = this.review_count[yearLabels.indexOf(widget.year)]; break;
      case 'two': widget = this.widget.two; break;
      case 'three': widget = this.widget.three; break;
      case 'four': widget = this.widget.four; break;
    }
    date = new Date(widget.year, widget.month, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() || 0;
    switch (type) {
      case 'one': widget.value = this.review_count[yearLabels.indexOf(widget.year)]; break;
      case 'two': this.reportsService.getAvgResponseTime(widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month + 1).toString()).subscribe(p => widget.value = p); break;
      case 'three': widget.value = this.review_no_count[yearLabels.indexOf(widget.year)]; break;
      case 'four': widget.value = this.rating_data[yearLabels.indexOf(widget.year)]; break;
    }
  }
  getPage(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'retailerId' };
    this.reportsService.getReviews(searchParams).subscribe(res => {
      this.retailers = res;
      this.loading = false;
    });
  }
}

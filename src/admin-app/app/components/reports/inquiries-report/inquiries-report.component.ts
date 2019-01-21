import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportOrders, ReportRetailerInquirys } from '../../../../../models/report-order';
import { ReportsService } from '../reports.service';
import { InquiryTypes } from '../../../../../models/inquiry';
import DateUtils from '../../../../../common/utils';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ReportReviewSummary } from '../../../../../models/report-review';

@Component({
  selector: 'app-inquiries-report',
  templateUrl: './inquiries-report.component.html',
  styleUrls: ['./../reports.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiriesReportComponent implements OnInit {
  loading: boolean;
  retailerInquiriesSummary: ReportReviewSummary;
  retailerInquiries: ReportRetailerInquirys;

  isCollapsed = true;
  inquiryCategorys: string[];
  inquiryTypes = InquiryTypes;
  compalaintType = 'Order Issue';
  inquiryComplaintCategorys = InquiryTypes.filter(p => p.name === this.compalaintType)[0].categories;
  inquiryComplaintCategory = this.inquiryComplaintCategorys[0];
  inquiryType = '';
  inquiryCategory = '';
  reportModel = 'Monthly';
  summary = { totalCostOfGoods: 0, totalTaxesCost: 0, totalShipCost: 0, saleRevenue: 0, netRevenue: 0 };
  dateUtils = new DateUtils();
  review_days: number[];
  review_no_count: number[];
  review_count: number[];
  review_avg: number;
  rating_data: number[];
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  summaryYear = new Date().getFullYear();
  summaryMonth = new Date().getMonth() + 1;
  summaryInquiryType = InquiryTypes[0].name;
  summaryInquiryCategory = '';
  retailerName = '';
  ratings = [1, 2, 3, 4, 5];
  details = { widgetType: 'one', year: this.currentYear, month: this.currentMonth };
  widget = {
    'one': { widgetType: 'Total', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'two': { widgetType: 'Order Issue', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'three': { widgetType: 'Return', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 },
    'four': { widgetType: 'Unresolved', year: this.currentYear, month: this.currentMonth, monthName: this.dateUtils.getMonthName(this.currentMonth), value: 0, values: [], first: false, last: true, index: 0 }
  };

  colors = ['#94A5B7', '#D6ECF6', '#436798', '#2A4B70'];
  reportYears = 5;
  stacks = ['stack 0'];
  labels = ['Average Inquiries', 'Total Inquiries'];
  yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => (p - i).toString()).reverse();
  monthLabels = this.dateUtils.getMonths();
  type = 'bar';
  rating_avg = 1.67;

  backgroundColors = ['#df7970', '#4c9ca0', '#ae7d99', '#c9d45c', '#5592ad', '#6d78ad', '#51cda0', '#f8f378', '#ae6653', '#60df63', '#60c9df'];
  type_byType = 'pie';
  data_byType = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Consumer Inquiries, by Type',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: this.backgroundColors,
      }
    ]
  };
  options_byType = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Consumer Inquiries, by Type'
    },
    legend: {
      display: true,
      position: 'right'
    },
    plugins: {
      datalabels: {
        color: 'white',
        display: function (context) {
          return true;
        },
        formatter: function (value, context) {
          const i = context.dataIndex;
          const allData = context.dataset.data;
          const total = Object.values(context.dataset._meta)[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).reduce((a, b) => a + b);
          return Math.round(value / total * 100) + '%';
        },
        font: {
          weight: 'bold'
        },
        // formatter: Math.round
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
  type_byCategory = 'line';
  data_byCategory = {
    labels: this.reportModel === 'Monthly' ? this.monthLabels.map(p => new Date(this.currentYear, p.value - 1, 1)) : this.yearLabels.map(p => new Date(p, 0, 1)),
    datasets: [
      {
        type: 'line',
        label: this.labels[0],
        fill: false,
        borderColor: this.colors[3],
        borderDash: [5, 5],
        borderWidth: 2,
        data: this.monthLabels.map(p => this.rating_avg)
      },
      {
        type: 'line',
        label: this.labels[1],
        backgroundColor: this.colors[3],
        fill: false,
        data: [0, 0, 5, 1, 3, 0, 5, 1, 3, 0, 5]
      }
    ]
  };
  options_byCategory = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Consumer Inquiries, by Type'
    },
    legend: {
      display: true,
      position: 'right',
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
    plugins: {
      datalabels: {
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(128, 128, 128, 0.7)',
        borderRadius: 4,
        borderWidth: 1,
        display: function (context) {
          return true;
        },
        // formatter: function (value, context) {
        //   const i = context.dataIndex;
        //   const allData = context.dataset.data;
        //   const total = Object.values(context.dataset._meta)[0].data.filter(p => !p.hidden).map(p => p._index).map(p => allData[p]).reduce((a, b) => a + b);
        //   return Math.round(value / total * 100) + '%';
        // },
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
    this.retailerInquiriesSummary = new ReportReviewSummary();
    this.retailerInquiries = new ReportRetailerInquirys();
  }

  ngOnInit() {
    this.getData();
    this.getDetails('one');
    this.getPage(1);
    this.getInquiriesSummary(1);
  }
  getData(event?:any) {
    if(event && event.target.value)
    {
        this.reportModel= event.target.value; 
    }
    let year = this.currentYear;
    let month = this.reportModel !== 'Monthly' ? '' : new Date().getMonth() + 1;
    const oneData = this.reportsService.getInquiryReport(this.widget.one.widgetType, year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    const twoData = this.reportsService.getInquiryReport(this.widget.two.widgetType, year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    const threeData = this.reportsService.getInquiryReport(this.widget.three.widgetType, year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    const fourData = this.reportsService.getInquiryReport(this.widget.four.widgetType, year.toString(), this.reportModel !== 'Monthly' ? '' : (month).toString());
    forkJoin([oneData, twoData, threeData, fourData]).subscribe((res) => {
      const monthLabels = [];
      const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.currentYear).map((p, i) => p - i).reverse();
      if (this.reportModel === 'Monthly') {
        const reportData = new Array<any>();
        if (month == 12) {
          year = year;
          month = 1;
        }
        else {
          year = this.currentYear - 1;
          month = this.currentMonth + 1;
        }
        this.widget.one.values = [];
        this.widget.two.values = [];
        this.widget.three.values = [];
        this.widget.four.values = [];
        for (let i = 0; i < 12; i++) {
          monthLabels.push({ month: month, year: year });
          const filter = res[0].filter(p => p.month === month);
          this.widget.one.values.push(filter.length > 0 ? filter[0].count : 0);

          const filter1 = res[1].filter(p => p.month === month);
          this.widget.two.values.push(filter1.length > 0 ? filter1[0].count : 0);

          const filter2 = res[2].filter(p => p.month === month);
          this.widget.three.values.push(filter2.length > 0 ? filter2[0].count : 0);

          const filter3 = res[3].filter(p => p.month === month);
          this.widget.four.values.push(filter3.length > 0 ? filter3[0].count : 0);


          if (month === 12) { month = 1; year++; } else { month++; }
        }
      } else {
        this.widget.one.values = yearLabels.map(p => res[0].filter(q => q.year === p).length > 0 ? res[0].filter(q => q.year === p)[0].count : 0);
        this.widget.two.values = yearLabels.map(p => res[1].filter(q => q.year === p).length > 0 ? res[1].filter(q => q.year === p)[0].count : 0);
        this.widget.three.values = yearLabels.map(p => res[2].filter(q => q.year === p).length > 0 ? res[2].filter(q => q.year === p)[0].count : 0);
        this.widget.four.values = yearLabels.map(p => res[3].filter(q => q.year === p).length > 0 ? res[3].filter(q => q.year === p)[0].count : 0);

      }
      this.widget.one.index = this.widget.one.values.length - 1;
      this.widget.two.index = this.widget.two.values.length - 1;
      this.widget.three.index = this.widget.three.values.length - 1;
      this.widget.four.index = this.widget.four.values.length - 1;
      this.widget.one.value = this.widget.one.values[this.widget.one.index];
      this.widget.two.value = this.widget.two.values[this.widget.two.index];
      this.widget.three.value = this.widget.three.values[this.widget.three.index];
      this.widget.four.value = this.widget.four.values[this.widget.four.index];
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
    date = new Date(widget.year, widget.month - 1, 1);
    if (this.reportModel !== 'Monthly') {
      date.setFullYear(widget.year + incr);
    } else {
      date.setMonth(widget.month - 1 + incr);
    }
    widget.year = date.getFullYear();
    widget.month = date.getMonth() + 1;
    widget.monthName = this.dateUtils.getMonthName(widget.month || 12);
  }
  getDetails(type) {
    let widget = this.widget.one;
    switch (type) {
      case 'one': widget = this.widget.one; break;
      case 'two': widget = this.widget.two; break;
      case 'three': widget = this.widget.three; break;
      case 'four': widget = this.widget.four; break;
    }
    this.reportsService.getInquiryChartReport(widget.widgetType, widget.year.toString(), this.reportModel !== 'Monthly' ? '' : (widget.month).toString()).subscribe((res) => {
      if (res) {
        this.data_byType = {
          labels: res.map(p => p.inquiryCategory.substring(0, 20)),
          datasets: [
            {
              label: 'Consumer Inquiries, by Type',
              data: res.map(p => p.count),
              backgroundColor: this.backgroundColors,
            }
          ]
        };
      }
    });
    this.details.widgetType = widget.widgetType;
    this.details.year = widget.year;
    this.details.month = widget.month;
    // this.getPage(1);
  }

  getPage(page: number) {
    if (!this.inquiryComplaintCategory) {
      delete this.retailerInquiries;
      return;
    }
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'businessName', businessName: this.retailerName };
    if (!this.retailerName) {
      delete searchParams.businessName;
    }
    this.reportsService.getRetailerInquiries(this.compalaintType, this.inquiryComplaintCategory, searchParams).subscribe(res => {
      this.retailerInquiries = res;
      this.loading = false;
    });
  }
  inquiryTypeChange() {
    this.inquiryCategorys = this.inquiryTypes.filter(p => p.name === this.summaryInquiryType)[0].categories;
    this.getInquiriesSummary(1);
  }
  inquiryCategoryChange() {
    this.getInquiriesSummary(1);
  }
  getInquiriesSummary(page: number) {
    if (!this.summaryInquiryType) { return; }
    this.loading = true;
    this.reportsService.getInquiriesSummary(this.summaryInquiryType, this.summaryInquiryCategory, this.summaryYear.toString(), this.reportModel === 'Monthly' ? this.summaryMonth.toString() : '').subscribe(res => {
      this.retailerInquiriesSummary = res;
      let month;
      let year;
      if (this.summaryMonth == 12) {
        month = 1;
        year = this.summaryYear;
      }
      else {
        month = this.summaryMonth + 1;
        year = this.summaryYear - 1;
      }
      const monthLabels = [];
      const yearLabels = Array.apply(null, { length: this.reportYears }).fill(this.summaryYear).map((p, i) => p - i).reverse();
      let data = [];
      if (this.reportModel === 'Monthly') {
        for (let i = 0; i < 12; i++) {
          monthLabels.push({ month: month, year: year });
          const filter = res.avgReviewCount.filter(p => p.month === month);
          data.push(filter.length > 0 ? filter[0].count : 0);
          if (month === 12) { month = 1; year++; } else { month++; }
        }
      } else {
        data = yearLabels.map(p => res.avgReviewCount.filter(q => q.year === p).length > 0 ? res.avgReviewCount.filter(q => q.year === p)[0].count : 0);
      }
      this.loading = false;
      this.data_byCategory = {
        labels: this.reportModel === 'Monthly' ? monthLabels.map(p => new Date(p.year, p.month - 1, 1)) : yearLabels.map(p => new Date(p, 0, 1)),
        datasets: [
          {
            type: 'line',
            label: this.labels[0],
            fill: false,
            borderColor: this.colors[3],
            borderDash: [5, 5],
            borderWidth: 2,
            data: this.reportModel === 'Monthly' ? this.monthLabels.map(p => res.avg) : this.yearLabels.map(p => res.avg)
          },
          {
            type: 'line',
            label: this.labels[1],
            backgroundColor: this.colors[3],
            fill: false,
            data: data // [0, 0, 5, 1, 3]
          }
        ]
      };
      this.options_byCategory = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Consumer Inquiries, by Type'
        },
        legend: {
          display: true,
          position: 'right',
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
        plugins: {
          datalabels: {
            color: 'black',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(128, 128, 128, 0.7)',
            borderRadius: 4,
            borderWidth: 1,
            display: function (context) {
              return true;
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
    });
  }

}

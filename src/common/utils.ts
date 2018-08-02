import { Injectable } from '@angular/core';

@Injectable()
export class ChartUtils {
    dynamicColors = function () {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
}

export default class DateUtils {
    monthLabels = [{ name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 }, { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 }, { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 }, { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 }];
    getMonths() { return this.monthLabels; }

    getMonthName(month: number) {
        console.log(month);
        return this.monthLabels.filter(p => p.value === month)[0].name;
    }
    toDate(obj) {
        if (!obj) {
            return '';
        }
        if (obj.year && obj.month && obj.day) {
            return `${obj.year}-${obj.month}-${obj.day}`;
        } else if (new Date(obj)) {
            const date = new Date(obj);
            if (date.getDate() ? true : false) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            } else { return ''; }
        }
    }
    fromDate(obj: any): any {
        const date = obj ? new Date(obj) : new Date();
        if (obj != undefined) return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        else return { year: date.getFullYear() - 13, month: date.getMonth() + 1, day: date.getDate() };
    }
}

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
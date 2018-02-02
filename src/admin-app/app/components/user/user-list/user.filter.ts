import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter',
    pure: false
})
export class UserFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.username.indexOf(filter) !== -1);
    }
}

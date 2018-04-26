export function formatPhoneNumber(value) {
    if (!value) { return ''; }
    const f_val = value.replace(/\D[^\.]/g, '');
    return `${f_val.slice(0, 3)}-${f_val.slice(3, 6)}-${f_val.slice(6)}`;
}
export function removeDuplicates(string: string, char: string) {
    const result = [];
    let previous = null;
    if (!char) {
        for (let i = 0; i < string.length; i++) {
            const current = string.charAt(i);
            if (current !== previous) { result.push(current); }
            previous = current;
        }
    } else {
        for (let i = 0; i < string.length - 1; i++) {
            if (char === string.charAt(i) && char === string.charAt(i + 1)) {
            } else {
                result.push(string.charAt(i));
            }
        }
    }
    return result.join('').startsWith(',') ? result.join('').substr(1) : result.join('');
}
export function toAddressString(strings: string[]) {
    let result = '';
    strings.forEach(element => {
        if (element && element.trim() !== '') {
            result += element + ', ';
        }
    });
    return result;
}
/// <reference path="./tsarray.d.ts" />
(function () {
    if (!Array.prototype.firstOrDefault) {
        Array.prototype.firstOrDefault = function (predicate: (item: any) => boolean) {
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                const item = (<Array<any>>this)[i];
                if (predicate(item)) {
                    return item;
                }
            }
            return null;
        };
    }

    if (!Array.prototype.where) {
        Array.prototype.where = function (predicate: (item: any) => boolean) {
            const result = [];
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                const item = (<Array<any>>this)[i];
                if (predicate(item)) {
                    result.push(item);
                }
            }
            return result;
        };
    }

    if (!Array.prototype.remove) {
        Array.prototype.remove = function (item: any): boolean {
            const index = (<Array<any>>this).indexOf(item);
            if (index >= 0) {
                (<Array<any>>this).splice(index, 1);
                return true;
            }
            return false;
        };
    }

    if (!Array.prototype.removeRange) {
        Array.prototype.removeRange = function (items: any[]): void {
            for (let i = 0; i < items.length; i++) {
                (<Array<any>>this).remove(items[i]);
            }
        };
    }

    if (!Array.prototype.add) {
        Array.prototype.add = function (item: any): void {
            (<Array<any>>this).push(item);
        };
    }

    if (!Array.prototype.addRange) {
        Array.prototype.addRange = function (items: any[]): void {
            for (let i = 0; i < items.length; i++) {
                (<Array<any>>this).push(items[i]);
            }
        };
    }

    if (!Array.prototype.orderBy) {
        Array.prototype.orderBy = function (propertyExpression: (item: any) => any) {
            const result = [];
            const compareFunction = (item1: any, item2: any): number => {
                if (propertyExpression(item1) > propertyExpression(item2)) { return 1; }
                if (propertyExpression(item2) > propertyExpression(item1)) { return -1; }
                return 0;
            };
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                return (<Array<any>>this).sort(compareFunction);

            }
            return result;
        };
    }

    if (!Array.prototype.orderByDescending) {
        Array.prototype.orderByDescending = function (propertyExpression: (item: any) => any) {
            const result = [];
            const compareFunction = (item1: any, item2: any): number => {
                if (propertyExpression(item1) > propertyExpression(item2)) { return -1; }
                if (propertyExpression(item2) > propertyExpression(item1)) { return 1; }
                return 0;
            };
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                return (<Array<any>>this).sort(compareFunction);
            }
            return result;
        };
    }

    if (!Array.prototype.orderByMany) {
        Array.prototype.orderByMany = function (propertyExpressions: [(item: any) => any]) {
            const result = [];
            const compareFunction = (item1: any, item2: any): number => {
                for (let i = 0; i < propertyExpressions.length; i++) {
                    const propertyExpression = propertyExpressions[i];
                    if (propertyExpression(item1) > propertyExpression(item2)) { return 1; }
                    if (propertyExpression(item2) > propertyExpression(item1)) { return -1; }
                }
                return 0;
            };
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                return (<Array<any>>this).sort(compareFunction);
            }
            return result;
        };
    }

    if (!Array.prototype.orderByManyDescending) {
        Array.prototype.orderByManyDescending = function (propertyExpressions: [(item: any) => any]) {
            const result = [];
            const compareFunction = (item1: any, item2: any): number => {
                for (let i = 0; i < propertyExpressions.length; i++) {
                    const propertyExpression = propertyExpressions[i];
                    if (propertyExpression(item1) > propertyExpression(item2)) { return -1; }
                    if (propertyExpression(item2) > propertyExpression(item1)) { return 1; }
                }
                return 0;
            };
            for (let i = 0; i < (<Array<any>>this).length; i++) {
                return (<Array<any>>this).sort(compareFunction);
            }
            return result;
        };
    }
})();

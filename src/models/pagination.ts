export class Pagination {
    constructor(obj?: any) {
        if (obj) {
            this.last = obj.last;
            this.totalElements = obj.totalElements || ((obj.size || 1) * 100);
            this.totalPages = obj.totalPages;
            this.size = obj.size;
            this.number = obj.number || obj.page;
            this.first = obj.first;
        }
    }
    public last: boolean;
    public totalElements: number;
    public totalPages: number;
    public size: number;
    public number: number;
    public first: boolean;
}

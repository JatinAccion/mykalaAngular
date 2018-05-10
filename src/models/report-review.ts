export class ReportReviewSummary {
    public avg: number;
    public avgReviewCount: ReviewItem[];
    public reviewOrderAggregation: ReviewItem[];
    public consumerRecords: ReviewItem[];
    constructor(obj?: any) {
        this.avgReviewCount = new Array<ReviewItem>();
        this.reviewOrderAggregation = new Array<ReviewItem>();
        if (obj) {
            this.avg = obj.avg;
            if (obj.avgReviewCount) {
                this.avgReviewCount = obj.avgReviewCount.map(p => new ReviewItem(p));
            }
            if (obj.reviewOrderAggregation) {
                this.reviewOrderAggregation = obj.reviewOrderAggregation.map(p => new ReviewItem(p));
            }
            if (obj.consumerRecords) {
                this.consumerRecords = obj.consumerRecords.map(p => new ReviewItem(p));
            }

        }
    }
}
export class ReviewItem {
    public year: number;
    public month: number;
    public total: number;
    public completed: number;
    public avg: number;
    public count: number;
    public closedAccounts: number;
    public newMembers: number;
    public totalMembers: number;
    constructor(obj?: any) {
        if (obj) {
            this.year = obj.year;
            this.month = obj.month;
            this.total = obj.total;
            this.completed = obj.completed;
            this.avg = obj.avg;
            this.count = obj.count;
            this.closedAccounts = obj.closedAccounts;
            this.newMembers = obj.newMembers;
            this.totalMembers = obj.totalMembers;

        }
    }
}

import { Pagination } from './pagination';

export class ReportConsumer {
    public customerId: string;
    public userId: string;
    public firstName: string;
    public lastName: string;
    public createdAt: Date;
    public numberOfTransaction: number;
    public purchasedPrice: number;
    public totalTaxCost: number;
    public totalShipCost: number;
    public offerMade: number;
    public lastActive: Date;
    constructor(obj?: any) {
        if (obj) {
            this.customerId = obj.customerId;
            this.userId = obj.userId;
            this.firstName = obj.firstName;
            this.lastName = obj.lastName;
            this.createdAt = obj.createdAt;
            this.numberOfTransaction = obj.numberOfTransaction;
            this.purchasedPrice = obj.purchasedPrice;
            this.totalTaxCost = obj.totalTaxCost;
            this.totalShipCost = obj.totalShipCost;
            this.offerMade = obj.offerMade;
            this.lastActive = obj.lastActive;
        }
    }
}
export class ReportConsumers extends Pagination {
    constructor(obj?: any) {
      if (obj) {
        super(obj);
        if (obj.content) {
          this.content = obj.content.map(p => new ReportConsumer(p));
        } else {
          this.content = new Array<ReportConsumer>();
        }
      }
    }
    public content: ReportConsumer[];
  }
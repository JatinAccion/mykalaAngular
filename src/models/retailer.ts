import { RetailerProfileInfo } from './retailer-profile-info';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { ProductInfo } from './product-info';
import { RetialerShippingProfile } from './retailer-shipping-profile';

export class Retailers {
    constructor(obj?: any) {
        if (obj) {
            this.last = obj.last;
            this.totalElements = obj.totalElements;
            this.totalPages = obj.totalPages;
            this.size = obj.size;
            this.number = obj.number;
            this.first = obj.first;
            this.content = obj.content.map(p => new RetailerProfileInfo(p));
        }
    }
    public content: RetailerProfileInfo[];

    public last: boolean;
    public totalElements: number;
    public totalPages: number;
    public size: number;
    public number: number;
    public first: boolean;
}

export class RetailerReports {
    public products: number;
    public transactions: number;
    public returns: number;
    public offersMade: number;
    public complaints: number;
    public reviews: number;
    constructor(obj?: any) {
        if (obj) {
            this.products = obj.products;
            this.transactions = obj.transactions;
            this.returns = obj.returns;
            this.offersMade = obj.offersMade;
            this.complaints = obj.complaints;
            this.reviews = obj.reviews;
        }
    }
}
export class RetailerReturnPolicy {
    constructor() { }
    public retailerId: number;
    public returnPolicy: string;
}
export class RetailerNotification {
    public retailerId: number;
    public orderEmail: string;
    public shipEmail: string;
    constructor() { }
}


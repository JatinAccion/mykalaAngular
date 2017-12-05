import { RetailerProfileInfo } from './retailer-profile-info';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { ProductInfo } from './product-info';
import { RetialerShippingProfile } from './retailer-shipping-profile';

export class Retailer {
    constructor(obj: any) {
        this.retailerId = obj.retailerId;
        this.businessName = obj.businessName;
        this.businessLogoPath = `https://s3.us-east-2.amazonaws.com/${obj.businessLogoPath}`;
        this.city = obj.city;
        this.state = obj.state;
        this.country = obj.country;
        this.reports = new RetailerReports(obj.reports);
    }
    public retailerId: number;
    public businessName: string;
    public businessLogoPath: string;
    public city: string;
    public state: string;
    public country: string;
    public reports: RetailerReports;
}
export class RetailerReports {
    public products: number;
    public transactions: number;
    public returns: number;
    public offersMade: number;
    public complaints: number;
    public reviews: number;
    constructor(obj: any) {
        this.products = obj.products;
        this.transactions = obj.transactions;
        this.returns = obj.returns;
        this.offersMade = obj.offersMade;
        this.complaints = obj.complaints;
        this.reviews = obj.reviews;
    }
}

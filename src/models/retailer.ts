import { RetailerProfileInfo } from './retailer-profile-info';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { ProductInfo } from './product-info';
import { RetialerShippingProfile } from './retailer-shipping-profile';
import { Pagination } from './pagination';

export class Retailers extends Pagination {
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.content = obj.content.map(p => new RetailerProfileInfo(p));
        }
    }
    public content: RetailerProfileInfo[];
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
    public retailerId: string;
    public shippingReturnId: string;
    public returnPolicy: string;

    constructor(obj?: any) {
        if (obj) {
            this.retailerId = obj.retailerId;
            this.shippingReturnId = obj.shippingReturnId;
            this.returnPolicy = obj.returnPolicy;
        }
    }
}
export class RetailerNotification {
    public retailerId: string;
    public shippingNotificationsId: string;
    public orderEmail: string;
    public shipEmail: string;
    constructor(obj?: any) {
        if (obj) {
            this.retailerId = obj.retailerId;
            this.shippingNotificationsId = obj.shippingNotificationsId;
            this.orderEmail = obj.orderEmail;
            this.shipEmail = obj.shipEmail;
        }
    }
}
export class SellerType {
    public sellerTypeId: string;
    public sellerTypeValue: string;
    constructor(obj?: any) {
        if (obj) {
            this.sellerTypeId = obj.sellerTypeId;
            this.sellerTypeValue = obj.sellerTypeValue;
        }
    }
}
export class RetailerTax {
    public retailerId: string;
    public taxNexusId: string;
    public states: Array<string>;

    constructor(obj?: any) {
        this.states = [];
        // ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'WashingtonDC', 'Delaware', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'NorthCarolina', 'NorthDakota', 'Nebraska', 'NewHampshire', 'NewJersey', 'NewMexico', 'Nevada', 'NewYork', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'PuertoRico', 'RhodeIsland', 'SouthCarolina', 'SouthDakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'VirginIslands', 'Vermont', 'Washington', 'Wisconsin', 'WestVirginia', 'Wyoming'];
        if (obj) {
            this.retailerId = obj.retailerId;
            this.taxNexusId = obj.taxNexusId;
            this.states = obj.states;
        }
    }
}


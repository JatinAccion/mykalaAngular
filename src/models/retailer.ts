import { RetailerProfileInfo } from './retailer-profile-info';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { ProductInfo } from './product-info';
import { RetialerShippingProfile } from './retailer-shipping-profile';
import { Pagination } from './pagination';
import { transition } from '@angular/core';

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
    public products = 0;
    public transactions = 0;
    public returns = 0;
    public offersMade = 0;
    public complaints = 0;
    public reviews = 0;
    constructor(obj?: any) {
        if (obj) {
            this.products = obj.products || 0;
            this.transactions = obj.transactions || 0;
            this.returns = obj.returns || 0;
            this.offersMade = obj.offersMade || 0;
            this.complaints = obj.complaints || 0;
            this.reviews = obj.reviews || 0;
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
    public retailerIntegrationMethod: string;
    constructor(obj?: any) {
        if (obj) {
            this.retailerId = obj.retailerId;
            this.shippingNotificationsId = obj.shippingNotificationsId;
            this.orderEmail = obj.orderEmail;
            this.shipEmail = obj.shipEmail;
            this.retailerIntegrationMethod = obj.retailerIntegrationMethod;
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
    public stateAbbreviation: Array<string>;

    constructor(obj?: any) {
        this.stateAbbreviation = [];
        if (obj) {
            this.retailerId = obj.retailerId;
            this.taxNexusId = obj.taxNexusId;
            this.stateAbbreviation = obj.stateAbbreviation || [];
        }
    }
}
export class RetailerReview {
    public retailerId: string;
    public businessName: string;
    public status: boolean;
    public createdDate: Date;
    public transcation: number;
    public avgRating: number;
    public avgResponseTime: number;
    public totalReviews: number;
    public isCollapsed: boolean | null = true;
    public avgRatings: ReviewRating[];
    constructor(obj?: any) {
        this.isCollapsed = true;
        if (obj) {
            this.retailerId = obj.retailerId;
            this.businessName = obj.businessName;
            this.status = obj.status;
            this.createdDate = obj.createdDate;
            this.transcation = obj.transcation;
            this.avgRating = obj.avgRating;
            this.avgResponseTime = obj.avgResponseTime;
            this.totalReviews = obj.totalReviews;
            this.avgRatings = Array.apply(null, { length: 5 }).fill(obj.avgRating);
        }
    }
}
export class ReviewRating {
    public rating: number;
    public count: number;
    constructor(obj?: any) {
        if (obj) {
            this.rating = obj.rating;
            this.count = obj.count;
        }
    }
}
export class ReviewRatings {
    public content: ReviewRating[];
    constructor(obj?: any) {
        if (obj && obj.length > 0) {
            this.content = obj.map(p => new ReviewRating(p));
        }
    }

}
export class RetailerReviews extends Pagination {
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.content = obj.content.map(p => new RetailerReview(p));
        }
    }
    public content: RetailerReview[];
}

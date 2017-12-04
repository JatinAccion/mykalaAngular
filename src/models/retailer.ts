import { RetailerProfileInfo } from './retailer-profile-info';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { ProductInfo } from './product-info';
import { RetialerShippingProfile } from './retailer-shipping-profile';

export class Retailer {
    constructor(
        public retailerId: number,
        public imageUrl: string,
        public name: string,
        public address: string,
        public reviews: string[],
        public productsCount: number,
        public transactionsCount: number,
        public returnsCount: number,
        public offersCount: number,
        public complaintsCount: number) { }
}

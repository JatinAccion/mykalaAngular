import { PostalAddress } from './retailer-business-adress';

export class RetialerShippingProfile {
    retailerId: string;
    shippingProfileId: string;
    sequence: number;
    shippingProfileName: string;
    deliveryOption: string;
    deliveryTiers: Array<ShippingDeliveryTier>;
    shippingOriginAddress: ShippingOriginAddress;
    deliveryLocation: DeliveryLocation;

    step: number;
    status: boolean;
    constructor() {
        this.deliveryTiers = new Array<ShippingDeliveryTier>();
        this.shippingOriginAddress = new ShippingOriginAddress();
        this.deliveryLocation = new DeliveryLocation();
        this.step = 1;
    }
}

export class ShippingDeliveryTier {
    constructor() { }
    public tierName: string;
    public minValue: number;
    public maxValue: number;
    public sequence: number;
    public deliveryMethods: RetailerDeliveryMethodFee[];

}
export class ShippingOriginAddress extends PostalAddress { }
export class DeliveryLocation {
    public countryName: string;
    public locations: Location[];
}
export class Location {
    public locationName: string;
    public locationType: string;
    public locationStatus: boolean;
    public locationFee: number;
}
export class RetailerDeliveryMethodFee {
    public deliveryMethodName: string;
    public deliveryFee: number;
}

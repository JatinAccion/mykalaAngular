import { PostalAddress } from './retailer-business-adress';

export class RetialerShippingProfiles {
    public shippings: Array<RetialerShippingProfile>;
    retailerId: string;
    constructor(obj?: any) {
        this.shippings = new Array<RetialerShippingProfile>();
        if (obj && obj.length > 0) {
            this.retailerId = obj[0].retailerId;
            this.shippings = obj.map(p => new RetialerShippingProfile(p));
        } else if (obj && obj.shippings && obj.shippings.length > 0) {
            this.retailerId = obj.retailerId;
            this.shippings = obj.shippings.map(p => new RetialerShippingProfile(p));
        }
    }

}

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
    constructor(obj?: any) {
        this.deliveryTiers = new Array<ShippingDeliveryTier>();
        this.shippingOriginAddress = new ShippingOriginAddress();
        this.deliveryLocation = new DeliveryLocation();
        this.step = 1;
        if (obj) {
            this.retailerId = obj.retailerId;
            this.shippingProfileId = obj.shippingProfileId;
            this.sequence = obj.sequence;
            this.shippingProfileName = obj.shippingProfileName;
            this.deliveryOption = obj.deliveryOption;
            if (obj.deliveryTiers) {
                this.deliveryTiers = obj.deliveryTiers.map(p => new ShippingDeliveryTier(p)).sort((a, b) => a.sequence - b.sequence );
            }
            this.shippingOriginAddress = obj.shippingOriginAddress;
            this.deliveryLocation = obj.deliveryLocation;
        }
    }
}

export class ShippingDeliveryTier {
    public tierName: string;
    public minValue: number;
    public maxValue: number;
    public sequence: number;
    public deliveryMethods: RetailerDeliveryMethodFee[];
    constructor(obj?: any) {
        if (obj) {
            this.tierName = obj.tierName;
            this.minValue = obj.minValue;
            this.maxValue = obj.maxValue;
            this.sequence = obj.sequence;
            this.deliveryMethods = obj.deliveryMethods;
        }
    }

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
    public checkMethodStatus: boolean;
}

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
                this.deliveryTiers = obj.deliveryTiers.map(p => new ShippingDeliveryTier(p)).sort((a, b) => a.sequence - b.sequence);
            }
            this.shippingOriginAddress = new ShippingOriginAddress(obj.shippingOriginAddress);
            this.deliveryLocation = new DeliveryLocation(obj.deliveryLocation);
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
            if (obj.deliveryMethods) {
                this.deliveryMethods = obj.deliveryMethods.map(p => new RetailerDeliveryMethodFee(p)).sort((a, b) => a.sequence - b.sequence);
            }
        }
    }
}

export class ShippingOriginAddress extends PostalAddress { constructor(obj?: any) { super(obj); } }
export class DeliveryLocation {
    public countryName: string;
    public locations: Location[];
    constructor(obj?: any) {
        this.countryName = 'USA';
        if (obj) {
            this.countryName = obj.countryName;
            if (obj.locations) {
                this.locations = obj.locations.map(p => new Location(p)).sort((a, b) => a.locationName < b.locationName);
            }
        } else {
            this.locations = new Array<Location>();
        }
        if (this.locations.filter(p => p.locationName === location.ContinentalUS).length === 0) {
            this.locations.push(new Location({
                locationName: location.ContinentalUS, locationType: location.state, locationStatus: true, locationFee: 0
            }));
        }
        if (this.locations.filter(p => p.locationName === location.AlaskaandHawaii).length === 0) {
            this.locations.push(new Location({
                locationName: location.AlaskaandHawaii, locationType: location.state, locationStatus: true, locationFee: 0
            }));
        }
        if (this.locations.filter(p => p.locationName === location.USProtectorates).length === 0) {
            this.locations.push(new Location({
                locationName: location.USProtectorates, locationType: location.territory, locationStatus: true, locationFee: 0
            }));
        }
        if (this.locations.filter(p => p.locationName === location.WashingtonDC).length === 0) {
            this.locations.push(new Location({
                locationName: location.WashingtonDC, locationType: location.state, locationStatus: true, locationFee: 0
            }));
        }
    }
}
export class Location {
    public locationName: string;
    public locationType: string;
    public locationStatus: boolean;
    public locationFee: number;
    constructor(obj?: any) {
        if (obj) {
            this.locationName = obj.locationName;
            this.locationType = obj.locationType;
            this.locationStatus = obj.locationStatus;
            this.locationFee = obj.locationFee;
        }
    }
}
export const location = {
    'ContinentalUS': 'Continental US',
    'AlaskaandHawaii': 'Alaska and Hawaii',
    'USProtectorates': 'US Protectorates',
    'WashingtonDC': 'Washington DC',
    'territory': 'territory',
    'state': 'state',
};
export const shippingMethods = {
    'Nextday1businessdayshipping': 'Next day: 1 business day shipping',
    'twoday2businessdayshipping': '2 day: 2 business day shipping',
    'Express3to5businessdays': 'Express: 3 to 5 business days',
    'Standard5to8businessdays': 'Standard: 5 to 8 business days',
    'Custom': 'Custom'
};
export class RetailerDeliveryMethodFee {
    public deliveryMethodName: string;
    public deliveryFee: number;
    public checkMethodStatus: boolean;
    public sequnce: number;
    constructor(obj?: any) {
        if (obj) {
            this.deliveryMethodName = obj.deliveryMethodName;
            this.deliveryFee = obj.deliveryFee;
            this.checkMethodStatus = obj.checkMethodStatus;
            switch (this.deliveryMethodName) {
                case shippingMethods.Nextday1businessdayshipping: this.sequnce = 0; break;
                case shippingMethods.twoday2businessdayshipping: this.sequnce = 1; break;
                case shippingMethods.Express3to5businessdays: this.sequnce = 2; break;
                case shippingMethods.Standard5to8businessdays: this.sequnce = 3; break;
                default: this.sequnce = 4; break;
            }
        }
    }
}

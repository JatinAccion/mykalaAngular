import { ProductsInfo } from './products-info';

export class BrowseProductsModal {
    public retailerName: string;
    public retailerReturns: string;
    public deliveryMethod: string;
    public product = new ProductsInfo();
    constructor(obj?: any) {        
        if (obj) {
            this.deliveryMethod = obj.deliveryMethod;
            this.retailerName = obj.retailerName;
            this.retailerReturns = obj.retailerReturns;
            this.product = new ProductsInfo(obj);
        }
    }
}

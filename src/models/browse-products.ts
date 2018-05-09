import { ProductsInfo } from './products-info';

export class BrowseProductsModal {
    public product = new ProductsInfo();
    constructor(obj?: any) {
        if (obj) {
            this.product = new ProductsInfo(obj);
        }
    }
}

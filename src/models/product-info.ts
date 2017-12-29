export class ProductInfo {
}
export class ProductPlace {
    public PlaceId: string;
    public PlaceName: string;
    constructor(obj?: any) {
        if (obj) {
            this.PlaceId = obj.placeId;
            this.PlaceName = obj.placeName;
        }
    }
    
}
export class ProductCategory extends ProductPlace {
    public CategoryId: string;
    public CategoryName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.CategoryId = obj.categoryId;
            this.CategoryName = obj.categoryName;
        }
    }
}
export class ProductSubCategory extends ProductCategory {
    public SubCategoryId: string;
    public SubCategoryName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.SubCategoryId = obj.subCategoryId;
            this.SubCategoryName = obj.subCategoryName;
        }
    }
}
export class ProductType extends ProductSubCategory {
    public TypeId: string;
    public TypeName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.TypeId = obj.productTypeId;
            this.TypeName = obj.productTypeName;
            this.SubCategoryId = obj.parentId;
            this.SubCategoryName = obj.parentName;
        }
    }
}

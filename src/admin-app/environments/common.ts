export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    retailers: {
        get: 'retailer/getReatilerByName',
        sellerTypes: 'retailer/sellerType',
        getShippingProfileNames: 'retailer/getShippingProfileName',
        changeStatus: 'retailer/changeStatus'
    },
    retailerProfileInfo: {
        get: 'retailer/{retailerId}/profileInfo',
        save: 'retailer/profileInfo',
        delete: 'delete',
    },
    retailerPaymentInfo: {
        get: 'retailer/{retailerId}/bankDetail',
        save: 'retailer/bankDetail',
        delete: 'delete',
    },
    retailerShippingInfo: {
        get: 'retailer/{retailerId}/shippingProfile',
        save: 'retailer/shippingProfile',
        delete: 'delete',
    },
    retailerShippingNotification: {
        get: 'retailer/{retailerId}/shippingNotification',
        save: 'retailer/shippingNotification',
        delete: 'delete',
    },
    retailerShippingReturnPolicy: {
        get: 'retailer/{retailerId}/shippingReturnPolicy',
        save: 'retailer/shippingReturnPolicy',
        delete: 'delete',
    },
    retailerProduct: {
        getPlaces: 'retailer/getShippingReturnPolicy',
        getCategories: 'retailer/getShippingReturnPolicy',
        getSubCategories: 'retailer/getShippingReturnPolicy',
        getTypes: 'retailer/getShippingReturnPolicy',

        get: 'retailer/productInfo',
        save: 'retailer/productInfo',
        delete: 'delete',
    },
    product: {
        get: 'filterBy',
        save: 'save',
        saveImage: 'saveImages',
        changeMainImage: 'changeMainImage',
        delete: 'delete',
        places: 'places',
        categories: 'categoriesList',
        subCategories: 'subCategoriesList',
        types: 'typesList'
    },

};
export const commonMessages = {
    error404: 'Server is not available',
};


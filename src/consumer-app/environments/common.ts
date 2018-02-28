export const apiNames = {
    auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    userService: {
        createAccount: 'consumer',
        forgotPassword: 'forgotPassword',
        resetPassword: 'resetPassword',
        validateToken: 'validateToken'
    },
    profileInterest: {
        saveProfile: '',
        getCatalogue: 'consumerInterests',
        saveInterest: 'profile/addConsumerCatalogs',
        myAccountProfileImage: 'profilePic',
        myAccountEmailId: 'email',
        myAccountPassword: 'password',
        myAccountLocation: 'address',
        myAccountDOB: 'dateOfBirth',
        myAccountInterest: 'consumerInterst',
        review: 'review',
        getProductReviews: 'productReview'
    },
    products: {
        getPlaces: 'places',
        getCategories: 'categories',
        getSubCategories: 'subCategories',
        getTypes: 'types'
    },
    getOffers: {
        confirmOffer: 'getOffersRequest'
    },
    geoCode: {
        key: '&key=AIzaSyDPSk91ksjR47kqdFbElVwL7eM8FgIZEHw'
    },
    consumerCheckout: {
        addCard: 'addCustomer',
        orderPayment: 'orderPayment',
        getCards: 'customerCards',
        updateCard: 'updateCustomer'
    },
    shippingMethod: {
        method: 'retailer/v1'
    }
};

export const commonMessages = {
    error404: 'Server is not available',
};

export const regexPatterns = {
    numberRegex: new RegExp('^[0-9_.-]*$'),
    textRegex: new RegExp('^[a-zA-Z 0-9_.-]*$'),
};
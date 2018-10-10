import { apiNames, commonMessages, regexPatterns } from './common';
export const environment = {
  production: true,
  login: 'http://qa-user-service.us-west-1.elasticbeanstalk.com',
  userService: 'http://qa-signup-service.us-west-1.elasticbeanstalk.com/user/v1/public',
  profileInterestPublic: 'http://qa-consumer-service.us-west-1.elasticbeanstalk.com/consumer/v1/public',
  profileInterest: 'http://qa-consumer-service.us-west-1.elasticbeanstalk.com/consumer/v1',
  // productList: 'http://qa-product-service.us-west-1.elasticbeanstalk.com/api/products/public',
  productList: "http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products/public",
  geoCode: 'https://maps.googleapis.com/maps/api/geocode/json',
  s3: 'https://s3.us-east-2.amazonaws.com/',
  checkout: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/order/v1',
  card: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/payment/v1',
  shippingMethod: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com',
  stripePK: 'pk_test_pNeF3FuRWQ99HxWEMvVbLlKN',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};

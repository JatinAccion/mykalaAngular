// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { apiNames, commonMessages, regexPatterns } from './common';

export const environment = {
  production: false,
  login: 'http://dev-user-service.us-east-2.elasticbeanstalk.com',
  userService: 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/user/v1',
  profileInterest: 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com/consumer/v1',
  productList: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products',
  getOffer: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products',
  geoCode: 'https://maps.googleapis.com/maps/api/geocode/json',
  s3: 'https://s3.us-east-2.amazonaws.com/',
  checkout: 'http://dev-orderservice.us-east-1.elasticbeanstalk.com/payment/v1',
  shippingMethod: 'http://dev-retailer-service-mongo.us-east-1.elasticbeanstalk.com',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
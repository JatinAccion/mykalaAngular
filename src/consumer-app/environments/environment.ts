// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { apiNames, commonMessages, regexPatterns } from './common';

export const environment = {
  production: false,
  login: 'http://dev-user-service.us-east-2.elasticbeanstalk.com',
  userService: 'http://dev-user-signup.us-east-2.elasticbeanstalk.com',
  profileInterest: 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com',
  productList: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products',
  getOffer: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products',
  geoCode: 'https://maps.googleapis.com/maps/api/geocode/json',
  s3: 'https://s3.us-east-2.amazonaws.com/',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};

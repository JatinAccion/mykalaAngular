import { apiNames } from './common';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //Api: 'http://localhost:3000',
  Api: 'http://localhost:8081',
  AdminApi: 'http://localhost:8082',
  //AdminApi: 'http://192.168.169.254:8082',
  apis: apiNames

};

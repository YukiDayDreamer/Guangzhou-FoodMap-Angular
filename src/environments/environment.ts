// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  baseUrl: 'http://localhost:3000',
  production: false,
  firebase: {
    apiKey: 'AIzaSyDHGL2Nic6Tq25STo11but_I0PSKsBC4NQ',
    authDomain: 'food-map-9872d.firebaseapp.com',
    databaseURL: 'https://food-map-9872d.firebaseio.com',
    projectId: 'food-map-9872d',
    storageBucket: 'food-map-9872d.appspot.com',
    messagingSenderId: '646793140117'
  }
};

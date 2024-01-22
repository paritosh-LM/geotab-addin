import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

geotab.addin.myRideViewAssetProvision = function (api, state) {
  console.log('variabe assignemend');
  console.log(document.getElementById('root'));
  return {
    initialize: function (api, state, callback) {
      console.log('init');
      document.addEventListener('DOMContentLoaded', () => {
        platformBrowserDynamic()
          .bootstrapModule(AppModule)
          .catch((err) => console.error(err));
      });
      console.log(document.getElementById('root'));
      callback();
    },
    focus: function (api, state) {
      console.log('focus');
    },
    blur: function (api, state) {
      console.log('blur');
    },
  };
};

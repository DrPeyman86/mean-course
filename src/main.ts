//this page in angular app gets executed first
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
//this is really the code that starts the application.
//abvove is importing certain packages, like require in nodejs. 
//below you are providing the AppModule, the name of your module sending it as an argument 
//the app.module.
//angular then parses this module with those components inside app.module.ts
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

## ng-grecaptcha [![npm version](https://badge.fury.io/js/ng-grecaptcha.svg)](http://badge.fury.io/js/ng-grecaptcha)
Google recaptcha V2 and V3 for Angular 2+

**Main Advantage of using ng-grecaptcha is the ability to use V2 and V3 simultaneously, lightweight and ability to control the recaptcha in all possible ways.**

## Version History:
0.2.4 -> One method to execute and 1 method to subscribe. 1 same version recaptcha per page

0.3.2 -> One method to execute and subscribe. 1 same version recaptcha per page

0.4.3 -> One method to execute with callback or bind call back to other method. Multiple recaptcha's per page

## Dependencies:
Angular, RxJs

## <a name="installation"></a>Installation
The easiest way is to install through [yarn](https://yarnpkg.com/package/ng-grecaptcha) or [npm](https://www.npmjs.com/package/ng-grecaptcha):
```sh
yarn add ng-grecaptcha
npm i ng-grecaptcha --save
```

## Usage:
To start with, you need to import the `GrecaptchaModule` and other required options like:

`GRECAPTCHA_SETTINGS`, `GRECAPTCHA_LANGUAGE`, `GrecaptchaSettings`
```typescript
// app.module.ts
import {
    GRECAPTCHA_SETTINGS,
    GRECAPTCHA_LANGUAGE,
    GrecaptchaSettings,
    GrecaptchaModule
} from 'ng-grecaptcha';
import { BrowserModule }  from '@angular/platform-browser';
import { MyApp } from './app.component.ts';

/*
  * Available settings:
  * v2SiteKey, v3SiteKey, badge, theme, size, type
*/
const gRecaptchaSettings: GrecaptchaSettings = {
  v2SiteKey: '<recaptchaV2SiteKey>', // Optional
  v3SiteKey: '<recaptchaV3SiteKey>', // Optional
  size: 'invisible' // Optional and This is for only V2
};

@NgModule({
  bootstrap: [MyApp],
  declarations: [MyApp],
  imports: [
    BrowserModule,
    GrecaptchaModule,
    .....
  ],
  provide: [
    {
      provide: GRECAPTCHA_SETTINGS,
      useValue: gRecaptchaSettings,
    },
    {
      provide: GRECAPTCHA_LANGUAGE,
      useValue: 'en'
    },
  ]
})
export class MyAppModule { }
```

Once you have done that, the rest is simple:
```typescript
// app.component.ts
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// app.module.ts
import { GrecaptchaService, IRecaptchaResponse } from 'ng-grecaptcha';

@Component({
    selector: 'my-app',
    template: `<g-recaptcha [gRecaptchaId]="gRecaptchaId"></g-recaptcha>`,
})
export class MyApp {

    v2Subscription: Subscription;
    v3Subscription: Subscription;
    recaptchaV2Response: string;
    recaptchaV3Response: string;

    gRecaptchaId = 'signIn';
    v3ActionName = 'signIn';

    constructor(private gRecaptchaService: GrecaptchaService) {
        // Executing Recaptcha V2
        // callback to get Recaptcha V2 Token
        this.gRecaptchaService.executeV2Captcha(gRecaptchaId, (data: IRecaptchaResponse) => {
            if (data) {
                this.recaptchaV2Response = data.token;
                // After getting token, we can also execute recaptcha V3 at this step
            }
        });

        // Executing Recaptcha V3 (accepted optional input with action name)
        // callback to get Recaptcha V3 Token
        this.gRecaptchaService.executeV3Captcha(gRecaptchaId, v3ActionName, (data: IRecaptchaResponse) => {
            if (data) {
                this.recaptchaV3Response = data.token;
                // After getting token, we can also execute recaptcha V2 at this step
            }
        });
    }

}
```
**Note:** After generating V2 recaptcha token, it is mandatory to reset the recaptcha if it's already submitted to backend.

Few of the features which is applicable only to **V2 Recaptcha**:

- Widget id,
- Captcha Response and
- Resetting Captcha
```typescript
// app.component.ts
import { Component } from '@angular/core';
// app.module.ts
import { GrecaptchaService } from 'ng-grecaptcha';

@Component({
    selector: 'my-app',
    template: `<g-recaptcha [gRecaptchaId]="gRecaptchaId"></g-recaptcha>`,
})
export class MyApp {

    gRecaptchaId = 'signIn';
    widgetId: number;

    constructor(private gRecaptchaService: GrecaptchaService) {
      this.widgetId = this.gRecaptchaService.getWidgetId(gRecaptchaId); // returns a widget id of type number
      this.gRecaptchaService.getCaptchaResponse(widgetId); // input is optional and returns a token of type string
      this.gRecaptchaService.resetCaptcha(widgetId); // input is optional
    }

}
```

Alternative way to getting captcha response and resetting recaptcha:
```typescript
    grecaptcha.getResponse(); // Can also provide widge Id as optional input
    grecaptcha.reset(); // Can also provide widge Id as optional input
```

New feature where the captcha's can be toggled dynamically on load using the provided input's for the gcaptcha component.
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<g-recaptcha
                  [gRecaptchaId]="'signIn'"
                  [showV2Captcha]="checkV2Captcha"
                  [showV3Captcha]="checkV3Captcha"></g-recaptcha>`,
})
export class MyApp {

    checkV2Captcha: boolean; // optional
    checkV3Captcha: boolean; // optional

    constructor() { }

}
```

**Note:** It is not madatory to provide showV2Captcha or showV3Captcha, By simply providing sitekeys at the provider level the required captcha's will be rendered.

**Please use Recaptcha V2 and V3 as per requirements.**

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
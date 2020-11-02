# ng-grecaptcha
Google recaptcha V2 and V3 for Angular 2+

**Main Advantage of using ng-grecaptcha is the ability to use V2 and V3 simultaneously, lightweight and ability to control the recaptcha in all possible ways.**

To start with, you need to import the `GrecaptchaModule` and other required options like: <br>
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
import { GrecaptchaService } from 'ng-grecaptcha';

@Component({
    selector: 'my-app',
    template: `<g-recaptcha [gRecaptchaId]="'signIn'"></g-recaptcha>`,
})
export class MyApp {

    v2Subscription: Subscription;
    v3Subscription: Subscription;
    recaptchaV2Response: string;
    recaptchaV3Response: string;

    constructor(private gRecaptchaService: GrecaptchaService) {
        // Executing Recaptcha V2
        this.gRecaptchaService.executeV2Captcha();
        // Subscribing to Recaptcha V2 Token
        this.v2Subscription = this.gRecaptchaService.getV2CaptchaToken().subscribe(v2token => {
            if (v2token) {
                this.recaptchaV2Response = v2token;
                // After getting token, we can also execute recaptcha V3 at this step
            }
        });

        // Executing Recaptcha V3 (accepted optional input with action name)
        this.gRecaptchaService.executeV3Captcha();
        // Subscribing to Recaptcha V2 Token
        this.v3Subscription = this.gRecaptchaService.getV3CaptchaToken().subscribe(v3token => {
            if (v3token) {
                this.recaptchaV3Response = v3token;
                // After getting token, we can also execute recaptcha V2 at this step
            }
        });
    }

    // Don't forget to unsubscribe
    ngOnDestroy() {
        if (this.v2Subscription) {
            this.v2Subscription.unsubscribe();
        }
        if (this.v3Subscription) {
            this.v3Subscription.unsubscribe();
        }
    }

}
```

Few of the features which is applicable to V2:<br>
Get a widget id (applicable only for V2)<br>
Getting Captcha Response Value<br>
Resetting the Captcha using GrecaptchaService (Resetting recaptcha is only applicable to V2)
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

    constructor(private gRecaptchaService: GrecaptchaService) {
      this.gRecaptchaService.getWidgetId(gRecaptchaId); // returns a widget id of type number
      this.gRecaptchaService.getCaptchaResponse(); // Can also provide widge Id as optional input
      this.gRecaptchaService.resetCaptcha(); // Can also provide widge Id as optional input
    }

}
```

Alternative way to getting captcha response and resetting recaptcha:
```typescript
    grecaptcha.getResponse(); // Can also provide widge Id as optional input
    grecaptcha.reset(); // Can also provide widge Id as optional input
```


New feature where the captcha's can be toggled dynamically using the provided input's for the gcaptcha component.
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

Note: It is not madatory to provide showV2Captcha or showV3Captcha, By simply providing sitekeys at the provider level the required captcha's will be rendered.

Please use Recaptcha V2 and V3 as per requirements.
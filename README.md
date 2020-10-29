# ng-grecaptcha
Google recaptcha V2 and V3 for Angular 2+

To start with, you need to import the `GrecaptchaModule` and
other required options like:
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
        // Execuring Recaptcha V2
        this.gRecaptchaService.executeV2Captcha();
        // Subscribing to Recaptcha V2 Token
        this.v2Subscription = this.gRecaptchaService.getV2CaptchaToken().subscribe(v2token => {
            if (v2token) {
                this.recaptchaV2Response = v2token;
                // After getting token, we can also execute recaptcha V3 at this step
            }
        });

        // Execuring Recaptcha V3 (accepted optional input with action name)
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

Please use Recaptcha V2 and V3 as per requirements.
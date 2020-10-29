import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrecaptchaService } from './grecaptcha.service';

@Component({
  exportAs: 'gReCaptcha',
  selector: 'g-recaptcha',
  template: `
    <div id="grecaptcha-{{gRecaptchaId.split(' ').join('')}}" ></div>
  `,
  styles: [],
})
export class GrecaptchaComponent implements OnDestroy {

  @Input() gRecaptchaId: string = '';
  private captchaScriptSubscription: Subscription;

  constructor(private gRecaptchaService: GrecaptchaService) {
    this.gRecaptchaService.callRecaptchaAPI();
    this.captchaScriptSubscription = this.gRecaptchaService.captchaScriptStatus().subscribe((status) => {
      if (status && this.gRecaptchaService.hasV2Captcha()) {
        this.gRecaptchaService.renderV2Captch('recaptcha-' + this.gRecaptchaId.split(' ').join(''));
      }
    });
  }

  public ngOnDestroy() {
    this.gRecaptchaService.resetCaptcha();
    if (this.captchaScriptSubscription) {
      this.captchaScriptSubscription.unsubscribe();
    }
  }

}

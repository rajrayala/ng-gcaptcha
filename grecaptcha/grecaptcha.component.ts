import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class GrecaptchaComponent implements OnInit, OnDestroy {

  @Input() gRecaptchaId: string = '';
  @Input() showV2Captcha: boolean;
  @Input() showV3Captcha: boolean;
  private captchaScriptSubscription: Subscription;

  constructor(private gRecaptchaService: GrecaptchaService) { }

  public ngOnInit() {
    this.gRecaptchaService.callRecaptchaAPI(this.showV2Captcha, this.showV3Captcha);
    this.captchaScriptSubscription = this.gRecaptchaService.captchaScriptStatus().subscribe((status) => {
      if (status && (this.gRecaptchaService.hasV2Captcha() && (this.showV2Captcha === undefined || this.showV2Captcha))) {
        this.gRecaptchaService.renderV2Captch('grecaptcha-' + this.gRecaptchaId.split(' ').join(''));
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

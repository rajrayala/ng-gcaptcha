import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrecaptchaService } from './grecaptcha.service';

@Component({
  exportAs: 'gReCaptcha',
  selector: 'g-recaptcha',
  template: `
    <div id="grecaptcha-{{gRecaptchaId.split(' ').join('')}}" [attr.data-widgetid]="getWidgetId()"></div>
  `,
  styles: [],
})
export class GrecaptchaComponent implements OnInit, OnDestroy {

  @Input() gRecaptchaId: string = '';
  @Input() showV2Captcha: boolean;
  @Input() showV3Captcha: boolean;
  private widgetId: number;
  private captchaScriptSubscription: Subscription;

  constructor(private gRecaptchaService: GrecaptchaService) { }

  public ngOnInit() {
    this.gRecaptchaService.callRecaptchaAPI(this.showV2Captcha, this.showV3Captcha);
    this.captchaScriptSubscription = this.gRecaptchaService.captchaScriptStatus().subscribe((status) => {
      if (status && (this.gRecaptchaService.hasV2Captcha() && (this.showV2Captcha === undefined || this.showV2Captcha))) {
        this.gRecaptchaService.renderV2Captch(this.gRecaptchaId).then((id) => {
          this.widgetId = id;
        });
      }
    });
  }

  public ngOnDestroy() {
    this.gRecaptchaService.resetCaptcha();
    if (this.captchaScriptSubscription) {
      this.captchaScriptSubscription.unsubscribe();
    }
  }

  public getWidgetId(): number {
    return this.widgetId;
  }

}

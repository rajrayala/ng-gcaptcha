import { Component, Input, OnInit } from '@angular/core';
import { GrecaptchaService } from './grecaptcha.service';

@Component({
  exportAs: 'gReCaptcha',
  selector: 'g-recaptcha',
  template: `
    <div id="grecaptcha-{{gRecaptchaId.split(' ').join('')}}" [attr.data-widgetid]="getWidgetId()"></div>
  `,
  styles: [],
})
export class GrecaptchaComponent implements OnInit {

  @Input() gRecaptchaId: string = '';
  @Input() showV2Captcha: boolean;
  @Input() showV3Captcha: boolean;
  private widgetId: number;

  constructor(private gRecaptchaService: GrecaptchaService) { }

  public ngOnInit() {
    this.gRecaptchaService.initializeRecaptcha(this.showV2Captcha, this.showV3Captcha, this.gRecaptchaId, (id) => {
      this.widgetId = id;
    });
  }

  public getWidgetId(): number {
    return this.widgetId;
  }

}

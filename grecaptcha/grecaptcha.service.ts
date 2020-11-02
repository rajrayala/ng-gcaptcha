import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  GRECAPTCHA_LANGUAGE,
  GRECAPTCHA_SETTINGS,
  GrecaptchaSettings,
  initialGRecaptchaSettings,
  IRecaptchaResponse,
} from './grecaptcha.model';

@Injectable({
  providedIn: 'root',
})
export class GrecaptchaService {

  private v2SiteKey: string;
  private v3SiteKey: string;
  private theme: ReCaptchaV2.Theme;
  private type: ReCaptchaV2.Type;
  private size: ReCaptchaV2.Size;
  private badge: ReCaptchaV2.Badge;
  private language: string = '';
  private v2RenderScriptStatus: boolean = false;
  private v3RenderScriptStatus: boolean = false;
  private captchaSettings = new BehaviorSubject<GrecaptchaSettings>(initialGRecaptchaSettings);
  private isScriptLoaded = new BehaviorSubject<boolean>(false);
  private returnV2Token = new Subject<IRecaptchaResponse>();
  private returnV3Token = new Subject<IRecaptchaResponse>();

  constructor(@Optional() @Inject(GRECAPTCHA_SETTINGS) settings?: GrecaptchaSettings,
              @Optional() @Inject(GRECAPTCHA_LANGUAGE) language?: string) {
    if (settings) {
      this.v2SiteKey = settings.v2SiteKey;
      this.v3SiteKey = settings.v3SiteKey;
      this.theme = settings.theme;
      this.type = settings.type;
      this.size = settings.size;
      this.badge = settings.badge;
    }
    if (language) {
      this.language = language;
    }
    this.captchaSettings.next(settings);
  }

  public callRecaptchaAPI(showV2Captcha: boolean, showV3Captcha: boolean) {
    if (this.v3SiteKey && this.checkUserInput(showV3Captcha) && !this.v3RenderScriptStatus) {
      this.appendRecaptchaAPI('v3', 'https://www.google.com/recaptcha/api.js?render=' + this.v3SiteKey
      + '&hl=' + this.language);
      this.v3RenderScriptStatus = true;
    } else if (this.v2SiteKey && this.checkUserInput(showV2Captcha) && !this.v2RenderScriptStatus && !this.v3RenderScriptStatus) {
      this.appendRecaptchaAPI('v2', 'https://www.google.com/recaptcha/api.js?render=explicit&hl=' + this.language);
      this.v2RenderScriptStatus = true;
    }
  }

  // Only needed for rendering V2 Recaptcha
  public renderV2Captch(id: string): Promise<number>{
    return new Promise<number>(resolve => {
        grecaptcha.ready(() => {
          resolve(grecaptcha.render(document.getElementById('grecaptcha-' + id.split(' ').join('')), {
              sitekey: this.v2SiteKey,
              badge: this.badge,
              theme: this.theme,
              size: this.size,
              type: this.type,
              callback: this.recaptchaV2Callback.bind(this),
              'expired-callback': this.resetCaptcha.bind(this),
          }));
      });
    });
  }

  // For executing V2 Recaptcha
  public executeV2Captcha(): Observable<IRecaptchaResponse> {
    grecaptcha.ready(() => {
        grecaptcha.execute();
    });
    return this.returnV2Token.asObservable();
  }

  // For executing V3 Recaptcha
  public executeV3Captcha(actionName?: string): Observable<IRecaptchaResponse> {
    grecaptcha.ready(() => {
        grecaptcha.execute(this.v3SiteKey, { action: actionName ? actionName : 'RecaptchaV3'}).then((v3token) => {
            this.returnV3Token.next({
              type: 'v3',
              token: v3token,
              action: actionName || 'RecaptchaV3'
            });
        });
    });
    return this.returnV3Token.asObservable();
  }

  // Get widget id and it's applicable only for V2
  public getWidgetId(gRecaptchaId: string): number {
    if (document.getElementById("grecaptcha-" + gRecaptchaId.split(' ').join(''))) {
        return parseInt(document.getElementById("grecaptcha-" + gRecaptchaId.split(' ').join('')).getAttribute('data-widgetid'));
    }
    return null;
  }

  // Applicable only for V2
  public getCaptchaResponse(widgetId?: number): string {
    if (typeof grecaptcha !== 'undefined' && widgetId) {
        return grecaptcha.getResponse(widgetId);
    } else if (typeof grecaptcha !== 'undefined') {
        return grecaptcha.getResponse();
    }
  }

  // Get Recaptcha Settings
  public getCaptchaSettings(): GrecaptchaSettings {
    return this.captchaSettings.getValue();
  }

  // Check if V2
  public hasV2Captcha(): boolean {
    return this.v2SiteKey ? true : false;
  }

  // Check if V3
  public hasV3Captcha(): boolean {
    return this.v3SiteKey ? true : false;
  }

  // Check script loaded status
  public getCaptchaScriptStatus(): boolean {
    return this.isScriptLoaded.getValue();
  }

  // Getter method to check the script loaded status
  public captchaScriptStatus(): Observable<boolean> {
    return this.isScriptLoaded.asObservable();
  }

  // Resetting Recaptcha
  public resetCaptcha(widgetId?: number) {
    if (typeof grecaptcha !== 'undefined' && widgetId) {
        grecaptcha.reset(widgetId);
    } else if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
  }

  private checkUserInput(input: boolean) {
    return (input === undefined || input) ? true : false;
  }

  private appendRecaptchaAPI(type: string, url?: string) {
    const script = document.createElement('script');
    script.innerHTML = '';
    const srcUrl = url || 'https://www.google.com/recaptcha/api.js';
    script.src = srcUrl;
    script.id = `${type}-grecaptcha-script`;
    script.async = false;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
        // This will help to check and render the V2 Recaptcha
        this.isScriptLoaded.next(true);
    };
    script.onerror = () => {
        // For rare-case scenario
        document.getElementsByTagName('head')[0].appendChild(script);
    };
  }

  // On V2 Recaptcha execution this callback function is called
  private recaptchaV2Callback(v2token: string) {
    if (v2token) {
        this.returnV2Token.next({
          type: 'v2',
          token: v2token,
        });
    }
  }
}

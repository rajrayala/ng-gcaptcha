import { InjectionToken } from '@angular/core';

export const GRECAPTCHA_SETTINGS = new InjectionToken<GrecaptchaSettings>('grecaptcha-settings');
export const GRECAPTCHA_LANGUAGE = new InjectionToken<string>('grecaptcha-language');

export interface GrecaptchaSettings {
  v2SiteKey?: string;
  v3SiteKey?: string;
  theme?: ReCaptchaV2.Theme;
  type?: ReCaptchaV2.Type;
  size?: ReCaptchaV2.Size;
  badge?: ReCaptchaV2.Badge;
}

export const initialGRecaptchaSettings: GrecaptchaSettings = {
  v2SiteKey: '',
  v3SiteKey: '',
};

export interface IRecaptchaResponse {
  type: string;
  gRecaptchaId?: string;
  token: string;
  action?: string;
}

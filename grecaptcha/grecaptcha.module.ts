import { NgModule } from '@angular/core';
import { GrecaptchaComponent } from './grecaptcha.component';
import { GrecaptchaService } from './grecaptcha.service';

@NgModule({
  declarations: [GrecaptchaComponent],
  imports: [
  ],
  exports: [GrecaptchaComponent],
  providers: [
    GrecaptchaService,
  ],
})
export class GrecaptchaModule {
  // We need this to maintain backwards-compatibility with v4. Removing this will be a breaking change
  public static forRoot() {
    return GrecaptchaModule;
  }
}

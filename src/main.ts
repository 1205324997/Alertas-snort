import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    HttpClientModule,
    ...appConfig.providers, provideAnimationsAsync(), provideAnimationsAsync(),  // Si tienes más proveedores en appConfig
  ],
}).catch((err) => console.error(err));

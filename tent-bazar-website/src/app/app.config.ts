import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './interceptor/loader.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptors([loaderInterceptor])),
    MatDialogModule,
    provideAnimations(), // Required for Toastr animations
    provideToastr({
      timeOut: 3000, // Global default timeout
      positionClass: 'toast-top-right', // Global default position
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
};

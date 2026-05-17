import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './interceptor/loader.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    MatDialogModule,
    provideAnimations(), // Required for Toastr animations
    provideToastr({
      timeOut: 3000, // Global default timeout
      positionClass: 'toast-top-right', // Global default position
      preventDuplicates: true, // Prevent duplicate toasts
    }),
    provideCharts(withDefaultRegisterables())
  ],
};

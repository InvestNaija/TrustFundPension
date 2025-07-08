import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Material from '@primeng/themes/material';



export const appConfig: ApplicationConfig = {
  providers: [ provideHttpClient(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync('noop'), provideCharts(withDefaultRegisterables()), provideAnimationsAsync(), provideToastr(), provideAnimations(),
    providePrimeNG({
            theme: {
                preset: Material,
                options: {
            darkModeSelector: false || 'none'
        }

            }
        })]
};

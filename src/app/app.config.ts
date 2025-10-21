import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { cartReducer } from './states/cart/cart.reducer';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { CartEffects } from './states/cart/cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideState({ name: 'cart', reducer: cartReducer }),
    provideStore(),
    provideEffects([CartEffects]),
  ],
};

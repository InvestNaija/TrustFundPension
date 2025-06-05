import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './_shared/ui/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/auth/auth.routing').then(auth => auth.authRoutes),
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/features/features.routing').then(feature => feature.featuresRoutes),
  },
  { path: '**', component: PageNotFoundComponent },
];

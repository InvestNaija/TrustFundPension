import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features.component';
import { AuthGuard } from '@app/_shared/core/providers/auth.guard';

export const featuresRoutes: Routes = [
  {
    path: '',
    component: FeaturesComponent,
    children: [
    {
      path: 'home',
      data: {title: 'Home'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/home/home.routing').then((a) => a.homeRoutes),
    },
    {
      path: 'transactions',
      data: {title: 'Transactions'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/transactions/transactions.routing').then((a) => a.transactionRoutes),
    },
    {
      path: 'analytics',
      data: {title: 'Analytics'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/analytics/analytics.routing').then((a) => a.analyticsRoutes),
    },
    {
      path: 'fund-management',
      data: {title: 'Fund management'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/fund-management/fund-management.routing').then((a) => a.fundRoutes),
    },
    {
      path: 'user-management',
      data: {title: 'User management'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/user-management/user-management.routing').then((a) => a.userRoutes),
    },
    {
      path: 'communications',
      data: {title: 'Communications'},
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../features/communications/communications.routing').then((a) => a.communicationsRoutes),
    },
    {
      path: 'profile',
      data: {title: 'Profile'},
      canActivate: [AuthGuard],
      loadComponent: () =>
        import('../features/profile/profile.component').then((a) => a.ProfileComponent),
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
   ]
  },
  { path: '', redirectTo: '/app/home', pathMatch: 'full' },
];

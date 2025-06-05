import { Routes, RouterModule } from '@angular/router';
import { FundManagementComponent } from './fund-management.component';
import { ViewFundManagementComponent } from './view/view-fund-management/view-fund-management.component';

export const fundRoutes: Routes = [
  {
    path: '',
    component: FundManagementComponent,
    data: { title: 'Fund Management' },
    children: [
      {
        path: 'view',
        data: { title: 'Fund Management' },
        component: ViewFundManagementComponent,
      },

      { path: '', redirectTo: 'view', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/fund-management/view', pathMatch: 'full' },
];

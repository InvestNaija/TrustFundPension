import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { ViewUserManagementComponent } from './view/view-user-management/view-user-management.component';
import { AllComponent } from './view/view-user-management/all/all.component';
import { OperatorComponent } from './view/view-user-management/operator/operator.component';
import { SupervisorComponent } from './view/view-user-management/supervisor/supervisor.component';
import { ManagerComponent } from './view/view-user-management/manager/manager.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'view',
        data: { title: 'User Management' },
        component: ViewUserManagementComponent,
        children: [
          {
            path: 'all',
            component: AllComponent,
            data: { title: 'User Management' },
          },
          {
            path: 'operator',
            component: OperatorComponent,
            data: { title: 'User Management' },
          },
          {
            path: 'supervisor',
            component: SupervisorComponent,
            data: { title: 'User Management' },
          },
          {
            path: 'manager',
            component: ManagerComponent,
            data: { title: 'User Management' },
          },
          { path: '', redirectTo: 'all', pathMatch: 'full' },
        ],
      },

      { path: '', redirectTo: 'view/all', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/user-management/view/all', pathMatch: 'full' },
];

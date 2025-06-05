import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth.component';

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
    {
      path: 'login',
      title: 'Login',
      component: LoginComponent
    },
    {
      path: 'recover-password',
      title: 'Recover Password',
      component: ForgotPasswordComponent
    },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
   ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full'},
];


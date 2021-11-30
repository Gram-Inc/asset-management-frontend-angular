import { Route } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';

export const authRoutes: Route[] = [
  // { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-out',
    component: SignInComponent,
  },
];

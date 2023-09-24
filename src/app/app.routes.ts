import { canActivate, hasCustomClaim } from '@angular/fire/auth-guard';

import { ErrorComponent } from './pages/error/error.component';
import { LayoutComponent } from './layout/layout.component';
import { Route } from '@angular/router';

const adminOnly = () => hasCustomClaim('admin');
// const vendorOnly = () => hasCustomClaim('vendor')
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login'])
// const redirectLoggedInToHome = () => redirectLoggedInTo(['/'])
// const belongsToAccount = (next: { params: { id: unknown } }) =>
//   hasCustomClaim(`account-${next.params.id}`)
//   // This pipe redirects a user to their "profile edit" page or the "login page" if they're unauthenticated
// // { path: 'profile', ...canActivate(redirectToProfileEditOrLogin) }
// const redirectToProfileDashboardOrLogin = () =>
// map((user) => (user ? ['/home'] : ['/login']))

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
    ...canActivate(adminOnly),
  },
  { path: '**', component: ErrorComponent },
];

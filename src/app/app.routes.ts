import { AuthComponent } from './pages/auth/auth.component';
import { ErrorComponent } from './pages/error/error.component';
import { LayoutComponent } from './layout/layout.component';
import { Route } from '@angular/router';

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
    component: AuthComponent,
  },
  { path: '**', component: ErrorComponent },

];

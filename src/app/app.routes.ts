import { AdminAuthGuard } from './guards/admin-guard.guard';
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
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminAuthGuard],
  },
  { path: '**', component: ErrorComponent },
];

import { Observable, map } from 'rxjs';

import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { inject } from '@angular/core';

export const AdminAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin: Observable<boolean> = authService.user$.pipe(
    map((user: Partial<User> | null | undefined) => {
      return user?.role === 'admin';
    })
  );

  isAdmin.subscribe((isAdmin) => {
    if (!isAdmin) {
      router.navigate(['']);
    }
  });
};

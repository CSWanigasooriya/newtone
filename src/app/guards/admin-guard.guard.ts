import { Observable, map } from 'rxjs';

import { AuthService } from './../services/auth.service';
import { User } from '../models/user.model';
import { inject } from '@angular/core';

export const AdminAuthGuard = () => {
  const authService = inject(AuthService);

  const isAdmin: Observable<boolean> = authService.user$.pipe(
    map((user: Partial<User> | null | undefined) => {
      return user?.role === 'admin';
    })
  );

  return isAdmin;
};

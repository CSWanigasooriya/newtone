import { InjectionToken } from '@angular/core';

export interface ErrorConfig {
  code: string;
  message: string;
}

export const ERROR_CONFIG = new InjectionToken<ErrorConfig>('error.config');

export const NEWTONE_ERROR_CONFIG: ErrorConfig[] = [
  {
    code: 'auth/invalid-email',
    message: 'Invalid email address',
  },
  
];

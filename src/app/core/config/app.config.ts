import { InjectionToken } from '@angular/core';

export interface AppConfig {
  title: string;
  dark_theme: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const NEWTONE_DI_CONFIG: AppConfig = {
  title: 'Newtone',
  dark_theme: false,
};

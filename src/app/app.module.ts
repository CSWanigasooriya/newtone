import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '@newtone/material';
import { NgModule } from '@angular/core';
import { PROVIDERS_CONFIG } from './core/config/providers.config';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { counterReducer } from './core/state/counter/counter.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { themeReducer } from './core/state/theme/theme.reducer';

export function localStorageSyncReducer(
  reducer: ActionReducer<unknown>
): ActionReducer<unknown> {
  return localStorageSync({
    keys: ['count', 'theme'],
    rehydrate: true,
  })(reducer);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(
      { count: counterReducer, theme: themeReducer },
      { metaReducers: metaReducers }
    ),
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [PROVIDERS_CONFIG],
  bootstrap: [AppComponent],
})
export class AppModule {}

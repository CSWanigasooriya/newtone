import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '@newtone/material';
import { NgModule } from '@angular/core';
import { PROVIDERS_CONFIG } from './core/config/providers.config';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { appRoutes } from './app.routes';
import { counterReducer } from './core/state/counter/counter.reducer';
import { firebaseConfig } from './core/config/firebase.config';
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
    SharedModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    StoreModule.forRoot(
      { count: counterReducer, theme: themeReducer },
      { metaReducers: metaReducers }
    ),
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  providers: [PROVIDERS_CONFIG],
  bootstrap: [AppComponent],
})
export class AppModule {}

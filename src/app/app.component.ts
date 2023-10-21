import { Component, Inject, OnDestroy } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  decrement,
  increment,
  reset,
} from './core/state/counter/counter.actions';

import { MatIconRegistry } from '@angular/material/icon';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from './core/config/app.config';

@Component({
  selector: 'newtone-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  count$: Observable<number>;
  theme$: Observable<boolean>;
  loading = false;

  private _subscriptions = new Subscription();

  constructor(
    private _router: Router,
    private _iconRegistry: MatIconRegistry,
    private _overlayContainer: OverlayContainer,
    private _store: Store<{ count: number; theme: boolean }>,
    @Inject(APP_CONFIG) public config: AppConfig,
    private _titleService: Title
  ) {
    this.count$ = _store.select('count');
    this.theme$ = _store.select('theme');

    this._subscriptions.add(
      this._router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        }
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loading = false;
        }
      })
    );

    this._iconRegistry.setDefaultFontSetClass('material-icons-outlined');
    this._overlayContainer.getContainerElement().classList.add('dark-theme');
    this._titleService.setTitle(
      `${config?.title} | ${this._titleService.getTitle()}`
    );

    this._subscriptions.add(
      this.theme$.subscribe((theme) => {
        if (theme) {
          this._overlayContainer
            .getContainerElement()
            .classList.add('dark-theme');
        } else {
          this._overlayContainer
            .getContainerElement()
            .classList.remove('dark-theme');
        }
      })
    );
  }

  increment() {
    this._store.dispatch(increment());
  }

  decrement() {
    this._store.dispatch(decrement());
  }

  reset() {
    this._store.dispatch(reset());
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}

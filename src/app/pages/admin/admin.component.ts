import { AuthService } from './../../services/auth.service';
import { toggle } from './../../core/state/theme/theme.actions';

import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
} from './../../core/animation/side-bar.animations';
import { APP_CONFIG, AppConfig } from './../../core/config/app.config';

interface ToolbarIconButton {
  icon: string;
  tooltip: string;
  action: () => void;
}

@Component({
  selector: 'newtone-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [sideNavAnimation, sideNavContainerAnimation],
})
export class AdminComponent implements AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  @ViewChild('snav') snav: MatSidenav | undefined;
  @ViewChild(MatSidenavContainer) sidenavContainer:
    | MatSidenavContainer
    | undefined;
  searchControl = new FormControl();
  theme$: Observable<boolean>;
  selected = 0;
  isEnlarge = true;
  iconButtons: ToolbarIconButton[] = [];

  sideNavItems = [
    {
      icon: 'dashboard',
      text: 'Dashboard',
      link: '/admin/dashboard',
    },
    {
      icon: 'inventory',
      text: 'Inventory',
      link: '/admin/inventory',
    },
    {
      icon: 'point_of_sale',
      text: 'Sales',
      link: '/admin/sales',
    },
  ];

  enlarge = {
    decrease: 'chevron_left',
    enlarge: 'chevron_right',
  };

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    public dialog: MatDialog,
    private _store: Store<{ count: number; theme: boolean; sidebar: boolean }>,
    @Optional() @Inject(APP_CONFIG) public config: AppConfig,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _auth: AuthService
  ) {
    this.theme$ = this._store.select('theme');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.iconButtons = [
      {
        icon: 'dark_mode',
        tooltip: 'Dark Mode',
        action: () => {
          this._toggleTheme();
        },
      },
      {
        icon: 'logout',
        tooltip: 'Logout',
        action: () => {
          this._auth.signOut();
        },
      },
    ];
  }

  private _toggleTheme() {
    this._store.dispatch(toggle());
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.sidenavContainer?.scrollable.elementScrolled().subscribe(() => {
        console.log('scrolled');
      })
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.subscriptions.unsubscribe();
  }

  toggleSidebarAnimation(): string {
    return !this.isEnlarge ? 'closed' : 'open';
  }

  toggleSidenav() {
    this.snav?.toggle();
    this.isEnlarge = !this.isEnlarge;
  }
}

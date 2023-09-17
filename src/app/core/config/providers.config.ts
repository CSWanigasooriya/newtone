import { APP_CONFIG, NEWTONE_DI_CONFIG } from './app.config';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import {
  ErrorStateMatcher,
  MAT_DATE_LOCALE,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { CollectionService } from '../../services/collection.service';
import { DialogTemplateService } from '../../shared/services/dialog-template.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_EXPANSION_PANEL_DEFAULT_OPTIONS } from '@angular/material/expansion';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';
import { ProductService } from '../../services/product.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Title } from '@angular/platform-browser';
import { UpperCasePipe } from '@angular/common';
import { UserService } from '../../services/user.service';

/** Custom options the configure the tooltip's default show/hide delays. */
export const tooltipOptions: MatTooltipDefaultOptions = {
  showDelay: 100,
  hideDelay: 50,
  touchendHideDelay: 1000,
};

export const PROVIDERS_CONFIG = [
  // {
  //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
  //   useValue: {
  //     appearance: 'outline',
  //   },
  // },
  {
    provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
    useValue: { hasBackdrop: true },
  },
  {
    provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
    useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
  },
  {
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: {
      separatorKeyCodes: [ENTER, COMMA, TAB],
    },
  },
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: { panelClass: 'mat-dialog-override', hasBackdrop: true },
  },
  { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  {
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'accent' },
  },
  { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  {
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: true, showError: true },
  },
  { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions },
  {
    provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
    useValue: { autoActiveFirstOption: true },
  },
  { provide: MatBottomSheet },
  { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
  {
    provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,
    useValue: {
      expandedHeight: '54px',
      collapsedHeight: '54px',
    },
  },
  { provide: APP_CONFIG, useValue: NEWTONE_DI_CONFIG },
  {
    provide: FIREBASE_OPTIONS,
    useValue: {
      apiKey: 'AIzaSyCXUXiH4emokThLCp8LUKQR0hyiOa_kgoo',
      authDomain: 'newtoneinstruments.firebaseapp.com',
      projectId: 'newtoneinstruments',
      storageBucket: 'newtoneinstruments.appspot.com',
      messagingSenderId: '422767985106',
      appId: '1:422767985106:web:9b5556efa3ecfc458e080b',
      measurementId: 'G-9NF9XM2R8H',
    },
  },
  CollectionService,
  AuthService,
  UserService,
  ProductService,
  DialogTemplateService,
  NotificationService,
  UpperCasePipe,
  Title,
];

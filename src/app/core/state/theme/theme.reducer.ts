import { createReducer, on } from '@ngrx/store';

import { Action } from '@ngrx/store';
import { NEWTONE_DI_CONFIG } from '../../config/app.config';
import { toggle } from './theme.actions';

export const initialState = NEWTONE_DI_CONFIG.dark_theme;

const _themeReducer = createReducer(
  initialState,
  on(toggle, (state) => !state)
);

export function themeReducer(
  state: boolean | undefined,
  action: Action
): boolean {
  return _themeReducer(state, action);
}

import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BreakPointHelper {
  isSmallScreen$: Observable<BreakpointState> = this.breakpointObserver.observe(
    [Breakpoints.Small, Breakpoints.Handset]
  );
  constructor(private breakpointObserver: BreakpointObserver) {}
}

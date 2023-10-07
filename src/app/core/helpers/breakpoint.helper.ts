import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Injectable, OnInit } from '@angular/core';
import { Observable, Subscription, distinctUntilChanged, of, tap } from 'rxjs';

@Injectable()
export class BreakPointHelper implements OnDestroy, OnInit {

isSmall$ : Observable<boolean> = of(false);

  private _subscriptions = new Subscription();

  constructor(private breakpointObserver: BreakpointObserver) { 

  }

  ngOnInit() {
    this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small])
    .pipe(
      tap(value => console.log(value)
        // {
        //   switch(value){
        //     case destr
        //   }
        // }
        ),
      distinctUntilChanged()
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

}

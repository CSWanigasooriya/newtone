import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'newtone-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private _subscriptions = new Subscription();
  currentPage = '';
  breadcrumbItems: string[] = ['HOME'];

  constructor(private _router: Router, private _upperCase: UpperCasePipe) {}

  ngOnInit(): void {
    this._subscriptions.add(
      this._router.events.subscribe(() => {
        this.currentPage = this._router.url;
        this._transformBreadcrumbItem(this.currentPage);
      })
    );
  }

  private _transformBreadcrumbItem(route: string): void {
    const path: string[] = route.split('/');
    path.shift();
    path.map((item) => {
      this.breadcrumbItems = [
        ...this.breadcrumbItems,
        this._upperCase.transform(item),
      ];
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}

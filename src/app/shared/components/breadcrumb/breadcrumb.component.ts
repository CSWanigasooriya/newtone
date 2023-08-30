import { Component, Input } from '@angular/core';

@Component({
  selector: 'newtone-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() breadcrumbItems: string[] = [];
}

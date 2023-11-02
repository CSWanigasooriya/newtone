/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { CollectionService } from '../../../../services/collection.service';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'newtone-create-category',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnDestroy {
  step = 0;

  createCategoryForm: FormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    source: ['', Validators.required],
    imageURL: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation>;
  private _subscriptions = new Subscription();

  constructor(
    breakpointObserver: BreakpointObserver,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _collection: CollectionService
  ) {

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  createCategory() {
    if (this.createCategoryForm.invalid)
      return;

    const categoryFormValue = this.createCategoryForm.value as {
      title: string;
      source: string;
      imageURL: string;
    };

    this._collection
      .createCategory({
        title: categoryFormValue.title ?? '',
        // source: categoryFormValue.source ?? '',
        imageURL: categoryFormValue.imageURL ?? '',
      })
      .then(() => {
        this._router.navigate(['/admin/categories']);
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}

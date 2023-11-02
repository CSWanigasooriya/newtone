import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, switchMap } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from './../../../../models/category.model';
import { CollectionService } from './../../../../services/collection.service';
import { StepperOrientation } from '@angular/cdk/stepper';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

@Component({
  selector: 'newtone-edit-category',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  categoryId!: string;
  step = 0;
  category$!: Observable<Partial<Category> | undefined>;

  updateCategoryForm: FormGroup = this._formBuilder.group({
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
    private _collection: CollectionService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.category$ = this._activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.categoryId = String(params.get('cid'));
        return this._collection.getCategory(this.categoryId);
      })
    );

    this._subscriptions.add(
      this.category$.subscribe((category) => {
        this.updateCategoryForm.patchValue({
          title: category?.title,
          source: category?.source,
          imageURL: category?.imageURL,
        });
      })
    );
  }

  updateCategory() {
    if (this.updateCategoryForm.invalid)
      return;

    const categoryFormValue = this.updateCategoryForm.value as {
      title: string;
      source: string;
      imageURL: string;
    };

    this._collection
      .updateCategory(this.categoryId, {
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
}

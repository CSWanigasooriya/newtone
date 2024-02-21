import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { CollectionService } from '../../../../services/collection.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

@Component({
  selector: 'newtone-create-category',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnDestroy {
  step = 0;
  tags: string[] = [];
  tagControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
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
    if (this.createCategoryForm.invalid) {
      return;
    }
  
    const categoryFormValue = this.createCategoryForm.value as {
      title: string;
      source: string;
      imageURL: string;
    };
  
    const categoryData = {
      title: categoryFormValue.title ?? '',
      // source: categoryFormValue.source ?? '',
      imageURL: categoryFormValue.imageURL ?? '',
      tags: this.tags // Include the tags array in the category data
    };
  
    this._collection.createCategory(categoryData)
      .then(() => {
        this._router.navigate(['/admin/categories']);
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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

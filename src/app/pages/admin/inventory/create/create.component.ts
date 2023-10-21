/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import {
  Product,
  ProductAttributes,
  Size,
} from './../../../../models/product.model';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from './../../../../models/category.model';
import { CollectionService } from '../../../../services/collection.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'newtone-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  filteredCategories!: Observable<Partial<Category>[]>;
  categories$ = this._collection.getCategories();
  selectedCategoryId!: string;

  createProductForm: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    stock: ['', Validators.required],
    categoryId: ['', Validators.required],
    stockThreshold: [10, Validators.required],
  });

  productImagesForm: FormGroup = this._formBuilder.group({
    imageURLs: this._formBuilder.array([
      this._formBuilder.group({
        url: ['', Validators.required],
      }),
    ]),
  });

  productAttributesForm: FormGroup = this._formBuilder.group({
    size: ['', Validators.required],
    color: ['', Validators.required],
    brand: ['', Validators.required],
    weight: ['', Validators.required],
    height: ['', Validators.required],
    width: ['', Validators.required],
    length: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    breakpointObserver: BreakpointObserver,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _collection: CollectionService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.categories$.subscribe((category) => {
      this.filteredCategories = this.createProductForm
        .get('categoryId')!
        .valueChanges.pipe(
          startWith(''),
          map((value: string) => this._filter(value || '', category))
        );
    });
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id;
    this.selectedCategoryId = selectedValue as string;
  }

  createProduct() {
    if (
      this.createProductForm.invalid ||
      this.productImagesForm.invalid ||
      this.productAttributesForm.invalid
    )
      return;

    const productFormValue = this.createProductForm.value as Partial<Product>;

    const productAttributesValue = this.productAttributesForm
      .value as Partial<ProductAttributes>;

    const images = this.productImagesForm.value.imageURLs.map(
      (image: { url: string }) => image.url
    );

    this._collection
      .createProduct({
        name: productFormValue.name ?? '',
        price: Number(productFormValue.price) ?? 0,
        imageURLs: images ?? '',
        categoryId: this.selectedCategoryId ?? '',
        description: productFormValue.description ?? '',
        stock: Number(productFormValue.stock) ?? 0,
        productAttributes: {
          size: productAttributesValue.size ?? Size.UNKNOWN,
          color: productAttributesValue.color ?? '',
          brand: productAttributesValue.brand ?? '',
          weight: Number(productAttributesValue.weight) ?? 0,
          height: Number(productAttributesValue.height) ?? 0,
          width: Number(productAttributesValue.width) ?? 0,
          length: Number(productAttributesValue.length) ?? 0,
        },
        stockThreshold: Number(productFormValue.stockThreshold) ?? 0,
      })
      .then(() => {
        this._router.navigate(['/admin/inventory']);
      });
  }

  get productImages() {
    return this.productImagesForm.get('imageURLs') as FormArray;
  }

  get getFormControls() {
    return this.productImages.controls as FormGroup[];
  }

  addImage() {
    const images = this._formBuilder.group({
      url: ['', Validators.required],
    });
    this.productImages.push(images);
  }

  deleteImage(index: number) {
    this.productImages.removeAt(index);
  }

  private _filter(
    value: string,
    categories: Partial<Category>[]
  ): Partial<Category>[] {
    const filterValue = value.toLowerCase();

    return categories.filter((category) =>
      category?.title?.toLowerCase().includes(filterValue)
    );
  }
}

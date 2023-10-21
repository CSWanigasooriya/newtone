import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, startWith, switchMap } from 'rxjs';
import {
  Product,
  ProductAttributes,
  Size,
} from './../../../../models/product.model';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from './../../../../models/category.model';
import { CollectionService } from './../../../../services/collection.service';
import { StepperOrientation } from '@angular/cdk/stepper';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

@Component({
  selector: 'newtone-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  productId!: string;
  product$!: Observable<Partial<Product> | undefined>;

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
    this._subscriptions.add(
      this.categories$.subscribe((category) => {
        this.filteredCategories = this.createProductForm
          .get('categoryId')!
          .valueChanges.pipe(
            startWith(''),
            map((value: string) => this._filter(value || '', category))
          );
      })
    );
  }
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.product$ = this._activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.productId = String(params.get('pid'));
        return this._collection.getProduct(this.productId);
      })
    );

    this._subscriptions.add(
      this.product$.subscribe((product) => {
        this.createProductForm.patchValue({
          name: product?.name,
          price: product?.price,
          description: product?.description,
          stock: product?.stock,
          // categoryId: product?.categoryId,
          stockThreshold: product?.stockThreshold,
        });
        this.deleteImage(0);
        product?.imageURLs?.map((Image) => this.addImage(Image));
        this.productAttributesForm.patchValue({
          size: product?.productAttributes?.size,
          color: product?.productAttributes?.color,
          brand: product?.productAttributes?.brand,
          weight: product?.productAttributes?.weight,
          height: product?.productAttributes?.height,
          width: product?.productAttributes?.width,
          length: product?.productAttributes?.length,
        });
      })
    );
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
      .updateProduct(this.productId, {
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

  addImage(urlValue = '') {
    const images = this._formBuilder.group({
      url: [urlValue, Validators.required],
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

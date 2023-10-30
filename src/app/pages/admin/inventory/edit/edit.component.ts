import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, startWith, switchMap } from 'rxjs';
import {
  Product,
  ProductVariant,
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
  step = 0;
  product$!: Observable<Partial<Product> | undefined>;
  filteredCategories!: Observable<Partial<Category>[]>;
  categories$ = this._collection.getCategories();
  selectedCategory!: Partial<Category>;

  createProductForm: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    stockThreshold: [10, Validators.required],
  });

  // Initialize the product variants form
  productVariantsForm: FormGroup = this._formBuilder.group({
    variants: this._formBuilder.array([]), // Initialize an empty FormArray for variants
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

    const variantsFormArray = this.productVariantsForm.get(
      'variants'
    ) as FormArray;

    this._subscriptions.add(
      this.product$.subscribe((product) => {
        this.createProductForm.patchValue({
          name: product?.name,
          description: product?.description,
          stockThreshold: product?.stockThreshold,
          categoryId: product?.category?.categoryId,
        });

        product?.variants?.forEach((variant) => {
          const variantFormGroup = this._formBuilder.group({
            size: [variant.size ?? '', Validators.required],
            color: [variant.color ?? '', Validators.required],
            price: [variant.price ?? 0, Validators.required],
            weight: [variant.weight ?? 0, Validators.required],
            height: [variant.height ?? 0, Validators.required],
            width: [variant.width ?? 0, Validators.required],
            length: [variant.length ?? 0, Validators.required],
            stock: [variant.stock ?? 0, Validators.required],
            image: [variant.image ?? '', Validators.required],
          });

          variantsFormArray.push(variantFormGroup);
        });
      })
    );
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id as string;
    this._subscriptions.add(
      this._collection.getCategory(selectedValue).subscribe((cat) => {
        this.selectedCategory = cat!;
      })
    );
  }

  updateProduct() {
    if (this.createProductForm.invalid || this.productVariantsForm.invalid)
      return;

    const productFormValue = this.createProductForm.value as {
      name: string;
      description: string;
      categoryId: string;
      stockThreshold: number;
    };

    const variants = this.productVariantsForm.value.variants.map(
      (variant: Partial<ProductVariant>) => {
        return {
          size: variant.size ?? Size.UNKNOWN,
          color: variant.color ?? '',
          price: Number(variant.price) ?? 0,
          weight: Number(variant.weight) ?? 0,
          height: Number(variant.height) ?? 0,
          width: Number(variant.width) ?? 0,
          length: Number(variant.length) ?? 0,
          stock: Number(variant.stock) ?? 0,
          image: variant.image ?? '',
        };
      }
    );

    this._collection
      .updateProduct(this.productId, {
        name: productFormValue.name ?? '',
        description: productFormValue.description ?? '',
        stockThreshold: Number(productFormValue.stockThreshold) ?? 0,
        variants: variants,
        category: this.selectedCategory ?? {
          categoryId: productFormValue.categoryId ?? '',
        },
      })
      .then(() => {
        this._router.navigate(['/admin/inventory']);
      });
  }

  get productImages() {
    return this.productVariantsForm.get('images') as FormArray;
  }

  get productVariants() {
    return this.productVariantsForm.get('variants') as FormArray;
  }

  get getProductVariantsFormControls() {
    return this.productVariants.controls as FormGroup[];
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

  addVariant() {
    const variantsFormArray = this.productVariantsForm.get(
      'variants'
    ) as FormArray;

    const variantFormGroup = this._formBuilder.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      price: [0, Validators.required], // Initialize with a default value
      weight: [0, Validators.required], // Initialize with a default value
      height: [0, Validators.required], // Initialize with a default value
      width: [0, Validators.required], // Initialize with a default value
      length: [0, Validators.required], // Initialize with a default value
      stock: [0, Validators.required], // Initialize with a default
      image: ['', Validators.required],
    });

    variantsFormArray.push(variantFormGroup);
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

  deleteVariant(index: number) {
    const variantsFormArray = this.productVariantsForm.get(
      'variants'
    ) as FormArray;
    variantsFormArray.removeAt(index);
  }
}

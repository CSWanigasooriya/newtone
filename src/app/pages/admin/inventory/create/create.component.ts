/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ProductVariant, Size } from './../../../../models/product.model';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from './../../../../models/category.model';
import { CollectionService } from '../../../../services/collection.service';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'newtone-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnDestroy {
  productId!: string;
  step = 0;
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

  productSpecificationsForm: FormGroup = this._formBuilder.group({
    specifications: this._formBuilder.array([]),
  });

  stepperOrientation: Observable<StepperOrientation>;
  private _subscriptions = new Subscription();

  constructor(
    breakpointObserver: BreakpointObserver,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _collection: CollectionService
  ) {
    this.initializeVariantsForm();

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

  initializeVariantsForm() {
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
      stock: [1, Validators.required], // Initialize with a default
      image: ['', Validators.required],
    });

    variantsFormArray.push(variantFormGroup);
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id as string;
    this._subscriptions.add(
      this._collection.getCategory(selectedValue).subscribe((cat) => {
        this.selectedCategory = cat!;
      })
    );
  }

  createProduct() {
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

    const specifications =
      this.productSpecificationsForm.value.specifications.map(
        (spec: { key: string; value: string }) => {
          return {
            key: spec.key ?? '',
            value: spec.value ?? '',
          };
        }
      );

    this._collection
      .createProduct({
        name: productFormValue.name ?? '',
        description: productFormValue.description ?? '',
        stockThreshold: Number(productFormValue.stockThreshold) ?? 0,
        variants,
        specifications,
        category: this.selectedCategory ?? {
          categoryId: productFormValue.categoryId ?? '',
          title: '',
          description: '',
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

  get productSpecifications() {
    return this.productSpecificationsForm.get('specifications') as FormArray;
  }

  get getProductVariantsFormControls() {
    return this.productVariants.controls as FormGroup[];
  }

  get getProductSpecificationsFormControls() {
    return this.productSpecifications.controls as FormGroup[];
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

  addSpecification() {
    const specificationFormArray = this.productSpecificationsForm.get(
      'specifications'
    ) as FormArray;

    const specificationFormGroup = this._formBuilder.group({
      key: ['', Validators.required],
      value: [''],
    });

    specificationFormArray.push(specificationFormGroup);
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

  deleteSpecification(index: number) {
    const specificationFormArray = this.productSpecificationsForm.get(
      'specifications'
    ) as FormArray;
    specificationFormArray.removeAt(index);
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}

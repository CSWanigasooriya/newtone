import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import {
  Product,
  ProductAttributes,
  Size,
} from './../../../../models/product.model';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'newtone-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  createProductForm: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    stock: ['', Validators.required],
    category: ['', Validators.required],
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
    private _productService: ProductService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
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

    this._productService
      .updateProduct({
        name: productFormValue.name ?? '',
        price: productFormValue.price ?? 0,
        imageURLs: images ?? '',
        // category: productFormValue.category ?? '',
        description: productFormValue.description ?? '',
        stock: Number(productFormValue.stock) ?? 0,
        productAttributes: {
          size: productAttributesValue.size ?? Size.UNKNOWN,
          color: productAttributesValue.color ?? '',
          brand: productAttributesValue.brand ?? '',
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
}

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';

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
    brand: ['', [Validators.required]],
    stock: ['', Validators.required],
    category: ['', Validators.required],
    threshold: [10, Validators.required],
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
    this._productService
      .updateProduct({
        name: this.createProductForm.value.name ?? '',
        price: this.createProductForm.value.price ?? 0,
        imageURLs: [this.createProductForm.value.imageURLs ?? ''],
        category: this.createProductForm.value.category ?? '',
        description: this.createProductForm.value.description ?? '',
        stock: Number(this.createProductForm.value.stock) ?? 0,
        productAttributes: {
          size: this.createProductForm.value.size ?? '',
          color: this.createProductForm.value.color ?? '',
          brand: this.createProductForm.value.brand ?? '',
        },
        stockThreshold: Number(this.createProductForm.value.threshold) ?? 0,
      })
      .then(() => {
        this._router.navigate(['/product']);
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

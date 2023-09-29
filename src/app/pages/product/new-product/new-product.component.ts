import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { ProductService } from './../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'newtone-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent {
  newProductGroup: FormGroup = this._formBuilder.group({
    pid: [''],
    name: ['', Validators.required],
    price: ['', Validators.required],
    imageURLs: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    brand: ['', [Validators.email, Validators.required]],
    stock: ['', Validators.required],
    rating: ['', Validators.required],
    stockThreshold: ['', Validators.required],
    
  });


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _productService: ProductService,
  ) {}

  handleNewProductForm() {
    if (
      this.newProductGroup.value.name == '' ||
      this.newProductGroup.value.price == '' ||
      this.newProductGroup.value.imageURLs == '' ||
      this.newProductGroup.value.category == '' ||
      this.newProductGroup.value.description == '' ||
      this.newProductGroup.value.brand == '' ||
      this.newProductGroup.value.stock == '' ||
      this.newProductGroup.value.rating == '' ||
      this.newProductGroup.value.stockThreshold == ''
    ) {
      alert('fill all input fields');
      return;
    }
    this._productService
      .updateNewProduct({
        name: this.newProductGroup.value.name,
        price: this.newProductGroup.value.price,
        imageURLs: ['this.newProductGroup.value.imageURLs'],
        category: this.newProductGroup.value.category,
        // productDetails: [{
        //   description: this.newProductGroup.value.description,
        //   brand: this.newProductGroup.value.brand,
        //   stock: this.newProductGroup.value.stock,
        //   rating: this.newProductGroup.value.rating,
        // }],
        stockThreshold: this.newProductGroup.value.stockThreshold,
      })
      .then((res) => {
        // this.openSnackBar('Successfully Created', 'done_outline');
        this._router.navigate(['/pages/home']);
      });
  }
}
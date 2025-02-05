import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products = [
    { name: 'Producto 1', price: 100, image: '../image/florero.jpg' },
    { name: 'Producto 2', price: 150, image: 'lamparas.jpg' },
    { name: 'Producto 3', price: 200, image: 'product3.jpg' },
  ];

  requireImage(imageName: string): string {
    return `assets/images/${imageName}`;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrl: './conf.component.css'
})
export class ConfComponent {
  config = [
    { name: 'Producto 1', price: 100 },
    { name: 'Producto 2', price: 150 },
    { name: 'Producto 3', price: 200 },
  ];
}

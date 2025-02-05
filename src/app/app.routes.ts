import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../auth/register/register.component';
import { MensajeComponent } from '../menu/mensaje/mensaje.component';
import { ConfComponent } from '../menu/conf/conf.component';
import { ProductsComponent } from '../products/products.component';
import { StartComponent } from '../start/start.component';


// Define las rutas
export const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mensaje', component: MensajeComponent },
  { path: 'config', component: ConfComponent },
  { path: 'products', component: ProductsComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: '**', redirectTo: '/start' },
  
];

import { Component, OnInit  } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';
import { HomeComponent } from '../home/home.component';
import { StartComponent } from '../start/start.component';
import { AlertService } from './alert.service';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    CommonModule,
    StartComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NgChartsModule,
    HttpClientModule,
    RouterModule
  ],
})
export class AppComponent implements OnInit {

  alerts: { timestamp: string; src: string; dest: string; details: string }[] = [];
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isstartPage: boolean = false;  // Agregar esta propiedad

  constructor(private router: Router, private alertService: AlertService) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.isLoginPage = true;
        this.isRegisterPage = false;
        this.isstartPage = false;
      } else if (this.router.url === '/register') {
        this.isRegisterPage = true;
        this.isLoginPage = false;
        this.isstartPage = false;
      } else if (this.router.url === '/start') {
        this.isstartPage = true;  // Establecer como true cuando la ruta sea '/start'
        this.isLoginPage = false;
        this.isRegisterPage = false;
      } else {
        this.isLoginPage = false;
        this.isRegisterPage = false;
        this.isstartPage = false;
      }
    });
  }

  ngOnInit(): void {
    // Obtiene alertas simuladas al inicializar
    this.alertService.getAlerts().subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  title = 'alert';
}
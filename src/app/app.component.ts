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
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { Alerta } from './alert.service'; 
import { AboutComponent } from './about/about.component';


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
    RouterModule,
    EstadisticasComponent,
    AboutComponent,
  ],
})
export class AppComponent implements OnInit {

  alerts: { timestamp: string; src: string; dest: string; details: string }[] = [];
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isstartPage: boolean = false; 
  isAboutPage: boolean = false;  

  constructor(private router: Router, private alertService: AlertService) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.isLoginPage = true;
        this.isRegisterPage = false;
        this.isstartPage = false;
        this.isAboutPage = false;  // Resetea la página About
      } else if (this.router.url === '/register') {
        this.isRegisterPage = true;
        this.isLoginPage = false;
        this.isstartPage = false;
        this.isAboutPage = false;
      } else if (this.router.url === '/start') {
        this.isstartPage = true;
        this.isLoginPage = false;
        this.isRegisterPage = false;
        this.isAboutPage = false;
      } else if (this.router.url === '/about') {
        this.isAboutPage = true;  // Establece isAboutPage en true
        this.isLoginPage = false;
        this.isRegisterPage = false;
        this.isstartPage = false;
      } else {
        this.isLoginPage = false;
        this.isRegisterPage = false;
        this.isstartPage = false;
        this.isAboutPage = false;
      }
    });
  }


  ngOnInit(): void {
    this.alertService.getAlerts().subscribe((alerts: Alerta[]) => {
      this.alerts = alerts.map(alert => ({
        timestamp: alert.timestamp,
        src: alert.ip_src,
        dest: alert.ip_dst,
        details: alert.description,
      }));
    });
  }
  

  title = 'alert';
}
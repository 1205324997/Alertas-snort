import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../app/alert.service';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Alerta } from '../app/alert.service'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    EstadisticasComponent,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, AfterViewInit {
  alertas: any[] = [];
  displayedColumns: string[] = ['timestamp', 'src', 'dest', 'details', 'prioridad'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  showAlertas: boolean = false;
  showEstadisticas: boolean = false;
  todasLasAlertas: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  mensajeExpandido: number | null = null;
  showMensaje: boolean = true; 
  isSidebarOpen: boolean = true;  

  prioridadFiltro: string = '';
  alertasPorPagina: number = 10;
  paginaActual: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  mostrarInicio(): void {
    this.showMensaje = true;
    this.showAlertas = false;
    this.showEstadisticas = false;
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  cargarAlertas(): void {
    this.alertService.getAlerts().subscribe((data: Alerta[]) => {
      const todas = data
        .map((alert, i) => ({
          timestamp: alert.timestamp,
          tipo: alert.alert,
          src: alert.ip_src,
          dest: alert.ip_dst,
          details: alert.description,
          prioridad: this.asignarPrioridad(alert, i),
        }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Ordena por fecha descendente
  
      this.todasLasAlertas = todas;
      this.dataSource.data = this.obtenerAlertasFiltradasYPaginadas();
    });
  }
  

  private obtenerAlertasFiltradasYPaginadas(): any[] {
    let filtradas = this.todasLasAlertas;

    if (this.prioridadFiltro) {
      filtradas = filtradas.filter(alerta =>
        alerta.prioridad.toLowerCase() === this.prioridadFiltro.toLowerCase()
      );
    }

    const inicio = this.paginaActual * this.alertasPorPagina;
    const fin = inicio + this.alertasPorPagina;
    return filtradas.slice(inicio, fin);
  }

  mostrarMasAlertas(): void {
    this.paginaActual++;
    this.dataSource.data = this.obtenerAlertasFiltradasYPaginadas();
  }

  toggleSection(section: string): void {
    this.showAlertas = section === 'alertas';
    this.showEstadisticas = section === 'estadisticas';
    this.showMensaje = false;
  }

  toggleMensaje(index: number): void {
    if (this.mensajeExpandido === index) {
      this.mensajeExpandido = null; // Si ya está expandido, lo contraemos
    } else {
      this.mensajeExpandido = index; // Expande el mensaje
    }
  }
  

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }


 paginaCambiada(event: any): void {
  const scrollY = window.scrollY;

  if (this.alertasPorPagina !== event.pageSize) {
    this.paginaActual = 0;
  } else {
    this.paginaActual = event.pageIndex;
  }

  this.alertasPorPagina = event.pageSize;
  this.dataSource.data = this.obtenerAlertasFiltradasYPaginadas();

  // Espera a que Angular actualice la vista antes de restaurar scroll
  setTimeout(() => {
    window.scrollTo({ top: scrollY });
  }, 50); // 50ms suele ser suficiente, puedes probar con más si aún se mueve
}

  

  get alertasFiltradas() {
    return this.dataSource.data;
  }

  generarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte Semanal de Alertas', 14, 20);

    const headers = ['Timestamp', 'IP Origen', 'IP Destino', 'Mensaje', 'Prioridad'];

    const data = this.todasLasAlertas
      .filter(alerta =>
        !this.prioridadFiltro || alerta.prioridad.toLowerCase() === this.prioridadFiltro.toLowerCase()
      )
      .map(alerta => [
        alerta.timestamp,
        alerta.src,
        alerta.dest,
        alerta.details,
        alerta.prioridad,
      ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      theme: 'grid',
    });

    doc.save('reporte_alertas_semanal.pdf');
  }

  cambiarFiltro(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.prioridadFiltro = selectElement.value;
    this.paginaActual = 0; 
    this.dataSource.data = this.obtenerAlertasFiltradasYPaginadas();
  }

  private asignarPrioridad(alerta: any, index: number): string {
    if (alerta.alert.toLowerCase().includes('ftp') || alerta.alert.toLowerCase().includes('sql')) {
      return 'Alta';
    } else if (index % 3 === 0) {
      return 'Baja';
    } else {
      return 'Media';
    }
  }
}
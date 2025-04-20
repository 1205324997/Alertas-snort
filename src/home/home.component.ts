import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, Alerta } from '../app/alert.service';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  showAlertas = false;
  showEstadisticas = false;
  todasLasAlertas: any[] = [];
  fechaInicio = '';
  fechaFin = '';
  mensajeExpandido: number | null = null;
  showMensaje = true;
  isSidebarOpen = true;

  prioridadFiltro = '';
  alertasPorPagina = 10;
  paginaActual = 0;

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
          details: this.traducirMensaje(alert.description),
          prioridad: this.asignarPrioridad(alert, i),
        }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
    this.mensajeExpandido = this.mensajeExpandido === index ? null : index;
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

    setTimeout(() => {
      window.scrollTo({ top: scrollY });
    }, 50);
  }

  get alertasFiltradas() {
    return this.dataSource.data;
  }

  generarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte Diario de Alertas', 14, 20);

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
    const mensaje = alerta.alert.toLowerCase();
    if (mensaje.includes('ftp') || mensaje.includes('sql')) {
      return 'Alta';
    } else if (index % 3 === 0) {
      return 'Baja';
    } else {
      return 'Media';
    }
  }

  // Traducción simple (puedes ampliar este diccionario según sea necesario)
  private traducirMensaje(mensaje: string): string {
    const traducciones: { [clave: string]: string } = {
      'TCP session without 3-way handshake': 'Sesión TCP sin el protocolo de tres pasos',
      'SQL Injection attempt': 'Intento de inyección SQL',
      'FTP login attempt': 'Intento de inicio de sesión FTP',
      'ICMP ping': 'Ping ICMP',
      'Malformed packet': 'Paquete mal formado',
    'NO CONTENT-LENGTH OR TRANSFER-ENCODING IN HTTP RESPONSE': 'No se encontró CONTENT-LENGTH o TRANSFER-ENCODING en la respuesta HTTP',
  };


    for (const clave in traducciones) {
      if (mensaje.includes(clave)) {
        return mensaje.replace(clave, traducciones[clave]);
      }
    }

    return mensaje; // Retorna el mensaje original si no hay traducción
  }
}

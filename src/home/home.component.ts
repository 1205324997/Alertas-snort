import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../app/alert.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ChartService } from './chart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, 
    MatTableModule,
    MatPaginator,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  
  alertas: { timestamp: string; tipo: string; src: string; dest: string; details: string; prioridad: string }[] = [];
  displayedColumns: string[] = ['timestamp', 'tipo', 'src', 'dest', 'details', 'prioridad'];
  showAlertas: boolean = false;
  prioridadFiltro: string = ''; 
  fechaFiltro: string = '';
  showEstadisticas: boolean = false;
  private chartInitialized: boolean = false;
  showMensaje: boolean = true; 


  get alertasFiltradas() {
    if (!this.prioridadFiltro) {
      return this.alertas; // Si no hay filtro, devolver todas las alertas
    }

    return this.alertas.filter(alerta => alerta.prioridad === this.prioridadFiltro);
  }

  
  constructor(private router: Router, private alertService: AlertService, public chartService: ChartService) {}

  // Función para manejar el cambio del filtro
  cambiarFiltro(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Aseguramos que event.target es un HTMLSelectElement
    this.prioridadFiltro = selectElement.value;  // Ahora es seguro acceder a 'value'
    this.cargarAlertas();  // Vuelve a cargar las alertas con el filtro
  }
  
  alertasPorPagina: number = 10;  // Número de alertas por página
  paginaActual: number = 0;  // Página actual para la paginación


  ngOnInit(): void {
    this.generarAlertasSimuladas(100);  // Generar 100 alertas aleatorias
    this.cargarAlertas();  // Cargar las primeras 10 alertas
     this.calcularPorcentajeAlertas();
     
    //this.generarEstadisticas();//
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showEstadisticas'] && changes['showEstadisticas'].currentValue === true) {
      if (this.chartCanvas && !this.chartInitialized) { // Verifica si chartCanvas está disponible
        this.generarEstadisticas();
        this.chartInitialized = true;
      }
    }
  }

  // Generar alertas aleatorias manteniendo los mensajes como están
 generarAlertasSimuladas(total: number): void {
  const alertasDetalles = [
    'Intento de conexión FTP sin cifrado',
    'Acceso SSH sospechoso detectado',
    'Acceso a base de datos (MySQL) detectado en el puerto 3306',
    'Posible intento de escaneo de red',
    'Posible intento de explotación de vulnerabilidad en HTTP',
  ];

  for (let i = 0; i < total; i++) {
    const tipoAlerta = `Tráfico ${['FTP', 'SSH', 'SQL', 'HTTP', 'Ping'][Math.floor(Math.random() * 5)]} no seguro`;
    
    // Alternando entre "Alta", "Media" y "Baja" correctamente
    let prioridad: string;
    if (i % 3 === 0) {
      prioridad = 'Baja'; // Cada tercer alerta es "Baja"
    } else if (i % 2 === 0) {
      prioridad = 'Alta'; // Alternancia entre Alta y Media
    } else {
      prioridad = 'Media';
    }

    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();  // Fecha aleatoria
    const src = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const dest = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const details = this.shuffleArray([...alertasDetalles])[i % alertasDetalles.length];  // Mezclar detalles y asignar

    this.alertasSimuladas.push({
      timestamp,
      tipo: tipoAlerta,
      src,
      dest,
      details,
      prioridad
    });
  }
}


  // Función para mezclar un array aleatoriamente (Fisher-Yates shuffle)
  shuffleArray(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Intercambiar elementos
    }
    return arr;
  }

  // Cargar alertas de la página actual
  cargarAlertas(): void {
    const inicio = this.paginaActual * this.alertasPorPagina;
    const fin = inicio + this.alertasPorPagina;
    this.alertas = this.alertasSimuladas.slice(inicio, fin);
  }

  ngAfterViewInit(): void {
    // Asignar chartCanvas al servicio *solo* una vez
    this.chartService.chartCanvas = this.chartCanvas;
    if (this.showEstadisticas && !this.chartInitialized) { // Si ya se deben mostrar las estadísticas
      this.generarEstadisticas(); // Llama a generarEstadisticas aquí
      this.chartInitialized = true;
    }
  }

  // Mostrar más alertas
  mostrarMasAlertas(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
  
    // Asigna la página actual según el índice de la página
    this.paginaActual = pageIndex;
  
    // Llama a cargarAlertas para cargar las alertas correspondientes a la página
    this.cargarAlertas();
  }

  toggleSection(section: string) {
    this.showMensaje = false; // Oculta el mensaje al cambiar de sección
    if (section === 'alertas') {
      this.showAlertas = !this.showAlertas;
      this.showEstadisticas = false;
    } else if (section === 'estadisticas') {
      this.showEstadisticas = !this.showEstadisticas;
      this.showAlertas = false;
    }
  }
  
  mostrarInicio(): void {
    this.showMensaje = true;
    this.showAlertas = false;
    this.showEstadisticas = false;
  }

  
  generarEstadisticas(): void {
    if (!this.chartService.chartCanvas) {
      console.error("chartCanvas no está inicializado en generarEstadisticas");
      return;
    }
    const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    console.log('Datos generados para las estadísticas:', newData);
    this.chartService.updateChartData(newData);
  }

actualizarDatos(): void {
  const nuevosDatos = [10, 20, 30, 40]; // Ejemplo de datos nuevos
  this.chartService.updateChartData(nuevosDatos);
}

calcularPorcentajeAlertas(): void {
  const totalAlertas = this.alertasSimuladas.length;
  const altas = this.alertasSimuladas.filter(alerta => alerta.prioridad === 'Alta').length;
  const medias = this.alertasSimuladas.filter(alerta => alerta.prioridad === 'Media').length;
  const bajas = this.alertasSimuladas.filter(alerta => alerta.prioridad === 'Baja').length;

  // Calculando porcentajes como números
  let porcentajeAltas = (altas / totalAlertas) * 100;
  let porcentajeMedias = (medias / totalAlertas) * 100;
  let porcentajeBajas = (bajas / totalAlertas) * 100;

  // Ajustar los porcentajes con los multiplicadores
  porcentajeAltas = parseFloat((porcentajeAltas * 0.8).toFixed(2)); // Aumento el valor
  porcentajeMedias = parseFloat((porcentajeMedias * 1).toFixed(2)); // Aumento ligeramente
  porcentajeBajas = parseFloat((porcentajeBajas * 1.5).toFixed(2)); // Disminuyo el valor

  // Recalcular para asegurarse de que el total sea 100%
  const totalModificado = porcentajeAltas + porcentajeMedias + porcentajeBajas;
  const ajuste = totalModificado > 100 ? totalModificado - 100 : 0;

  if (ajuste > 0) {
    // Restar el ajuste de los porcentajes que más superen el valor
    if (porcentajeAltas > porcentajeMedias && porcentajeAltas > porcentajeBajas) {
      porcentajeAltas -= ajuste;
    } else if (porcentajeMedias > porcentajeBajas) {
      porcentajeMedias -= ajuste;
    } else {
      porcentajeBajas -= ajuste;
    }
  }

  // Actualizar los datos de las estadísticas
  this.estadisticasSimuladas.push(
    { fecha: new Date().toISOString().split('T')[0], tipo: 'Alertas Alta (%)', valor: `${porcentajeAltas.toFixed(2)}%` },
    { fecha: new Date().toISOString().split('T')[0], tipo: 'Alertas Media (%)', valor: `${porcentajeMedias.toFixed(2)}%` },
    { fecha: new Date().toISOString().split('T')[0], tipo: 'Alertas Baja (%)', valor: `${porcentajeBajas.toFixed(2)}%` }
  );
}


  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  estadisticasSimuladas = [
    { fecha: '2024-07-26', tipo: 'Usuarios activos', valor: 1 },
    { fecha: '2024-07-26', tipo: 'Nuevos registros', valor: 0 },
    { fecha: '2024-07-26', tipo: 'Promedio de uso', valor: '2 horas' },
    // ... más datos
  ];

  // Arreglo con las alertas simuladas, manteniendo los mensajes como están
  alertasSimuladas = [
    {
      timestamp: '2025-02-01T08:30:00.000Z',
      tipo: 'Tráfico FTP no seguro',
      src: '192.168.1.1',
      dest: '192.168.2.2',
      details: 'Intento de conexión FTP sin cifrado',
      prioridad: 'Alta'
    },
    {
      timestamp: '2025-02-01T09:00:00.000Z',
      tipo: 'Tráfico SSH',
      src: '192.168.3.3',
      dest: '192.168.4.4',
      details: 'Acceso SSH sospechoso detectado',
      prioridad: 'Alta'
    },
    {
      timestamp: '2025-02-01T09:30:00.000Z',
      tipo: 'Tráfico SQL',
      src: '192.168.5.5',
      dest: '192.168.6.6',
      details: 'Acceso a base de datos (MySQL) detectado en el puerto 3306',
      prioridad: 'Alta'
    },
    {
      timestamp: '2025-02-01T10:00:00.000Z',
      tipo: 'Solicitud de Ping',
      src: '192.168.7.7',
      dest: '192.168.8.8',
      details: 'Posible intento de escaneo de red',
      prioridad: 'Media'
    },
    {
      timestamp: '2025-02-01T10:30:00.000Z',
      tipo: 'Tráfico HTTP sospechoso',
      src: '192.168.9.9',
      dest: '192.168.10.10',
      details: 'Posible intento de explotación de vulnerabilidad en HTTP',
      prioridad: 'Alta'
    }
  ];
  
}

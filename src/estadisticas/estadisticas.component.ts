import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  imports: [CommonModule],
})
export class EstadisticasComponent implements OnChanges, AfterViewInit {
  @Input() alertas: any[] = [];
  private chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alertas'] && !changes['alertas'].firstChange) {
      this.updateChart();
    }
  }

  ngAfterViewInit(): void {
    if (this.alertas.length > 0) {
      this.createChart();
    }
  }

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3'],
        datasets: [
          {
            label: 'Cantidad de Alertas',
            data: this.getPrioridadData(),
            backgroundColor: ['#ff5733', '#ffc300', '#28a745'],
            borderRadius: 10,
          },
        ],
      },
      options: {
        indexAxis: 'y', // barras verticales
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: {
                size: 14,
              },
            },
          },
          y: {
            ticks: {
              font: {
                size: 14,
              },
              callback: function (this: any, value: string | number, index: number) {
                return this.chart?.data?.labels?.[index] ?? '';
              }                                   
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Ocultamos leyenda
          },
          datalabels: {
            color: 'black',
            font: {
              size: 14,
              weight: 'bold',
            },
            anchor: (context: any) => {
              const value = context.dataset.data[context.dataIndex];
              return value === 0 ? 'end' : 'center';
            },
            align: (context: any) => {
              const value = context.dataset.data[context.dataIndex];
              return value === 0 ? 'end' : 'center';
            },
            offset: (context: any) => {
              const value = context.dataset.data[context.dataIndex];
              return value === 0 ? 8 : 0; // margen si es 0
            },
            formatter: (value: any, context: any) => {
              const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? (value / total) * 100 : 0;
              return `${percentage.toFixed(0)}%`;

            },
          },
          
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.getPrioridadData();
      this.chart.update();
    }
  }

  getPrioridadData(): number[] {
    let alta = 0;
    let media = 0;
    let baja = 0;

    this.alertas.forEach((alerta) => {
      if (alerta.prioridad === 'Alta') alta++;
      if (alerta.prioridad === 'Media') media++;
      if (alerta.prioridad === 'Baja') baja++;
    });

    return [alta, media, baja];
  }

  
  descargarGraficaPDF(): void {
    const container = document.getElementById('contenedorPDF') as HTMLElement;
    const descripcion = document.querySelector('.descripcion-alertas') as HTMLElement;
    const boton = document.querySelector('.btn-descargar') as HTMLElement;
  
    if (!container || !boton || !descripcion) return;
  
    // Preparar para PDF
    boton.classList.add('oculto-para-pdf');
    container.classList.add('preparar-para-pdf');
  
    setTimeout(() => {
      html2canvas(container, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
  
        const imgProps = pdf.getImageProperties(imgData);
        let pdfWidth = pageWidth - 30;
        let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        const x = (pageWidth - pdfWidth) / 2;
  
        // Título
        pdf.setFontSize(16);
        pdf.text('Gráfica de Estadísticas de Alertas', 14, 20);
  
        // Descripción
        const maxWidth = pageWidth - 40;
        const descripcionText = descripcion.textContent || '';
        const lines = pdf.splitTextToSize(descripcionText, maxWidth);
        pdf.setFontSize(12);
        pdf.text(lines, 14, 30);
  
        // Imagen del gráfico + leyenda
        pdf.addImage(imgData, 'PNG', x, 40, pdfWidth, pdfHeight);
        pdf.save('estadisticas_alertas.pdf');
  
        // Restaurar
        boton.classList.remove('oculto-para-pdf');
        container.classList.remove('preparar-para-pdf');
      });
    }, 100); // timeout pequeño para aplicar el estilo antes de capturar
  }
  
}
import { Injectable, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  public chartCanvas!: ElementRef;
  private chartData: number[] = [];

  constructor() {}

  createChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error('chartCanvas no está inicializado.');
      return;
    }
  
    d3.select(this.chartCanvas.nativeElement).selectAll('*').remove();
  
    const data = this.chartData;
    console.log('🎯 Datos para gráfico:', data); // Asegúrate de que los datos están siendo pasados correctamente
    const svg = d3.select(this.chartCanvas.nativeElement);
    const width = 400;
    const height = 200;
  
    svg.attr('width', width).attr('height', height);
  
    const x = d3.scaleBand().domain(data.map((d, i) => i.toString())).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, Math.max(...data)]).nice().range([height, 0]);
  
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(i.toString()) ?? 0)
      .attr('y', (d) => y(d))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d))
      .attr('fill', 'steelblue')
      .attr('stroke', 'black')  // Agregar borde a los rectángulos
      .attr('stroke-width', 1); // Establecer grosor de borde
  }
  
  

  updateChartData(newData: number[]): void {
    this.chartData = newData;
    this.createChart();
  }

  setDataForAlertas(alertas: any[]): void {
    const alertasPorPrioridad = {
      Alta: 0,
      Media: 0,
      Baja: 0,
    };

    alertas.forEach((alerta) => {
      if (alerta.prioridad === 'Alta') {
        alertasPorPrioridad.Alta++;
      } else if (alerta.prioridad === 'Media') {
        alertasPorPrioridad.Media++;
      } else if (alerta.prioridad === 'Baja') {
        alertasPorPrioridad.Baja++;
      }
    });

    const data = [
      alertasPorPrioridad.Alta,
      alertasPorPrioridad.Media,
      alertasPorPrioridad.Baja,
    ];

    this.updateChartData(data); // Actualiza los datos en el gráfico
  }
}

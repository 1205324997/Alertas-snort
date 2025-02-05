import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  // Método para generar alertas simuladas
  getAlerts(): Observable<{ timestamp: string; level: string; src: string; dest: string; details: string }[]> {
    const alerts = Array.from({ length: 100 }, (_, index) => {
      const levels = ['bajo', 'medio', 'alto'];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const timestamp = new Date(Date.now() - Math.random() * 10000000000).toISOString();
      const details = `Alerta #${index + 1} de nivel ${level}`;
      const src = `Fuente-${Math.ceil(Math.random() * 10)}`;
      const dest = `Destino-${Math.ceil(Math.random() * 10)}`;

      return { timestamp, level, src, dest, details };
    });

    return of(alerts); // Retornar las alertas como un observable
  }
}

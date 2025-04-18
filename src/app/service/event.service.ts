// src/app/core/services/event.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventService {
  // Aquí puedes añadir métodos que luego uses en tu SidebarComponent.
  // Por ejemplo, un método vacío:
  emit(eventName: string, data?: any): void { /* no hace nada */ }
}

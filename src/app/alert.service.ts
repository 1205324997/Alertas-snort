import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alerta {
  timestamp: string;
  alert: string;
  ip_src: string;
  ip_dst: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private apiUrl = 'http://127.0.0.1:8000/api/alerts'; // Tu API

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(this.apiUrl);
  }
}

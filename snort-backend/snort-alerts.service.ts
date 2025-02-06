import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnortAlertsService {
  private apiUrl = 'http://localhost:3000/alerts'; 

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}

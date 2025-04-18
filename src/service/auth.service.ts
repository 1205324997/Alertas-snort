import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/persons';

  constructor(private http: HttpClient) {}

  registerPerson(name: string, username: string, email: string, password: string): Observable<any> {
    const personData = { name, username, email, password };
    return this.http.post(this.apiUrl, personData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) return user;
        else throw new Error('Credenciales inválidas');
      })
    );
  }  
}
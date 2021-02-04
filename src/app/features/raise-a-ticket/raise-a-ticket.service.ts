import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from './../../core/api';

@Injectable({providedIn: 'root'})
export class RaiseTicketService {
  constructor(private _http: HttpClient) { }

  submitTicket(data): Observable<any> {
    return this._http.post(`${apiUrl}/tickets/save`, data)
        .pipe(map(res => res));
  }

  getTickets(): Observable<any> {
    return this._http.get(`${apiUrl}/tickets/load`)
        .pipe(map(res => res));
  }

  updateTicket(data): Observable<any> {
    return this._http.post(`${apiUrl}/tickets/edit`, data)
        .pipe(map(res => res));
  }

  deleteTicket(id): Observable<any> {
    return this._http.delete(`${apiUrl}/delete/${id}`)
        .pipe(map(res => res));
  }

}

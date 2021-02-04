import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../core/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  userAuth(formData): any {
    return this._http.post(`${apiUrl}/login` , formData);
  }

  resetPassword(email): Observable<any> {
    return this._http
      .post(`${apiUrl}/cred/resetpassword/`, { email })
      .pipe(map(res => res));
  }
}

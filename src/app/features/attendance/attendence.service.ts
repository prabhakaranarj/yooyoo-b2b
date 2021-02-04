import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from './../../core/api';
import { UtilService } from './../../shared/services/util.service';

@Injectable({
  providedIn: 'root'
})

export class AttendanceService {
  constructor(private _http: HttpClient, private _util: UtilService) {}

  submitAttendance(data): Observable<any> {
    return this._http.post(`${apiUrl}/attendance/save`, data)
            .pipe(map(res => res));
  }

  getAttendence(grade): Observable<any> {
   const schoolId = this._util.getSchoolId();
   return this._http.get(`${apiUrl}/attendance/load/${schoolId}/${grade}`)
      .pipe(map(res => res));
 }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from '../../core/api';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private httpClient: HttpClient) {}

  getReportBySchool(schoolId, from, to): Observable<any> {
    // const schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    return this.httpClient
      .get(`${apiUrl}/report/getReportBySchool/${schoolId}?fromDate=${from}&toDate=${to}`)
      .pipe(map(res => res));
  }
  getReportByStudent(studentId: any): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/report/getReportByStudent/${studentId}`)
      .pipe(map(res => res));
  }
  getfeereportbyschool(schoolId, from, to): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/report/getfeereportbyschool/${schoolId}?fromDate=${from}&toDate=${to}`)
      .pipe(map(res => res));
  }
  getassignmentreportbyschool(schoolId, from, to): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/report/getassignmentreportbyschool/${schoolId}?fromDate=${from}&toDate=${to}`)
      .pipe(map(res => res));
  }
  getattnreportbyschool(schoolId, from, to): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/report/getattnreportbyschool/${schoolId}?fromDate=${from}&toDate=${to}`)
      .pipe(map(res => res));
  }

// Date format: - dd - MMM - yy

}

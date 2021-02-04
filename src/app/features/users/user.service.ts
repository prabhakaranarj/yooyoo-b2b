import { users } from './user.data';
import { IUser } from './user';
import { apiUrl } from '../../core/api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getAllStudents(schoolId): Observable<any> {
    // const schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    return this.httpClient
      .get(`${apiUrl}/students/getAllStudents/${schoolId}`)
      .pipe(map(res => res));
  }

  getReportBySchool(schoolId): Observable<any> {
    // const schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    return this.httpClient
      .get(`${apiUrl}/report/getReportBySchool/${schoolId}`)
      .pipe(map(res => res));
  }
  getReportByStudent(studentId): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/report/getReportByStudent/${studentId}`)
      .pipe(map(res => res));
  }
  getAllCredManager(): Observable<any> {
    return this.httpClient.get(`${apiUrl}/cred/loadAll`)
    .pipe(map(res => res));
  }
  createCredManager(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/cred/save`, formData)
      .pipe(map(res => res));
  }
  updateCredManager(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/cred/update`, formData)
      .pipe(map(res => res));
  }
  uploadStudents(formData): Observable<any> {
    const schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    return this.httpClient
      .post(`${apiUrl}/students/uploadStudents/${schoolId}`, formData)
      .pipe(map(res => res));
  }
  addStudent(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/students/create`, formData)
      .pipe(map(res => res));
  }
  updateStudent(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/students/update`, formData)
      .pipe(map(res => res));
  }

  deleteStudent(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/students/delete/${id}?delete=true`)
      .pipe(map(res => res));
  }
}

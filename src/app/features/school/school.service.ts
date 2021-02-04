import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../core/api';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  constructor(private httpClient: HttpClient) { }

  getSchools(): Observable<any> {
    return this.httpClient.get(`${apiUrl}/schools/load`)
      .pipe(map(res => res));
  }
  updateSchool(schoolData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/schools/edit`, schoolData)
      .pipe(map(res => res));
  }
  addSchool(schoolData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/schools/save`, schoolData)
      .pipe(map(res => res));
  }
  deleteSchool(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/schools/delete/${id}?delete=true`)
      .pipe(map(res => res));
  }

  // returns all school for notification form
  getAllSchools(): Observable<any> {
    return this.httpClient.get(`${apiUrl}/schools/load`);
  }
  // return array of students based on the class
  getStudentsByClass(schoolId): Observable<any> {
    return this.httpClient.get(`${apiUrl}/students/getStudentsBySchool/${schoolId}`);
  }
}

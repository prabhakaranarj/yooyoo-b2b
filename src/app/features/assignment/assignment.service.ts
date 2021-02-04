import { apiUrl } from '../../core/api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  constructor(private httpClient: HttpClient) {}

  getAllAssignments(): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/assignment/getAllAssignments`)
      .pipe(map(res => res));
  }
  getAllSchoolAssignments(schoolId): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/assignment/getAssignmentsBySchool/${schoolId}`)
      .pipe(map(res => res));
  }
  getTopicsBySubject(subjectId): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/assignment/getTopicsBySubject/${subjectId}`)
      .pipe(map(res => res));
  }

  saveAssignment(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/assignment/save`, formData)
      .pipe(map(res => res));
  }
  editAssignment(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/assignment/save`, formData)
      .pipe(map(res => res));
  }

  deleteAssignment(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/assignment/delete/${id}`)
      .pipe(map(res => res));
  }
}

import { apiUrl } from '../../core/api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  constructor(private httpClient: HttpClient) {}

  getAllTopics(): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/curriculum/getAllTopics`)
      .pipe(map(res => res));
  }
  getAllCategories(): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/curriculum/getCategories`)
      .pipe(map(res => res));
  }
  updateCategories(formData): Observable<any> {
    return this.httpClient
      .put(`${apiUrl}/curriculum/update-category`, formData)
      .pipe(map(res => res));
  }
  createCategories(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/curriculum/create-category`, formData)
      .pipe(map(res => res));
  }
  getAllSubjects(): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/curriculum/getSubjects`)
      .pipe(map(res => res));
  }
  getAllQuizs(): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/quiz/getAllQuizs`)
      .pipe(map(res => res));
  }
  getOneQuizs(id): Observable<any> {
    return this.httpClient
      .get(`${apiUrl}/quiz/getAllQuizs?topicId=${id}`)
      .pipe(map(res => res));
  }
  updateSubjects(formData): Observable<any> {
    return this.httpClient
      .put(`${apiUrl}/curriculum/update-subject`, formData)
      .pipe(map(res => res));
  }
  createSubjects(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/curriculum/create-subject`, formData)
      .pipe(map(res => res));
  }
  createTopic(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/curriculum/create-topic`, formData)
      .pipe(map(res => res));
  }
  updateTopic(formData): Observable<any> {
    return this.httpClient
      .put(`${apiUrl}/curriculum/update-topic`, formData)
      .pipe(map(res => res));
  }
  uploadMedia(questionId, formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/media/questions/upload/${questionId}`, formData)
      .pipe(map(res => res));
  }
  uploadSubjectMedia(subjectId, formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/media/subject/upload/${subjectId}`, formData)
      .pipe(map(res => res));
  }
  uploadVideoMedia(topicId, formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/curriculum/updatevideo/${topicId}`, formData)
      .pipe(map(res => res));
  }
  updateworksheet(topicId, formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/curriculum/updateworksheet/${topicId}`, formData)
      .pipe(map(res => res));
  }
  createQuiz(formData): Observable<any> {
    return this.httpClient
      .post(`${apiUrl}/quiz/save`, formData)
      .pipe(map(res => res));
  }
  deleteQuiz(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/quiz/delete/${id}`)
      .pipe(map(res => res));
  }
  deleteTopic(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/curriculum/delete/${id}`)
      .pipe(map(res => res));
  }

  deleteSubjects(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/curriculum/delete-subject/${id}`)
      .pipe(map(res => res));
  }

  deleteCategories(id): Observable<any> {
    return this.httpClient
      .delete(`${apiUrl}/curriculum/delete-categories/${id}`)
      .pipe(map(res => res));
  }
}

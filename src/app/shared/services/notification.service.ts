import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { apiUrl } from '../../core/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private _http: HttpClient) {}

  saveNotification(formData): any {
    return this._http.post(`${apiUrl}/notifications/save` , formData);
  }

  getAllNotification(): any {
    return this._http.get(`${apiUrl}/notifications/getAllNotifications`);
  }
  getSchoolNotification(): any {
    const schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    return this._http.get(`${apiUrl}/notifications/getNotificationsBySchool/${schoolId}`);
  }
  deleteNotification(id): any {
    return this._http
      .delete(`${apiUrl}/notifications/delete/${id}?delete=true`)
      .pipe(map(res => res));
  }
}

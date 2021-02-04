import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  getToken(): any {
    return localStorage.getItem('token');
  }

  removeToken(): any {
    return localStorage.removeItem('token');
  }

  getUserRole(): any {
    return localStorage.getItem('urole');
  }

  removeUserRole(): any {
    return localStorage.removeItem('urole');
  }

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  removeUserInfo(): any {
    return localStorage.removeItem('userInfo');
  }

  getSchoolId(): any {
    return JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
  }

  getFormattedDate(): any {
    const now = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return `${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear()}`;
  }
  getFormattedDate1(data): any {
    const now = new Date(data);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return `${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear()}`;
  }
  getFormattedMonth(data): any {
    const now = new Date(data);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return `${months[now.getMonth()]}-${now.getFullYear()}`;
  }
  getFormattedDate2(data): any {
    const now = new Date(data);
    const day = now.getDate();
    const dayofMonth = day < 10 ? `0${day}` : `${day}`;

    const monthNum = now.getMonth() + 1;
    const month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;

    return `${dayofMonth}-${month}-${now.getFullYear()}`;
  }
  getLastThreeYearsDate(): any {
    const now = new Date();
    return `${now.getMonth() + 6}/${now.getDate()}/${now.getFullYear() - 3}`;
  }
  compareDates(date): any {
    // date - 'yyyy-mm-dd'
    const now = new Date();
    const day = now.getDate();
    const dayofMonth = day < 10 ? `0${day}` : `${day}`;
    const monthNum = now.getMonth() + 1;
    const month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    const formattedDate = `${now.getFullYear()}-${month}-${dayofMonth}`;
    if (date === formattedDate) {
      return true;
    } else {
      return false;
    }
  }
  weekCompareDates(_date): any {
    const now = new Date(_date);
    const day = now.getDate();
    const dayofMonth = day < 10 ? `0${day}` : `${day}`;
    const monthNum = now.getMonth() + 1;
    const month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    return `${now.getFullYear()}-${month}-${dayofMonth}`;
  }
}

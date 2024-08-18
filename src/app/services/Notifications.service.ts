import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }
  GetNotification() {
    let url = `${environment.URL}/User/allNotifications`;
    return this.http.get(url, this.httpOptions);
  }

  MarkAsRead(id: number) {
    let url = `${environment.URL}/User/MarkAsRead/${id}`;
    return this.http.post(url, this.httpOptions);
  }


  MarkAsUnRead(id: number) {
    let url = `${environment.URL}/User/MarkAsUnRead/${id}`;
    return this.http.post(url, this.httpOptions);
  }
  GetAllNode() {
    let url = `${environment.URL}/Node/all`;
    return this.http.get(url, this.httpOptions);
  }
  
  getNotificationCount(): Observable<number> {
    const url = `${environment.URL}/User/NotificationsCount`;
    return this.http.get<number>(url, this.httpOptions);
  }

}

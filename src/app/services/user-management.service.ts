import { UserModel } from './../models/UserModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  GetUserList(page: number, search: string) {
    let url = '';
    if (search) {
      url = `${environment.URL}/User/All`;
    } else {
      url = `${environment.URL}/User/All`;
    }
    return this.http.get(url, this.httpOptions);
  }

  registerUser(model: UserModel) {
    let url = `${environment.URL}/User/add`;
    return this.http.post(url, model, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    const url = `${environment.URL}/User/delete/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  Update(model: UserModel) {
    let url = `${environment.URL}/User/edit`;
    return this.http.put(url, model, this.httpOptions);
  }
  getUserById(id: number): Observable<any> {
    let url = `${environment.URL}/User/${id}`;
    return this.http.get(url, this.httpOptions);
  }
  resetPassword(userId: number, newPassword: string): Observable<any> {
    const payload = { userId, newPassword };
    return this.http.post(`${environment.URL}/User/resetPassword`, payload);
  }
  getCurrentUser() {
    return this.http.get(`${environment.URL}/User/current`, this.httpOptions);
  }
  blockUser(userId: number): Observable<any> {
    const payload = { userId};
    return this.http.post(`${environment.URL}/User/Block/${userId}`, payload);
  }
  
  unblockUser(userId: number): Observable<any> {
    const payload = { userId};
    return this.http.post(`${environment.URL}/User/unBlock/${userId}`, payload);
  }
  
}

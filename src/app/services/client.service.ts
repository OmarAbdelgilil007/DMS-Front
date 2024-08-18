import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Iclient } from '../models/Iclient';
import { Observable } from 'rxjs';
import { UserModel } from '../models/UserModel';
import { IAddClient } from '../models/IAddClient';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  GetNode() {
    let url = `${environment.URL}/Node/GetClientNodes`;
    return this.http.get(url, this.httpOptions);
  }

  AddNode(model: any) {
    let url = `${environment.URL}/Node/Add`;
    return this.http.post(url, model, this.httpOptions);
  }

  getUsersByRole(roleId: number): Observable<UserModel[]> {
    const url = `${environment.URL}/User/login`;
    return this.http.get<UserModel[]>(url, this.httpOptions);
  }
  GetNodeById(id: number): Observable<any> {
    let url = `${environment.URL}/Node/${id}`;
    return this.http.get(url, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    const url = `${environment.URL}/Node/delete/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  Update(model: Iclient) {
    let url = `${environment.URL}/node/edit`;
    return this.http.put(url, model, this.httpOptions);
  }
  getClientByRole() {
    let url = `${environment.URL}/Node/GetClientByCurrentUser`;
    return this.http.get(url, this.httpOptions);
  }
}

import { RoleModel } from './../models/RoleModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  GetRoles() {
    let url = `${environment.URL}/role/all`;
    return this.http.get(url, this.httpOptions);
  }
 
  AddRole(model: RoleModel) {
    let url = `${environment.URL}/Role`;
    return this.http.post(url, model, this.httpOptions);
  }
  Update(model: RoleModel) {
    let url = `${environment.URL}/Role/edit`;
    return this.http.post(url, model, this.httpOptions);
  }
  public getbyid(id: number): Observable<any> {
    let url = `${environment.URL}/Role/${id}`;
    return this.http.get(url, this.httpOptions);
  }
  public delete(id: number  ): Observable<any> {
    let url = `${environment.URL}/Role/${id}/delete`;
    return this.http.post(url, id, this.httpOptions);
  }

}

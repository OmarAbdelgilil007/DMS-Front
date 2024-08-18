import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { DepartmentModel } from '../models/DepartmentModel';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  GetDepartments() {
    let url = `${environment.URL}/department/all`;
    return this.http.get(url, this.httpOptions);
  }
  AddDepartments(model: DepartmentModel): Observable<DepartmentModel> {
    let url = `${environment.URL}/Department/Add`;
    return this.http.post<DepartmentModel>(url, model, this.httpOptions);
  }
  Update(model: DepartmentModel) {
    let url = `${environment.URL}/Department/edit`;
    return this.http.put(url, model, this.httpOptions);
  }
  public getbyid(id: number): Observable<any> {
    let url = `${environment.URL}/department/${id}`;
    return this.http.get(url, this.httpOptions);
  }
  delete( id: number): Observable<any> {
    const url = `${environment.URL}/Department/delete/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
}

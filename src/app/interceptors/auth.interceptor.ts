import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private service: AuthService, private router: Router, private spinner: NgxSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();

    let token = this.service.getUserToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: token }
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide(); // Hide spinner on response
          }
        },
        (err: any) => {
          this.spinner.hide(); 
          if (err instanceof HttpErrorResponse) {
            if (err.status === HttpStatusCode.Unauthorized) {
              this.router.navigate(['/login']);
            }
            else if (err.status === HttpStatusCode.BadRequest) {
            }
          }
        }
      )
    );
  }
}
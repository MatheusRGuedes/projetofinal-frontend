import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private securityService: SecurityService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.securityService.token;
    console.log('Token: ', token);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return this.handleLogging(next, request);
    }
    return next.handle(request);
  }

  private handleLogging(
    next: HttpHandler,
    request: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    let status: number;
    return next.handle(request).pipe(
      tap({
        // Succeeds when there is a response; ignore other events
        next: (event) =>
          (ok = event instanceof HttpResponse ? 'succeeded' : ''),
        // Operation failed; error is an HttpErrorResponse
        error: (error) => {
          //console.log(error);
          ok = 'failed';
          status = error.status;
        },
      }),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${request.method} "${request.urlWithParams}"
              ${ok} in ${elapsed} ms.`;
        //console.log(msg);
        if (status === 403) this.securityService.deslogar();
      })
    );
  }
}

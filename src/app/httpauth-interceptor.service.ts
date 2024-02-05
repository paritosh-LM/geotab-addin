import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LmApiService } from './lm-api.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPAuthInterceptorService implements HttpInterceptor {
  private lmAccessTokenValue = '';

  constructor(private lmApi: LmApiService) {
    this.lmApi.lmAccessToken.subscribe(
      (value) => (this.lmAccessTokenValue = value)
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const request = req.clone({
      headers: req.headers.set('x-access-token', this.lmAccessTokenValue),
    });

    return next.handle(request);
  }
}

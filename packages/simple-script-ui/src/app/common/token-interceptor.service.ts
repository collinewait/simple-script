import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptorService {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    const auth = this.injector.get(AuthService);
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });
    return next.handle(tokenizedReq);
  }
}

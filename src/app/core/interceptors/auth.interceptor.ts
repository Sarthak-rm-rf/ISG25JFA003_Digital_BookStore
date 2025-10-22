import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Get the auth token from localStorage.
  // Make sure you save the token here after the user logs in.
  const authToken = localStorage.getItem('token');

  // If a token exists, clone the request and add the Authorization header.
  if (authToken) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(clonedReq);
  }

  // If no token, pass the original request along.
  return next(req);
};

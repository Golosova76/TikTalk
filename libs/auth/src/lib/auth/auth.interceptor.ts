import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

import { BASE_API_URL } from '@tt/shared';
import { isTokenExpiringSoon } from './auth-token.utils';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isAuthRequest(req)) return next(req);

  if (!isApiRequest(req)) return next(req);

  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    const refreshToken = authService.getRefreshToken();

    if (refreshToken) return refreshAndProceed(authService, req, next);

    return next(req);
  }

  if (isTokenExpiringSoon(accessToken)) {
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) return logoutAndFail(authService, new Error('Refresh token is missing'));

    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, accessToken)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isAuthError(error)) return throwError(() => error);

      const refreshToken = authService.getRefreshToken();

      if (!refreshToken) return logoutAndFail(authService, error);

      return refreshAndProceed(authService, req, next);
    })
  );
};

const refreshAndProceed = (authService: AuthService, req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return authService.refreshAuthToken().pipe(
    catchError((error: unknown) => {
      return logoutAndFail(authService, error);
    }),
    switchMap((res) => {
      return next(addToken(req, res.access_token));
    })
  );
};

const logoutAndFail = (authService: AuthService, error: unknown) => {
  authService.logout();
  return throwError(() => error);
};

const addToken = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
};

const isApiRequest = (req: HttpRequest<unknown>): boolean => {
  return req.url.startsWith(BASE_API_URL);
};

const isAuthRequest = (req: HttpRequest<unknown>): boolean => {
  return req.url.startsWith(`${BASE_API_URL}auth/token`) || req.url.startsWith(`${BASE_API_URL}auth/refresh`);
};

const isAuthError = (error: HttpErrorResponse): boolean => {
  return error.status === 401 || error.status === 403;
};

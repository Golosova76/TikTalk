import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { BASE_API_URL } from '@tt/shared';
import { isTokenExpiringSoon } from './auth-token.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private refreshTokenRequest$: Observable<TokenResponse> | null = null;

  baseApiUrl = `${BASE_API_URL}auth/`;

  token: string | null = null;
  refreshToken: string | null = null;

  getAccessToken(): string | null {
    if (!this.token) {
      this.token = this.cookieService.get('token') || null;
    }
    return this.token;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = this.cookieService.get('refreshToken') || null;
    }
    return this.refreshToken;
  }

  get isAuth() {
    return !!this.getAccessToken();
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, fd).pipe(tap((value) => this.saveTokens(value)));
  }

  refreshAuthToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token is missing'));
    }

    if (!this.refreshTokenRequest$) {
      this.refreshTokenRequest$ = this.http
        .post<TokenResponse>(`${this.baseApiUrl}refresh`, { refresh_token: refreshToken })
        .pipe(
          tap((value) => this.saveTokens(value)),
          finalize(() => {
            this.refreshTokenRequest$ = null;
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }

    return this.refreshTokenRequest$;
  }

  getValidAccessToken(): Observable<string> {
    const accessToken = this.getAccessToken();

    if (accessToken && !isTokenExpiringSoon(accessToken)) {
      return of(accessToken);
    }

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token is missing'));
    }

    return this.refreshAuthToken().pipe(
      map((res) => res.access_token),
      catchError((error: unknown) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('refreshToken', '/');
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']).then();
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token, { path: '/', sameSite: 'Lax' });
    this.cookieService.set('refreshToken', this.refreshToken, { path: '/', sameSite: 'Lax' });
  }
}

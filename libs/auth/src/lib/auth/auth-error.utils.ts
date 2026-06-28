import { HttpErrorResponse } from '@angular/common/http';

export function isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse;
}

export function isRefreshTokenInvalidError(error: unknown): boolean {
  return isHttpErrorResponse(error) && (error.status === 401 || error.status === 403);
}

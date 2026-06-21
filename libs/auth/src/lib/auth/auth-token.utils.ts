export const TOKEN_REFRESH_THRESHOLD_MS = 60_000;

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payloadBase64 = token.split('.')[1];

    if (!payloadBase64) {
      return null;
    }

    const normalizedPayload = payloadBase64
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const payloadJson = atob(normalizedPayload);
    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (!payload.exp) {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, thresholdMs = TOKEN_REFRESH_THRESHOLD_MS): boolean => {
  const expirationTime = getTokenExpirationTime(token);

  if (!expirationTime) return true;

  return expirationTime - Date.now() <= thresholdMs;
};

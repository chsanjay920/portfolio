import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;

  const apiError = err.error?.error;
  if (apiError && typeof apiError.message === 'string') {
    const details = apiError.details;
    if (details?.fieldErrors) {
      const fieldMessages = Object.entries(details.fieldErrors as Record<string, string[]>)
        .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`));
      if (fieldMessages.length) return `${apiError.message} (${fieldMessages.join('; ')})`;
    }
    return apiError.message;
  }

  if (err.status === 401) return 'Session expired or not authorized. Please log in again.';
  if (err.status === 0) return 'Cannot reach the API. Make sure the backend is running on port 4000.';

  return fallback;
}

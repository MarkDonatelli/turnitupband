const CODES = new Set([
  'MISSING_ENVIRONMENT', 'INVALID_CREDENTIAL_FORMAT', 'AUTHENTICATION_FAILED',
  'CALENDAR_PERMISSION_DENIED', 'CALENDAR_NOT_FOUND_OR_INACCESSIBLE',
  'CALENDAR_API_DISABLED', 'GOOGLE_RATE_LIMITED', 'GOOGLE_API_FAILURE',
  'NETWORK_FAILURE', 'REQUEST_TIMEOUT', 'INVALID_CALENDAR_RESPONSE', 'RUNTIME_FAILURE'
]);
const STAGES = new Set(['configuration', 'credentials', 'authentication', 'calendar_request', 'calendar_response', 'runtime']);
const VARIABLES = ['GOOGLE_CALENDAR_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
const REASONS = new Set([
  'invalid_grant', 'invalid_client', 'unauthorized_client', 'access_denied',
  'invalid_private_key', 'invalid_service_account_email', 'missing_access_token',
  'forbidden', 'insufficientPermissions', 'accessNotConfigured', 'serviceDisabled',
  'SERVICE_DISABLED', 'ACCESS_TOKEN_SCOPE_INSUFFICIENT', 'notFound', 'authError',
  'rateLimitExceeded', 'userRateLimitExceeded', 'quotaExceeded', 'dailyLimitExceeded',
  'backendError', 'badRequest', 'invalidParameter'
]);

export class CalendarFailure extends Error {
  constructor(code, stage, details = {}) {
    super(CODES.has(code) ? code : 'RUNTIME_FAILURE');
    this.code = this.message;
    this.stage = STAGES.has(stage) ? stage : 'runtime';
    this.details = details;
  }
}

// Only known constants and numeric status codes may cross the logging boundary.
// Never log an Error, stack, response body, URL, headers, config, or credential.
export function safeCalendarDiagnostic(error) {
  if (!(error instanceof CalendarFailure)) return { code: 'RUNTIME_FAILURE', stage: 'runtime' };
  const diagnostic = {
    code: CODES.has(error.code) ? error.code : 'RUNTIME_FAILURE',
    stage: STAGES.has(error.stage) ? error.stage : 'runtime'
  };
  const { status, reason, missingVariables } = error.details;
  if (Number.isInteger(status) && status >= 100 && status <= 599) diagnostic.upstreamStatus = status;
  if (REASONS.has(reason)) diagnostic.reason = reason;
  if (Array.isArray(missingVariables)) {
    diagnostic.missingVariables = VARIABLES.filter(name => missingVariables.includes(name));
  }
  return diagnostic;
}

export function googleFailure(stage, { status, data, name, networkCode } = {}) {
  const candidates = [
    typeof data?.error === 'string' ? data.error : undefined,
    ...(Array.isArray(data?.error?.errors) ? data.error.errors.map(item => item?.reason) : []),
    ...(Array.isArray(data?.error?.details) ? data.error.details.map(item => item?.reason) : [])
  ];
  const reason = candidates.find(candidate => REASONS.has(candidate));
  const details = { status, reason };
  if (name === 'TimeoutError' || name === 'AbortError' || ['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT'].includes(networkCode)) return new CalendarFailure('REQUEST_TIMEOUT', stage, details);
  if (['ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ENETUNREACH'].includes(networkCode)) return new CalendarFailure('NETWORK_FAILURE', stage, details);
  if (stage === 'authentication') return new CalendarFailure('AUTHENTICATION_FAILED', stage, details);
  if (['accessNotConfigured', 'serviceDisabled', 'SERVICE_DISABLED'].includes(reason)) return new CalendarFailure('CALENDAR_API_DISABLED', stage, details);
  if (status === 429 || ['rateLimitExceeded', 'userRateLimitExceeded', 'quotaExceeded', 'dailyLimitExceeded'].includes(reason)) return new CalendarFailure('GOOGLE_RATE_LIMITED', stage, details);
  if (status === 401) return new CalendarFailure('AUTHENTICATION_FAILED', stage, details);
  if (status === 403) return new CalendarFailure('CALENDAR_PERMISSION_DENIED', stage, details);
  // Google may hide a calendar the account cannot access behind a 404.
  if (status === 404) return new CalendarFailure('CALENDAR_NOT_FOUND_OR_INACCESSIBLE', stage, details);
  return new CalendarFailure(status ? 'GOOGLE_API_FAILURE' : 'NETWORK_FAILURE', stage, details);
}

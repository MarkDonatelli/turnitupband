// Booking inquiry rules, shared by the form (components/ContactForm.vue) and
// any server-side check, so the browser and the server can never disagree.
// Pure functions only: no DOM, no Vue, no Node APIs.

export const EVENT_TYPES = ['Wedding', 'Corporate', 'Private party', 'Bar / venue', 'Something else'];

export const LIMITS = { venue: 200, nameMin: 2, name: 100, email: 254, phone: 30, messageMin: 10, message: 2000 };

export const MESSAGES = {
  eventType: 'Please select an event type.',
  dateInvalid: 'Please enter a valid date.',
  datePast: 'Please choose today or a future date.',
  venueBlank: 'Please enter a venue or town, or leave this field blank.',
  venueLong: 'Please keep the location under 200 characters.',
  nameEmpty: 'Please enter your name.',
  nameShort: 'Please enter at least 2 characters.',
  nameLong: 'Your name must be 100 characters or fewer.',
  emailEmpty: 'Please enter your email address.',
  emailInvalid: 'Please enter a valid email address.',
  emailLong: 'Your email address is too long.',
  phoneInvalid: 'Please enter a valid phone number or leave this field blank.',
  messageEmpty: 'Please tell us a little about your event.',
  messageShort: 'Please enter at least 10 characters.',
  messageLong: 'Please keep your message under 2,000 characters.'
};

// Fields in page order: a failed submit focuses the first one with an error.
export const FIELD_ORDER = ['eventType', 'date', 'venue', 'name', 'email', 'phone', 'message'];

const str = v => (typeof v === 'string' ? v : '');
// Count characters as people see them (an emoji is one), not UTF-16 units.
const chars = s => [...s].length;
const visibleChars = s => chars(s.replace(/\s/g, ''));

// Today as YYYY-MM-DD in local time (what a date input produces).
export function isoToday(now = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

// A real calendar date in YYYY-MM-DD form (rejects 2026-02-30).
export function isIsoDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

// Permissive on purpose: something@domain.tld with no spaces. Mailbox rules
// are too varied for a strict pattern; the reply email is the real test.
export function isEmail(v) {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v);
}

// Domestic or international: digits with spaces, dots, dashes, brackets and
// an optional leading +. 7 to 15 digits (E.164 allows up to 15).
export function isPhone(v) {
  if (!/^\+?[\d\s().-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

// Trimmed copies of every field, with anything that isn't a string treated as blank.
export function normalizeBooking(data = {}) {
  return {
    eventType: str(data.eventType).trim(),
    date: str(data.date).trim(),
    venue: str(data.venue).trim(),
    name: str(data.name).trim(),
    email: str(data.email).trim(),
    phone: str(data.phone).trim(),
    message: str(data.message).trim()
  };
}

// One field's error message, or '' when it's fine.
// `raw` is the untrimmed input (needed to spot a whitespace-only venue).
// `dateIncomplete`: the browser reports a half-typed date as empty, so the
// form passes this flag in; the server never needs it.
export function fieldError(name, raw = {}, { today = isoToday(), dateIncomplete = false } = {}) {
  const v = normalizeBooking(raw);
  switch (name) {
    case 'eventType':
      return EVENT_TYPES.includes(v.eventType) ? '' : MESSAGES.eventType;
    case 'date':
      if (dateIncomplete) return MESSAGES.dateInvalid;
      if (!v.date) return '';
      if (!isIsoDate(v.date)) return MESSAGES.dateInvalid;
      return v.date < today ? MESSAGES.datePast : '';
    case 'venue':
      if (!str(raw.venue)) return '';
      if (!v.venue) return MESSAGES.venueBlank;
      return chars(v.venue) > LIMITS.venue ? MESSAGES.venueLong : '';
    case 'name':
      if (!v.name) return MESSAGES.nameEmpty;
      if (chars(v.name) < LIMITS.nameMin) return MESSAGES.nameShort;
      return chars(v.name) > LIMITS.name ? MESSAGES.nameLong : '';
    case 'email':
      if (!v.email) return MESSAGES.emailEmpty;
      if (v.email.length > LIMITS.email) return MESSAGES.emailLong;
      return isEmail(v.email) ? '' : MESSAGES.emailInvalid;
    case 'phone':
      if (!v.phone) return '';
      return chars(v.phone) <= LIMITS.phone && isPhone(v.phone) ? '' : MESSAGES.phoneInvalid;
    // Required: every inquiry needs a few words about the event.
    case 'message':
      if (!v.message) return MESSAGES.messageEmpty;
      if (visibleChars(v.message) < LIMITS.messageMin) return MESSAGES.messageShort;
      return chars(v.message) > LIMITS.message ? MESSAGES.messageLong : '';
    default:
      return '';
  }
}

// Everything at once: { valid, errors: { field: message } }.
export function validateBooking(raw = {}, opts = {}) {
  const errors = {};
  for (const name of FIELD_ORDER) {
    const e = fieldError(name, raw, opts);
    if (e) errors[name] = e;
  }
  return { valid: !Object.keys(errors).length, errors };
}

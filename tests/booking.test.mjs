import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_TYPES, MESSAGES, fieldError, isIsoDate, normalizeBooking, validateBooking } from '../utils/booking.mjs';

const today = '2026-11-19';
const opts = { today };
const base = { eventType: 'Wedding', name: 'Jo Smith', email: 'jo@example.com', message: 'Wedding for about 120 guests' };
const err = (name, data, o = opts) => fieldError(name, { ...base, ...data }, o);

test('event type must be one of the five options', () => {
  for (const t of EVENT_TYPES) assert.equal(err('eventType', { eventType: t }), '');
  for (const t of ['', 'wedding', 'Funeral', '<script>', null, 42]) assert.equal(err('eventType', { eventType: t }), MESSAGES.eventType);
});

test('date: optional, a real calendar date, today or later', () => {
  assert.equal(err('date', { date: '' }), '');
  assert.equal(err('date', { date: today }), '');
  assert.equal(err('date', { date: '2027-06-07' }), '');
  assert.equal(err('date', { date: '2026-11-18' }), MESSAGES.datePast);
  assert.equal(err('date', { date: '2027-02-30' }), MESSAGES.dateInvalid);
  assert.equal(err('date', { date: 'next June' }), MESSAGES.dateInvalid);
  assert.equal(err('date', { date: '' }, { today, dateIncomplete: true }), MESSAGES.dateInvalid);
  assert.equal(isIsoDate('2028-02-29'), true);
  assert.equal(isIsoDate('2027-02-29'), false);
});

test('venue: optional, not whitespace only, 200 characters max', () => {
  assert.equal(err('venue', { venue: '' }), '');
  assert.equal(err('venue', { venue: '   ' }), MESSAGES.venueBlank);
  assert.equal(err('venue', { venue: ' The Sinclair ' }), '');
  assert.equal(err('venue', { venue: 'Not sure yet' }), '');
  assert.equal(err('venue', { venue: 'x'.repeat(200) }), '');
  assert.equal(err('venue', { venue: 'x'.repeat(201) }), MESSAGES.venueLong);
});

test('name: required, 2 to 100 characters after trimming, any script', () => {
  assert.equal(err('name', { name: '' }), MESSAGES.nameEmpty);
  assert.equal(err('name', { name: '   ' }), MESSAGES.nameEmpty);
  assert.equal(err('name', { name: ' J ' }), MESSAGES.nameShort);
  assert.equal(err('name', { name: 'x'.repeat(101) }), MESSAGES.nameLong);
  for (const n of ['Jo', 'Zoë O’Brien-Nguyễn', '李小龍', 'José María', 'Dr. A. J. Smith Jr.']) assert.equal(err('name', { name: n }), '', n);
});

test('email: required, reasonable format, 254 characters max', () => {
  assert.equal(err('email', { email: '' }), MESSAGES.emailEmpty);
  for (const e of ['jo@', 'jo@example', 'jo example@x.com', '@example.com', 'jo@@example.com']) assert.equal(err('email', { email: e }), MESSAGES.emailInvalid, e);
  for (const e of ['jo@example.com', ' jo.smith+band@example.co.uk ', 'o’neil@example.ie']) assert.equal(err('email', { email: e }), '', e);
  assert.equal(err('email', { email: `${'a'.repeat(250)}@x.co` }), MESSAGES.emailLong);
});

test('phone: optional, domestic and international formats', () => {
  assert.equal(err('phone', { phone: '' }), '');
  for (const p of ['617-555-0123', '(617) 555-0123', '+44 20 7946 0958', '+353 1 234 5678', '555 0199', '617.555.0123']) assert.equal(err('phone', { phone: p }), '', p);
  for (const p of ['617-555-012a', '12345', '1234567890123456', 'call me', '++1 617 555 0123']) assert.equal(err('phone', { phone: p }), MESSAGES.phoneInvalid, p);
});

test('message: required, 10+ visible characters, 2,000 max, emoji and punctuation fine', () => {
  assert.equal(err('message', { message: '' }), MESSAGES.messageEmpty);
  assert.equal(err('message', { message: '   ' }), MESSAGES.messageEmpty);
  assert.equal(err('message', { message: 'Hi there' }), MESSAGES.messageShort);
  assert.equal(err('message', { message: 'h i t h e r e' }), MESSAGES.messageShort, 'spaces do not count');
  assert.equal(err('message', { message: 'Party for 80! 🎉🎸' }), '');
  assert.equal(err('message', { message: '🎉'.repeat(2000) }), '', 'an emoji counts as one character');
  assert.equal(err('message', { message: 'x'.repeat(2001) }), MESSAGES.messageLong);
});

test('validateBooking: name, email and a message are the minimum', () => {
  assert.deepEqual(validateBooking(base, opts), { valid: true, errors: {} });
  const r = validateBooking({ ...base, message: '' }, opts);
  assert.equal(r.valid, false);
  assert.deepEqual(r.errors, { message: MESSAGES.messageEmpty });
});

test('validateBooking: a short message is rejected even with a date and venue', () => {
  const r = validateBooking({ ...base, date: '2027-06-07', venue: 'Boston', message: 'hi' }, opts);
  assert.equal(r.valid, false);
  assert.deepEqual(r.errors, { message: MESSAGES.messageShort });
});

test('validateBooking: a complete inquiry passes', () => {
  const r = validateBooking({ ...base, date: '2027-06-07', venue: 'The Sinclair', phone: '+44 20 7946 0958', message: 'About 120 guests 🎉' }, opts);
  assert.deepEqual(r, { valid: true, errors: {} });
});

test('validateBooking: a bypassed, hostile payload is rejected field by field', () => {
  const r = validateBooking({ eventType: 'Admin', name: 'x', email: 'nope', phone: 'DROP TABLE', venue: ' ', message: 'x'.repeat(5000) }, opts);
  assert.equal(r.valid, false);
  assert.deepEqual(Object.keys(r.errors), ['eventType', 'venue', 'name', 'email', 'phone', 'message']);
});

test('normalizeBooking trims strings and blanks anything else', () => {
  assert.deepEqual(normalizeBooking({ name: '  Jo  ', email: ['x'], phone: 5 }), {
    eventType: '', date: '', venue: '', name: 'Jo', email: '', phone: '', message: ''
  });
});

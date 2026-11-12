# Google Calendar shows integration

The homepage keeps its existing cards, responsive columns, venue buttons and cyan
Next Show highlight. It now fetches `/.netlify/functions/shows` in the browser.
There is no Nuxt server route and no Calendar data is fetched during generation.
The old `data/shows.mjs` is retained as history only; it is not imported by the
homepage or used as a fallback.

## Publication requirements

- Title: venue name, used directly and unchanged for the card's venue field.
  Never derived from the address. No `[SHOW]` prefix is required or stripped.
- Start/end: Google Calendar dates/times. Each performance gets its own row,
  displaying its date and start time in `America/New_York`, e.g.
  `Wed, Nov 18 2026 @ 6:00pm`. Multi-night bookings expand into daily rows.
  All-day bookings expand into daily rows without a time. Each row expires
  after that performance's end time.
- Location: full Google Maps venue address. Only the recognized `City, ST` is
  displayed. US state abbreviations/full names, ZIP codes, country names,
  multiline addresses and combined city/state lines are supported. Missing or
  ambiguous locations keep the existing location placeholder, without guessing
  a city or state. No geocoding requests or full address display.
- Description: venue HTTP/HTTPS website on its own line, followed by `#confirmedshow`.

Example description:

```text
https://www.pressroomnh.com/
#confirmedshow
```

Only the exact, case-sensitive, standalone `#confirmedshow` in description text
opts an event in. Similar hashtags, longer words, title-only markers, URL fragments,
and HTML attributes/comments do not opt events in. Google rich-text descriptions
and linked URLs are supported. The first valid HTTP/HTTPS URL is used for Venue
Information; JavaScript, non-HTTP protocols and credential-bearing URLs are ignored. No valid
HTTP/HTTPS URL means the existing disabled venue button is shown.

Unmarked private events, rehearsals and days off are excluded. Cancelled events
and nonstandard Google event types (such as out-of-office) are excluded. The
marker is an explicit instruction to publish the title, location and dates; do
not add it to an event whose title or address must stay private.

The public response contains only `id`, `title`, `venue`, `start`, `end`, `allDay`,
`dateCheckString`, `dateString`, `location`, and `link`. Full descriptions,
attendees, organizers, calendar IDs and credentials never enter the response.
Upstream errors are not returned or logged.

## Weekend bookings at the same venue

Create one event starting at the first night's show time and ending when the
final night's show finishes. For Friday through Sunday at 9pm, ending Monday at
1am, set Friday 9pm as the start and Monday 1am as the end. The site displays three separate rows: Friday, Saturday and Sunday at 9pm.
Each row retains the same venue, location and website; past nights disappear
independently. Nightly times stay consistent across daylight saving changes.

An end clock time at or before the start clock time belongs to the preceding
performance date, so an ordinary overnight show stays a single-night listing.
All-day event end dates are exclusive. Use separate events when nights have
different start times or the booking skips a day. Keep the venue title, location,
website and `#confirmedshow` description marker as usual.

## Google Cloud and Netlify setup

1. Enable the Google Calendar API in a Google Cloud project.
2. Create a service account and credentials for server-side authentication.
3. Share the band's existing calendar with that service account's email, granting
   **See all event details**. Keep the calendar itself private. A Workspace admin
   may need to permit this sharing. Domain-wide delegation is not needed for
   direct sharing.
4. In Netlify, set these variables with **Functions** scope for the preview/branch
   context first, and production when ready:
   - `GOOGLE_CALENDAR_ID`: the shared calendar's actual ID, not `primary`.
   - `GOOGLE_CLIENT_EMAIL`: the service account email.
   - `GOOGLE_PRIVATE_KEY`: its PEM private key; real line breaks
     and literal `\n` sequences are supported.
5. Use Node.js 22 or later in Netlify. Keep credentials out of source control and
   `runtimeConfig.public`. The function uses `calendar.events.readonly`.
6. Deploy this feature branch to a Netlify preview/branch deploy. `netlify.toml`
   adds only function settings, leaving existing build/publish settings alone.
   If the site uses static Nuxt, its build command remains `npm run generate`
   and publish directory `.output/public`. Do not deploy only the static folder:
   the standalone function must be deployed alongside it.

The function expands recurring events and follows every result page, then filters
on the server. It requests ongoing/upcoming events through one year ahead. Events
disappear after their actual end time; all-day bookings disappear at Boston
midnight after their final day. Successful responses have a five-minute Netlify
CDN cache; failures are uncached and do not fall back to manual private events.
The browser refreshes every five minutes and on focus. Allow approximately ten
minutes for an already-open tab to reflect an edit (CDN cache plus polling).
Ordinary Calendar edits do not require a Netlify rebuild. Credential/code changes
do require redeployment.

## Local development

Use the project-local Netlify CLI installed by `npm install`:

```sh
npm run dev:mock
```

Open **http://localhost:8888**, including for the frontend. Netlify Dev proxies
Nuxt on internal port 3001 and serves `netlify/functions/shows` at
`http://localhost:8888/.netlify/functions/shows`. The frontend uses that same-site
relative endpoint; no URL or production routing change is needed. `[dev]` settings
in `netlify.toml` are local-only; production build and publish settings are untouched.

Mock mode automatically uses `--offline`, so it needs no Netlify login/site link,
Google credentials, or real Calendar API requests. It supplies a synthetic future
**Test Show**, plus private/day-off/near-match fixtures that are excluded by the
same filtering code as real events. This is not verification of the real Google
Calendar test event. Mocks require both `CALENDAR_MOCK=true` and Netlify's
`NETLIFY_DEV=true`; production, deploy-preview and branch-deploy contexts reject
mock mode. A request parameter cannot enable it.

For the real integration:

```sh
npm run dev
```

Configure the server-only variables from `.env.example` in your ignored `.env` or
linked Netlify site's function environment. To test missing credentials without
remote environment injection, leave them unset and run `npm run dev -- --offline`.
The endpoint returns HTTP 503 with a generic message and `Cache-Control: no-store`;
no key, Calendar ID, raw upstream error or description is exposed.

`npm run dev:nuxt` starts only Nuxt on port 3001. That port does **not** serve
Netlify Functions; use port 8888 for all end-to-end checks. Stop any previous server
on ports 8888/3001 before starting another Netlify Dev process.

```sh
npm test
npm run generate
```

Static generation does not contact Google or need Calendar credentials. Avoid
running generation against the same working tree as a running Nuxt dev server,
since both write `.nuxt`; stop dev first or use a separate checkout.

## Deployment verification: confirmed venue event

The latest mapping changes have not been deployed yet. Local tests verify the
example event and privacy rules. Once a branch deployment is authorized:

1. Use the existing confirmed event, with its title set to **Bill's Bar & Lounge**,
   the full venue address in Location, and the website plus `#confirmedshow` in
   Description. Its start should be November 18, 2026 at 6:00 PM in Boston.
2. Run `node scripts/verify-calendar.mjs https://YOUR-PREVIEW.netlify.app`.
   An optional third argument selects another exact event title. The script
   verifies the title/venue mapping, dates, safe venue URL and public field
   allowlist without printing descriptions.
3. Check that the card displays `Wed, Nov 18 2026 @ 6:00pm`,
   `Bill's Bar & Lounge`, `Boston, MA`, and a Venue Information button pointing to
   `https://www.lansdownepubboston.com/`. Check desktop and mobile layout.
4. If changes to the test event are authorized, remove its marker and confirm it
   disappears after cache expiry; restore it and confirm it reappears. Repeat
   with `#confirmedshows` to verify longer hashtags stay excluded.
5. Confirm unmarked private events and days off are absent from both the page
   and JSON. No Calendar events are modified by the verification script.

References: [Google events.list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list),
[service accounts](https://developers.google.com/identity/protocols/oauth2/service-account),
[Netlify Functions](https://docs.netlify.com/build/functions/api/),
[function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

## Safe server diagnostics

The public error stays generic (HTTP 503, uncached). Its `X-Calendar-Request-ID`
response header correlates with a single JSON `calendar_shows_failure` entry in
Netlify Function logs. The entry includes only a generated request ID, fixed
failure code/stage, optional numeric Google HTTP status, known Google reason code,
and missing environment variable **names**. It never logs raw Error objects,
stacks, request URLs, credentials, tokens, response bodies, descriptions or events.

| Failure code | Meaning / next check |
| --- | --- |
| `MISSING_ENVIRONMENT` | Set the listed variable names in the branch context with Functions scope, then redeploy. Whitespace-only values count as missing. |
| `INVALID_CREDENTIAL_FORMAT` | Check the PEM RSA private key format and service-account email. Never paste them into logs. |
| `AUTHENTICATION_FAILED` | Check revoked/wrong keys, account identity and token authorization. `invalid_grant` is a token-stage rejection, not proof of Calendar sharing failure. |
| `CALENDAR_PERMISSION_DENIED` | Google returned 403. Check calendar sharing, account identity and read scope. |
| `CALENDAR_NOT_FOUND_OR_INACCESSIBLE` | Google returned 404. Verify both the exact calendar ID and sharing with this service account. A 404 alone cannot distinguish a wrong ID from a private inaccessible calendar. |
| `CALENDAR_API_DISABLED` | Enable Calendar API in the service account's Google project; Google reported a recognized disabled-service reason. |
| `GOOGLE_RATE_LIMITED` | Google returned 429 or a recognized quota/rate-limit reason. |
| `NETWORK_FAILURE` / `REQUEST_TIMEOUT` | Check connectivity and upstream availability at the reported stage. |
| `GOOGLE_API_FAILURE` | Other Google HTTP error; use the sanitized status/reason to investigate. |
| `INVALID_CALENDAR_RESPONSE` | Unexpected JSON/response shape or pagination. |
| `RUNTIME_FAILURE` | Other runtime error; investigate code/runtime using the request ID. Raw exception details are deliberately omitted. |

The function uses the existing Netlify variables `GOOGLE_CALENDAR_ID`,
`GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY`. No Netlify environment variables
need to be renamed. Missing-variable diagnostics report these exact names.

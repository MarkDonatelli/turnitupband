# Google Calendar shows integration

The homepage keeps its existing cards, responsive columns, venue buttons and cyan
Next Show highlight. It now fetches `/.netlify/functions/shows` in the browser.
There is no Nuxt server route and no Calendar data is fetched during generation.
The old `data/shows.mjs` is retained as history only; it is not imported by the
homepage or used as a fallback.

## Publication requirements

- Title: event name, displayed exactly as entered. No `[SHOW]` prefix is required
  or stripped.
- Start/end: Google Calendar dates/times. Timed events display both times in
  `America/New_York`; overnight events include both dates. All-day ranges respect
  Google's exclusive end date and are displayed as one booking.
- Location: public venue name and address, displayed as entered.
- Description: venue HTTPS website on its own line, followed by `#confirmedshow`.

Example description:

```text
https://www.pressroomnh.com/
#confirmedshow
```

Only the exact, case-sensitive, standalone `#confirmedshow` in description text
opts an event in. Similar hashtags, longer words, title-only markers, URL fragments,
and HTML attributes/comments do not opt events in. Google rich-text descriptions
and linked URLs are supported. The first valid HTTPS URL is used for Venue
Information; HTTP, JavaScript and credential-bearing URLs are ignored. No valid
HTTPS URL means the existing disabled venue button is shown.

Unmarked private events, rehearsals and days off are excluded. Cancelled events
and nonstandard Google event types (such as out-of-office) are excluded. The
marker is an explicit instruction to publish the title, location and dates; do
not add it to an event whose title or address must stay private.

The public response contains only `id`, `title`, `start`, `end`, `allDay`,
`dateCheckString`, `dateString`, `location`, and `link`. Full descriptions,
attendees, organizers, calendar IDs and credentials never enter the response.
Upstream errors are not returned or logged.

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
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: the service account email.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: its PEM private key; real line breaks
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

## Deployment verification: Test Show

Live verification has **not** been performed yet. The current checkout is not
linked to a Netlify site, credentials are not configured locally, and the Google
Calendar connector is not connected in this session. Local tests use synthetic
fixtures and do not prove that the real event is accessible.

Once deployed with credentials:

1. Read the existing **Test Show** event; ensure its date is ongoing/upcoming
   within the next year, its location is populated, and its description contains
   the venue website and `#confirmedshow`. Do not rename it or copy private notes
   into the website.
2. Run `node scripts/verify-calendar.mjs https://YOUR-PREVIEW.netlify.app`.
   This checks the deployed endpoint for the exact title, a valid HTTPS venue
   website, and the public field allowlist without printing descriptions.
3. Open the preview and verify the Test Show card's title, times, location and
   venue button against the Calendar event. Check desktop and mobile layout.
4. If changes to the test event are authorized, remove its marker and confirm it
   disappears after cache expiry; restore the marker and confirm it reappears.
   Repeat with `#confirmedshows` to confirm longer hashtags stay excluded.
5. Confirm unmarked private events and days off are absent from both the page
   and the JSON response. Calendar editing is optional; use existing unmarked
   events for this check.

References: [Google events.list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list),
[service accounts](https://developers.google.com/identity/protocols/oauth2/service-account),
[Netlify Functions](https://docs.netlify.com/build/functions/api/),
[function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

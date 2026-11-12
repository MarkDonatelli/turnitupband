# Nuxt 3 Minimal Starter

Google Calendar shows setup and deployment verification:
[Calendar integration](docs/google-calendar.md).

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Run the full Nuxt + standalone Netlify Functions app with synthetic Calendar data:

```bash
npm run dev:mock
```

Open **http://localhost:8888**. No Google credentials or Netlify login are needed
in mock mode. Netlify Dev runs Nuxt internally on port 3001 and serves
`/.netlify/functions/shows` on port 8888.

Use `npm run dev` for real Calendar data after configuring the server-only
environment variables. `npm run dev:nuxt` runs Nuxt alone and does not serve
Netlify Functions. See [Calendar setup](docs/google-calendar.md) for details.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

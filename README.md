# WUTT website

## Contact email setup

Requires Node.js 22.18+ (Node.js 24 recommended). The form posts to
`/api/contact`; only the server reads the Resend credential. No additional
dependencies are needed.

Set these values in the ignored `.env` file, or in your host's server environment:

```dotenv
RESEND_API_KEY=your_resend_key
CONTACT_FROM_EMAIL=onboarding@resend.dev
CONTACT_TO_EMAIL=your_inbox@example.com
```

The `onboarding@resend.dev` sender can only send to your Resend account email.
For other recipients, verify a domain in Resend and set `CONTACT_FROM_EMAIL` to
an address on that domain. The visitor's email is used as `reply_to`, so replies
go directly to them. Never prefix these variables with `VITE_` or commit `.env`.
See [Resend's sender restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

- Development: `npm run dev` serves the app and contact API together. Restart it after changing `.env`.
- Production: run `npm run build`, then `npm start` to serve `dist` and the API together.
- The production server defaults to `127.0.0.1:3000`. Set `HOST=0.0.0.0` and `PORT`
  as required by your host, and use HTTPS through your host or reverse proxy.
- Static-only hosting of `dist` cannot send emails. Deploy the Node server too,
  or adapt the handler to your host's serverless functions.
- Run `npm test` for HTTP-level contact API tests using a mocked email provider;
  these tests never send real emails.

The endpoint validates fields, caps request bodies, and limits each socket IP
to five submissions per ten minutes. The limiter is held in process memory;
behind a proxy, clients may share a limit. Configure trusted proxy handling and
a shared rate-limit store before scaling to multiple instances. Retries for an
unchanged submission reuse Resend's idempotency key to avoid duplicate emails.
Provider acceptance is reported as success; it does not confirm inbox delivery.

## Vite template reference

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

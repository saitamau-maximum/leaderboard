import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import Header from "./components/header";
import {
  OGP_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  TWITTER_ID,
} from "./constants/config";

import type { LinksFunction } from "@remix-run/cloudflare";
import "~/style/global.css";
import "@saitamau-maximum/ui/style.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="robots" content="noindex" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={`@${TWITTER_ID}`} />
        <meta name="twitter:creator" content={`@${TWITTER_ID}`} />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OGP_URL} />
        <meta property="og:url" content="https://leaderboard.maximum.vc/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={OGP_URL} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <script src="/scripts/theme.js" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </Layout>
    );
  } else if (error instanceof Error) {
    return (
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1>Unknown Error</h1>
      </Layout>
    );
  }
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

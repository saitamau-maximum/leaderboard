import type { LinksFunction } from "@remix-run/cloudflare";
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/scripts/theme.js" />
        {/* プライベート開催のため、一応検索エンジンにインデックスされないようにする */}
        <meta name="robots" content="noindex" />
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

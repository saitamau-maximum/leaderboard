import "@remix-run/cloudflare";

interface Env {
  DB: D1Database;
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: Env;
  }
}

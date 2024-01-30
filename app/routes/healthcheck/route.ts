import { json } from "@remix-run/cloudflare";

import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    status: "OK",
  });
};

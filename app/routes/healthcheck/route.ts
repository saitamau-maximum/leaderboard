import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    status: "OK",
  });
};

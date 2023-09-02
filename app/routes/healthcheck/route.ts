import { LoaderArgs, json } from "@remix-run/cloudflare";

export const loader = async ({ context }: LoaderArgs) => {
  return json({
    status: "OK",
  });
};

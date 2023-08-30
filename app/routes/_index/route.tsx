import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { Register } from "./register";
import { SITE_TITLE } from "~/constants/config";
import { Hero } from "./hero";
import { Description } from "./description";

export const meta: V2_MetaFunction = () => {
  return [{ title: SITE_TITLE }];
};

export default function HomePage() {
  return (
    <MaxWidthCenterLayout>
      <Hero />
      <Description />
      <Register />
    </MaxWidthCenterLayout>
  );
}
